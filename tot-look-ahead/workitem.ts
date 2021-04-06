import * as ReleaseApi from 'azure-devops-node-api/ReleaseApi';
import * as ReleaseInterfaces from 'azure-devops-node-api/interfaces/ReleaseInterfaces';
import * as BuildApi from 'azure-devops-node-api/BuildApi';
import * as BuildInterfaces from 'azure-devops-node-api/interfaces/BuildInterfaces';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import * as azdev from 'azure-devops-node-api';
import * as tl from 'azure-pipelines-task-lib/task';
import * as VSSInterfaces from 'azure-devops-node-api/interfaces/common/VSSInterfaces';

//ADO Connecton Objects

let webApi: azdev.WebApi;
let releaseApi: ReleaseApi.IReleaseApi;
let buildApi: BuildApi.IBuildApi;
let workItemApi: WorkItemTrackingApi.IWorkItemTrackingApi;
let build: BuildInterfaces.Build ;
let releaseId:number = Number(tl.getVariable("Release.ReleaseId"));
let buildId:number = Number(tl.getVariable("Build.BuildId"));
let teamProject = tl.getVariable("System.TeamProject")||'';
let environmentId:number = Number(tl.getVariable("Release.EnvironmentId"));
let deploymentId: number = Number(tl.getVariable("Release.DeploymentID"));
 let phaseId:number = Number(tl.getVariable("Release.DeployPhaseID"));
let collectionUri='';
//ADO Connecton Objects
let endpointUrlDefault: string = tl.getVariable('System.TeamFoundationCollectionUri')||'';
let accessTokenDefault: string = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false)||'';



// //debug
// endpointUrlDefault ='https://azuredevops.aa.com/USAIT/';
// accessTokenDefault ="mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// releaseId = 137672;
// buildId = 700605
// teamProject = 'TechOpsR';
//  environmentId =698075
//  deploymentId =180041
//  phaseId = 176215

async function getWorkItemsforNotes(endpointUrl : string  = endpointUrlDefault,accessToken: string=accessTokenDefault ){
    collectionUri=endpointUrl;
    const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(accessToken);
    webApi = new azdev.WebApi(endpointUrl, credentialHandler);

    releaseApi = await getReleaseApi();
    buildApi = await getBuildApi();
    workItemApi = await getWorkItemApi();
    let releaseNotes='';

    let releaseNotesWorkItems:WorkItemTrackingInterfaces.WorkItem[] = await getWorkItemsForReleaseNotes();
    if (releaseNotesWorkItems !== null && releaseNotesWorkItems !== undefined && releaseNotesWorkItems.length > 0) {
        
            releaseNotesWorkItems.forEach(f => {
            if(f.fields){
                releaseNotes =
                    releaseNotes +
                    "WorkItem Id: " +                    
                    f.id?.toString() +
                    ((f.fields["AAIT.ID"] === undefined) ? "" : " Rally Id: " + f.fields["AAIT.ID"]) +
                    '   ' +
                    f.fields["System.Title"] +
                    '\n'
            };
            
            });

        
    
}  
    console.log(releaseNotes)
    return releaseNotes  

}

async function getReleaseApi() {
  let releaseApi;
  try {
    releaseApi = await webApi.getReleaseApi();
    tl.debug('Retrieved release work items.');
    return releaseApi;
  } catch (e) {
    tl.error('Unable to initialize getReleaseApi');
    tl.error(e.toString());
    setFailedRelease();
    return null;
  }
  return releaseApi;
}
function setFailedRelease() {
  tl.setResult(tl.TaskResult.Failed, 'Failed', undefined);
}

async function getBuildApi() {
  let buildApi = await webApi.getBuildApi();
  return buildApi;
}

async function getWorkItemApi() {
  let workItemApi = await webApi.getWorkItemTrackingApi();
  return workItemApi;
}

async function getBuildWorkItems() {
  try {
    const buildWorkItemRefs: VSSInterfaces.ResourceRef[] = await buildApi.getBuildWorkItemsRefs(
      teamProject,
      build.id || 0
    );
    tl.debug('Retrieved Build work items.');
    return buildWorkItemRefs;
  } catch (e) {
    tl.error('Unable to retrieve Build Work Items.');
    tl.error(e.toString());
    setFailedRelease();
    return null;
  }
}

async function getReleaseWorkItems() {
  try {
    const releaseWorkItemRefs: ReleaseInterfaces.ReleaseWorkItemRef[] = await releaseApi.getReleaseWorkItemsRefs(
      teamProject,
      releaseId
    );
    tl.debug('Retrieved release work items.');
    return releaseWorkItemRefs;
  } catch (e) {
    tl.error('Unable to retrieve Release Work Items.');
    tl.error(e.toString());
    setFailedRelease();
    return null;
  }
}

async function getWorkItems(workItemIds: number[]) {
    try {
        let onPrem=false;
        if (collectionUri.indexOf("dev.azure.com") === -1 || collectionUri.indexOf("visualstudio.com") === -1) {
            onPrem = true;
        }
        let fieldsOnPrem: string[] = ["System.Id", "AAIT.ID", "System.Title", "System.WorkItemType"];

        //*************************************F I X   T H I S **********************************************************************************
        let fieldsSaaS: string[] = ["System.Id", "System.Title", "System.WorkItemType"];

        const workItems: WorkItemTrackingInterfaces.WorkItem[] = await workItemApi.getWorkItems(workItemIds,  onPrem ? fieldsOnPrem : fieldsSaaS);
        tl.debug("Retrieved work items.");
        return workItems;
    } catch (e) {
        tl.error("Unable to retrieve Work Items.");
        tl.error(e.toString());
        setFailedRelease();
        return null;
    }
}
async function getWorkItemsForReleaseNotes() {
  let workItemIds: number[] = new Array<number>();
  let returnValue: WorkItemTrackingInterfaces.WorkItem[] = [];
  let isRelease;

  if (releaseId !== undefined && releaseId !== null && releaseId > 0) {
    isRelease = true;
  }

  if (isRelease) {
    let releaseWorkItems: ReleaseInterfaces.ReleaseWorkItemRef[] = (await getReleaseWorkItems()) || [];
    if (releaseWorkItems !== null && releaseWorkItems !== undefined && releaseWorkItems.length > 0) {
      releaseWorkItems.forEach((fe) =>
        workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null
      );
    }
  }

  if (buildId !== undefined && buildId !== null && buildId > 0) {
    build = await getBuild();
  }

  if (build !== null && build !== undefined) {
    let buildWorkItems = await getBuildWorkItems();
    if (buildWorkItems !== null && buildWorkItems !== undefined && buildWorkItems.length > 0) {
      buildWorkItems.forEach((fe) =>
        workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null
      );
    }

    let buildCommitWorkItems = await getBuildCommitWorkItems([build.sourceVersion || '']);
    if (buildCommitWorkItems !== null && buildCommitWorkItems !== undefined && buildCommitWorkItems.length > 0) {
      buildCommitWorkItems.forEach((fe) =>
        workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null
      );
    }

    if (workItemIds !== null && workItemIds !== undefined && workItemIds.length > 0) {
      let workItems = (await getWorkItems(workItemIds)) || [];
      returnValue = workItems;
    }
  }
  return returnValue;
}

async function getBuild() {
  try {
    const returnedBuild: BuildInterfaces.Build = await buildApi.getBuild(teamProject, buildId);
    tl.debug('Retrieved Build.');
    return returnedBuild;
  } catch (e) {
    tl.error('Unable to retrieve Build.');
    tl.error(e.toString());
    setFailedRelease();
    throw e;
  }
}

async function getBuildCommitWorkItems(commitIds: string[]) {
  try {
    const buildWorkItemRefs: VSSInterfaces.ResourceRef[] = await buildApi.getBuildWorkItemsRefsFromCommits(
      commitIds,
      teamProject,
      buildId
    );
    tl.debug('Retrieved Build Commit work items.');
    return buildWorkItemRefs;
  } catch (e) {
    tl.error('Unable to retrieve Build Commit Work Items.');
    tl.error(e.toString());
    setFailedRelease();
    return null;
  }
}

async function getReleaseEndTime(endpointUrl : string  = endpointUrlDefault,accessToken: string=accessTokenDefault ) {    
    const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(accessToken);
    webApi = new azdev.WebApi(endpointUrl, credentialHandler);
    releaseApi = await getReleaseApi();
    let release = await getRelease();
    
    let deploymentJobs = release?.environments?.find(w => w?.id === environmentId)?.deploySteps
        ?.find(f => f?.deploymentId === deploymentId)
        ?.releaseDeployPhases?.find(g => g?.phaseId === phaseId.toString())?.deploymentJobs;
   
    let endDate = "";
    if(deploymentJobs){
    for (let deploymentJob of deploymentJobs) {
        if (deploymentJob.tasks !== undefined) {
            var taskGroups = deploymentJob.tasks;
            for (let taskGroup of taskGroups) {
                if (taskGroup.task !== undefined) {
                    var task = taskGroup.task;

                    if (task?.name?.indexOf('Cherwell') === 0) {
                        try {
                            endDate = taskGroup?.dateStarted?.toLocaleString("en-US", { timeZone: "America/Chicago" })||'';
                        }
                        catch (e) {
                            endDate = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
                        }

                    }
                }
            }
        }
    }
}
    return endDate;
}
async function getRelease() {
    try {
        const release: ReleaseInterfaces.Release = await releaseApi.getRelease(teamProject, releaseId, undefined, undefined, ReleaseInterfaces.SingleReleaseExpands.Tasks, undefined);
        tl.debug("Retrieved release");
        return release;
    } catch (e) {
        tl.error("Unable to retrieve Release.");
        tl.error(e.toString());
        setFailedRelease();
        return null;
    }
}

async function getReleaseStartTime (endpointUrl : string  = endpointUrlDefault,accessToken: string=accessTokenDefault ) {   
  const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(accessToken);
  webApi = new azdev.WebApi(endpointUrl, credentialHandler);
  releaseApi = await getReleaseApi();


let release = await getRelease();    
if(release){

return release?.environments?.find(w => w.id == environmentId)?.deploySteps
   ?.find(f => f.deploymentId === deploymentId)?.releaseDeployPhases?.find(g => g.phaseId == phaseId.toString())?.startedOn?.toLocaleString("en-US", { timeZone: "America/Chicago" });

   return  (new Date).toLocaleString("en-US", { timeZone: "America/Chicago" });
}

}

export {getWorkItemsforNotes, getReleaseEndTime , getReleaseStartTime};


// function setdebugVariable(){

// // let azdoToken = "mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// //  collectionUri = 'https://azuredevops.aa.com/USAIT/';
// // //const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(azdoToken);

// endpointUrlDefault ='https://azuredevops.aa.com/USAIT/';
// accessTokenDefault ="mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// releaseId = 137672;
// buildId = 700605
// teamProject = 'TechOpsR';
//  environmentId =698075
//  deploymentId =180041
//  phaseId = 176215
// }

// //Debugging the code for testing.



// let result= getWorkItemsforNotes(collectionUri,azdoToken);
// console.log(result);


//  //let result= await getReleaseStartTime(collectionUri,azdoToken);

 //getReleaseStartTime(collectionUri,azdoToken).then((x)=> console.log(x)  )
 //getReleaseEndTime(collectionUri,azdoToken).then((x)=> console.log(x)  )
