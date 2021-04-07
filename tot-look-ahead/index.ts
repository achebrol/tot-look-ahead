import * as tl from 'azure-pipelines-task-lib/task';
import fetch from 'node-fetch';
import FormData = require('form-data');
import { getWorkItemsforNotes, getReleaseEndTime, getReleaseStartTime } from './workitem';

import httpsProxyAgent from 'https-proxy-agent';

    const url = 'https://spteam.aa.com/sites/MnE/TechOps';
    const listName = 'TOT-LookAhead';
    const listNameType = 'SP.Data.TOTLookAheadListItem';
    let clientId: string | undefined = tl.getInput('clientId', true);    
    let clientSecret: string | undefined = tl.getInput('clientSecret', true);
    let changeNo: string | undefined = tl.getInput('changeNo', true);
    let status: string | undefined = tl.getInput('status', true);
    let changeTitle: string | undefined =  tl.getInput('changeTitle', true);
    let application: string | undefined = tl.getInput('application', true);
    let businessDescription: string | undefined = tl.getInput('businessDescription', false) 
    let technicalDescription: string | undefined = tl.getInput('technicalDescription', false);
    let impact: string | undefined = tl.getInput('impact', true);
    let srManager: string | undefined = tl.getInput('srManager', true);
    let startDate: string | undefined|null = ''; 
    let endDate: string | undefined|null = ''; 
    let teamsInvolved: string | undefined = tl.getInput('teamsInvolved', false);
    let comms: string | undefined = tl.getInput('comms', false);
    let commsUrl: string | undefined = tl.getInput('commsUrl', false);
    let commsText: string | undefined = tl.getInput('commsText', false);
    let fleetMigrationImpact: string | undefined = tl.getInput('fleetMigrationImpact', false);
    let assignedResource: string | undefined = tl.getInput('assignedResource', false);
    let additionalNotesUrl: string | undefined = tl.getInput('additionalNotesUrl', false);
    let additionalNotesText: string | undefined = tl.getInput('additionalNotesText', false);
    let proxyUrl: string | undefined = tl.getInput('proxyUrl', false);


async function run() {
  try {
    
    startDate =await getReleaseStartTime() || (new Date).toLocaleString()
    endDate = await getReleaseEndTime() || (new Date).toLocaleString()
    businessDescription =(businessDescription||'')+ '\n' + (await getWorkItemsforNotes());
    status = status == "Succeeded" ? "Complete" : status;
    const tenantName = 'spteam.aa.com';
    const tenantId = '49793faf-eb3f-4d99-a0cf-aef7cce79dc1';
    const resourceId = '00000003-0000-0ff1-ce00-000000000000';
    const tokenUrl = `https://accounts.accesscontrol.windows.net/${tenantId}/tokens/OAuth/2`;
    let tokenHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let tokenBody = new FormData();
    tokenBody.append('grant_type', 'client_credentials');
    tokenBody.append('client_id', `${clientId}@${tenantId}`);
    tokenBody.append('client_secret', clientSecret);
    tokenBody.append('resource', `${resourceId}/${tenantName}@${tenantId}`);
 ;
    //1. Get Access Token
    let response:any=''
    if  (proxyUrl){
     const agent =  httpsProxyAgent(proxyUrl)
      console.log('proxyUrl' +proxyUrl)
     response = await fetch(tokenUrl, {
      method: 'POST',
      agent: agent,
      body: tokenBody,
    }).then((res) => res.json());
  } else {
    console.log('non proxyUrl')
    response = await fetch(tokenUrl, {
      method: 'POST',      
      body: tokenBody,
    }).then((res) => res.json());
  }
    const access_token = response.access_token;
    //console.log('Access Token:', response);
    //2. Get Digest
    const digestTokenHeaders = {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json;odata=verbose',
      'Content-Type': 'application/json',
    };
    const digestResponse = await fetch(`${url}/_api/contextinfo`, {
      method: 'POST',
      headers: digestTokenHeaders,
    }).then((res) => res.json());
    //console.log('digestResponse', digestResponse);
    const digest = digestResponse.d.GetContextWebInformation.FormDigestValue;
    //3.Create TOT LookAhead Item    
    const lookAheadItemBody = {
      __metadata: {
        type: listNameType,
      },
      Change_x0020__x0023__x0020_Requi: changeNo || 'N/A',
      Scheduled: status || 'Completed',
      Application_x002f_System: application,
      Attachments: false,
      Title: changeTitle,
      Start_x0020_Date_x0020__x0026__x: startDate,
      End_x0020_Date_x0020__x0026__x00: endDate,
      Business_x0020_Description: businessDescription,
      Technical_x0020_Description: technicalDescription,
      Impact: impact,
      Teams_x0020_Involved: teamsInvolved,
      Sr_x002e__x0020_Manager: srManager,
      Comms: comms || 'No Comm Required',
      Fleet_x0020_Migration_x0020_Impa: fleetMigrationImpact || 'No',
      Comms_x0020_URL_x003a_: {
        __metadata: { type: 'SP.FieldUrlValue' },
        Description: commsUrl,
        Url: commsText || commsUrl,
      },
      Assigned_x0020_Resource: assignedResource,
      Additional_x0020_Notes: {
        __metadata: { type: 'SP.FieldUrlValue' },
        Description: additionalNotesUrl,
        Url: additionalNotesText || additionalNotesUrl,
      },
      Fleet_x0020_Migration_x0020_Cale: false,
     };
    const listUrl = `${url}/_api/web/lists/GetByTitle('${listName}')/items`;
    const lookAheadItemHeaders = {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',

      'X-RequestDigest': digest,
    };    
    const itemResponse = await fetch(listUrl, {
      method: 'POST',
      body: JSON.stringify(lookAheadItemBody),
      headers: lookAheadItemHeaders,
    }).then((res) => {
      console.log(res.clone().status);
      console.log(res.clone().statusText);        
      return res.json();
    });
    
    console.log('Successfully added item to TOT LookAhead List');
    console.log('List Item Link:', itemResponse.d.__metadata.uri);
    tl.setVariable('TOT_LookAhead_Item_Link', itemResponse.d.__metadata.uri, false, true);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}
//enableDebugValues();
run();

// function enableDebugValues(){
//   clientId='38ca5562-5dcf-4f7a-9afa-75cd3f7d551b'
//   clientSecret= '6y2Zce-15M-.48cfNif.2LMC.CrVKTsj1C'
//   changeNo='testing-TOT'
//   status='Completed'
//   changeTitle='testing the tool'
//   application='LMO'
//   businessDescription =''
//   technicalDescription =''
//   impact ="No Outage Expected",
//   srManager ='Kyle Wander'
//   teamsInvolved ='LM-Apps'
//   comms =''
//   commsUrl =''
//   commsText =''
//   fleetMigrationImpact ='No'
//   assignedResource ='No'
//   additionalNotesUrl =''
//   additionalNotesText =''

// }