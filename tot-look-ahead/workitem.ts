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
let build: BuildInterfaces.Build;
let releaseId: number = Number(tl.getVariable('Release.ReleaseId'));
let buildId: number = Number(tl.getVariable('Build.BuildId'));
let teamProject = tl.getVariable('System.TeamProject') || '';
//ADO Connecton Objects
let endpointUrlDefault: string = tl.getVariable('System.TeamFoundationCollectionUri') || '';
let accessTokenDefault: string =
  tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false) || '';

async function getWorkItemsforNotes(
  endpointUrl: string = endpointUrlDefault,
  accessToken: string = accessTokenDefault
) {
  const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(accessToken);
  webApi = new azdev.WebApi(endpointUrl, credentialHandler);

  releaseApi = await getReleaseApi();
  buildApi = await getBuildApi();
  workItemApi = await getWorkItemApi();
  let releaseNotes = '';

  let releaseNotesWorkItems: WorkItemTrackingInterfaces.WorkItem[] = await getWorkItemsForReleaseNotes();
  if (releaseNotesWorkItems !== null && releaseNotesWorkItems !== undefined && releaseNotesWorkItems.length > 0) {
    releaseNotesWorkItems.forEach((f) => {
      if (f.fields) {
        releaseNotes =
          releaseNotes +
          'WorkItem Id: ' +
          f.id?.toString() +
          (f.fields['AAIT.ID'] === undefined ? '' : ' Rally Id: ' + f.fields['AAIT.ID']) +
          '   ' +
          f.fields['System.Title'] +
          '\n';
      }
    });
  }
  console.log(releaseNotes);
  return releaseNotes;
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
    let fieldsOnPrem: string[] = ['System.Id', 'AAIT.ID', 'System.Title', 'System.WorkItemType'];

    //*************************************F I X   T H I S **********************************************************************************
    let fieldsSaaS: string[] = ['System.Id', 'AAIT.ID', 'System.Title', 'System.WorkItemType'];

    const workItems: WorkItemTrackingInterfaces.WorkItem[] = await workItemApi.getWorkItems(workItemIds, fieldsOnPrem);
    tl.debug('Retrieved work items.');
    return workItems;
  } catch (e) {
    tl.error('Unable to retrieve Work Items.');
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

export { getWorkItemsforNotes };

// //Debugging the code for testing.
// let azdoToken = "mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// let collectionUri = 'https://azuredevops.aa.com/USAIT/';
// //const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(azdoToken);
// releaseId = 137672;
// buildId = 700605
// teamProject = 'TechOpsR';

// let result= getWorkItemsforNotes(collectionUri,azdoToken);
// console.log(result);
