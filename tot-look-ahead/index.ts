import * as tl from 'azure-pipelines-task-lib/task';
import fetch from 'node-fetch';
import FormData from 'form-data';
async function run() {
  try {
    const url = 'https://spteam.aa.com/sites/MnE/TechOps';
    const listName = 'TOT-LookAhead-Copy';
    const listNameType = 'SP.Data.TOTLookAheadCopyListItem';
    //'https://spteam.aa.com/sites/MnE/TechOps'; //
    //const url: string | undefined = tl.getInput('url', true);
    //'38ca5562-5dcf-4f7a-9afa-75cd3f7d551b'; //
    const clientId: string | undefined = tl.getInput('clientId', true);
    //'6y2Zce-15M-.48cfNif.2LMC.CrVKTsj1C'; //
    const clientSecret: string | undefined = tl.getInput('clientSecret', true);
    //'TOT-LookAhead-Copy'; //
    //const listName: string | undefined = tl.getInput('listName', true);
    const changeNo: string | undefined = tl.getInput('changeNo', true);
    const status: string | undefined = tl.getInput('status', true);
    const changeTitle: string | undefined = tl.getInput('changeTitle', true);
    const application: string | undefined = tl.getInput('application', true);
    const businessDescription: string | undefined = tl.getInput('businessDescription', false);
    const technicalDescription: string | undefined = tl.getInput('technicalDescription', false);
    const impact: string | undefined = tl.getInput('impact', true);
    const srManager: string | undefined = tl.getInput('srManager', true);
    const startDate: string | undefined = tl.getInput('startDate', true);
    const endDate: string | undefined = tl.getInput('endDate', true);
    const teamsInvolved: string | undefined = tl.getInput('teamsInvolved', false);
    const comms: string | undefined = tl.getInput('comms', false);
    const commsUrl: string | undefined = tl.getInput('commsUrl', false);
    const commsText: string | undefined = tl.getInput('commsText', false);
    const fleetMigrationImpact: string | undefined = tl.getInput('fleetMigrationImpact', false);
    const assignedResource: string | undefined = tl.getInput('assignedResource', false);
    const additionalNotesUrl: string | undefined = tl.getInput('additionalNotesUrl', false);
    const additionalNotesText: string | undefined = tl.getInput('additionalNotesText', false);

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

    //1. Get Access Token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: tokenBody,
    }).then((res) => res.json());
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
      console.log(res.status);
      console.log(res.statusText);
      return res.json();
    });
    /*if (inputString == 'bad') {
      tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
      return;
    }*/
    console.log('Successfully added item to TOT LookAhead List');
    console.log('List Item Link:', itemResponse.d.__metadata.uri);
    tl.setVariable('TOT_LookAhead_Item_Link', itemResponse.d.__metadata.uri, false, true);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
