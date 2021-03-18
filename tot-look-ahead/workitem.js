"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getReleaseStartTime = exports.getReleaseEndTime = exports.getWorkItemsforNotes = void 0;
var ReleaseInterfaces = require("azure-devops-node-api/interfaces/ReleaseInterfaces");
var azdev = require("azure-devops-node-api");
var tl = require("azure-pipelines-task-lib/task");
//ADO Connecton Objects
var webApi;
var releaseApi;
var buildApi;
var workItemApi;
var build;
var releaseId = Number(tl.getVariable("Release.ReleaseId"));
var buildId = Number(tl.getVariable("Build.BuildId"));
var teamProject = tl.getVariable("System.TeamProject") || '';
var environmentId = Number(tl.getVariable("Release.EnvironmentId"));
var deploymentId = Number(tl.getVariable("Release.DeploymentID"));
var phaseId = Number(tl.getVariable("Release.DeployPhaseID"));
var collectionUri = '';
//ADO Connecton Objects
var endpointUrlDefault = tl.getVariable('System.TeamFoundationCollectionUri') || '';
var accessTokenDefault = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false) || '';
// //debug
// endpointUrlDefault ='https://azuredevops.aa.com/USAIT/';
// accessTokenDefault ="mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// releaseId = 137672;
// buildId = 700605
// teamProject = 'TechOpsR';
//  environmentId =698075
//  deploymentId =180041
//  phaseId = 176215
function getWorkItemsforNotes(endpointUrl, accessToken) {
    if (endpointUrl === void 0) { endpointUrl = endpointUrlDefault; }
    if (accessToken === void 0) { accessToken = accessTokenDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var credentialHandler, releaseNotes, releaseNotesWorkItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collectionUri = endpointUrl;
                    credentialHandler = azdev.getHandlerFromToken(accessToken);
                    webApi = new azdev.WebApi(endpointUrl, credentialHandler);
                    return [4 /*yield*/, getReleaseApi()];
                case 1:
                    releaseApi = _a.sent();
                    return [4 /*yield*/, getBuildApi()];
                case 2:
                    buildApi = _a.sent();
                    return [4 /*yield*/, getWorkItemApi()];
                case 3:
                    workItemApi = _a.sent();
                    releaseNotes = '';
                    return [4 /*yield*/, getWorkItemsForReleaseNotes()];
                case 4:
                    releaseNotesWorkItems = _a.sent();
                    if (releaseNotesWorkItems !== null && releaseNotesWorkItems !== undefined && releaseNotesWorkItems.length > 0) {
                        releaseNotesWorkItems.forEach(function (f) {
                            var _a;
                            if (f.fields) {
                                releaseNotes =
                                    releaseNotes +
                                        "WorkItem Id: " +
                                        ((_a = f.id) === null || _a === void 0 ? void 0 : _a.toString()) +
                                        ((f.fields["AAIT.ID"] === undefined) ? "" : " Rally Id: " + f.fields["AAIT.ID"]) +
                                        '   ' +
                                        f.fields["System.Title"] +
                                        '\n';
                            }
                            ;
                        });
                    }
                    console.log(releaseNotes);
                    return [2 /*return*/, releaseNotes];
            }
        });
    });
}
exports.getWorkItemsforNotes = getWorkItemsforNotes;
function getReleaseApi() {
    return __awaiter(this, void 0, void 0, function () {
        var releaseApi, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, webApi.getReleaseApi()];
                case 1:
                    releaseApi = _a.sent();
                    tl.debug('Retrieved release work items.');
                    return [2 /*return*/, releaseApi];
                case 2:
                    e_1 = _a.sent();
                    tl.error('Unable to initialize getReleaseApi');
                    tl.error(e_1.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/, releaseApi];
            }
        });
    });
}
function setFailedRelease() {
    tl.setResult(tl.TaskResult.Failed, 'Failed', undefined);
}
function getBuildApi() {
    return __awaiter(this, void 0, void 0, function () {
        var buildApi;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webApi.getBuildApi()];
                case 1:
                    buildApi = _a.sent();
                    return [2 /*return*/, buildApi];
            }
        });
    });
}
function getWorkItemApi() {
    return __awaiter(this, void 0, void 0, function () {
        var workItemApi;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webApi.getWorkItemTrackingApi()];
                case 1:
                    workItemApi = _a.sent();
                    return [2 /*return*/, workItemApi];
            }
        });
    });
}
function getBuildWorkItems() {
    return __awaiter(this, void 0, void 0, function () {
        var buildWorkItemRefs, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, buildApi.getBuildWorkItemsRefs(teamProject, build.id || 0)];
                case 1:
                    buildWorkItemRefs = _a.sent();
                    tl.debug('Retrieved Build work items.');
                    return [2 /*return*/, buildWorkItemRefs];
                case 2:
                    e_2 = _a.sent();
                    tl.error('Unable to retrieve Build Work Items.');
                    tl.error(e_2.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getReleaseWorkItems() {
    return __awaiter(this, void 0, void 0, function () {
        var releaseWorkItemRefs, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, releaseApi.getReleaseWorkItemsRefs(teamProject, releaseId)];
                case 1:
                    releaseWorkItemRefs = _a.sent();
                    tl.debug('Retrieved release work items.');
                    return [2 /*return*/, releaseWorkItemRefs];
                case 2:
                    e_3 = _a.sent();
                    tl.error('Unable to retrieve Release Work Items.');
                    tl.error(e_3.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getWorkItems(workItemIds) {
    return __awaiter(this, void 0, void 0, function () {
        var onPrem, fieldsOnPrem, fieldsSaaS, workItems, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    onPrem = false;
                    if (collectionUri.indexOf("dev.azure.com") === -1 || collectionUri.indexOf("visualstudio.com") === -1) {
                        onPrem = true;
                    }
                    fieldsOnPrem = ["System.Id", "AAIT.ID", "System.Title", "System.WorkItemType"];
                    fieldsSaaS = ["System.Id", "System.Title", "System.WorkItemType"];
                    return [4 /*yield*/, workItemApi.getWorkItems(workItemIds, onPrem ? fieldsOnPrem : fieldsSaaS)];
                case 1:
                    workItems = _a.sent();
                    tl.debug("Retrieved work items.");
                    return [2 /*return*/, workItems];
                case 2:
                    e_4 = _a.sent();
                    tl.error("Unable to retrieve Work Items.");
                    tl.error(e_4.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getWorkItemsForReleaseNotes() {
    return __awaiter(this, void 0, void 0, function () {
        var workItemIds, returnValue, isRelease, releaseWorkItems, buildWorkItems, buildCommitWorkItems, workItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workItemIds = new Array();
                    returnValue = [];
                    if (releaseId !== undefined && releaseId !== null && releaseId > 0) {
                        isRelease = true;
                    }
                    if (!isRelease) return [3 /*break*/, 2];
                    return [4 /*yield*/, getReleaseWorkItems()];
                case 1:
                    releaseWorkItems = (_a.sent()) || [];
                    if (releaseWorkItems !== null && releaseWorkItems !== undefined && releaseWorkItems.length > 0) {
                        releaseWorkItems.forEach(function (fe) {
                            return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null;
                        });
                    }
                    _a.label = 2;
                case 2:
                    if (!(buildId !== undefined && buildId !== null && buildId > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, getBuild()];
                case 3:
                    build = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(build !== null && build !== undefined)) return [3 /*break*/, 8];
                    return [4 /*yield*/, getBuildWorkItems()];
                case 5:
                    buildWorkItems = _a.sent();
                    if (buildWorkItems !== null && buildWorkItems !== undefined && buildWorkItems.length > 0) {
                        buildWorkItems.forEach(function (fe) {
                            return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null;
                        });
                    }
                    return [4 /*yield*/, getBuildCommitWorkItems([build.sourceVersion || ''])];
                case 6:
                    buildCommitWorkItems = _a.sent();
                    if (buildCommitWorkItems !== null && buildCommitWorkItems !== undefined && buildCommitWorkItems.length > 0) {
                        buildCommitWorkItems.forEach(function (fe) {
                            return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null;
                        });
                    }
                    if (!(workItemIds !== null && workItemIds !== undefined && workItemIds.length > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, getWorkItems(workItemIds)];
                case 7:
                    workItems = (_a.sent()) || [];
                    returnValue = workItems;
                    _a.label = 8;
                case 8: return [2 /*return*/, returnValue];
            }
        });
    });
}
function getBuild() {
    return __awaiter(this, void 0, void 0, function () {
        var returnedBuild, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, buildApi.getBuild(teamProject, buildId)];
                case 1:
                    returnedBuild = _a.sent();
                    tl.debug('Retrieved Build.');
                    return [2 /*return*/, returnedBuild];
                case 2:
                    e_5 = _a.sent();
                    tl.error('Unable to retrieve Build.');
                    tl.error(e_5.toString());
                    setFailedRelease();
                    throw e_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getBuildCommitWorkItems(commitIds) {
    return __awaiter(this, void 0, void 0, function () {
        var buildWorkItemRefs, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, buildApi.getBuildWorkItemsRefsFromCommits(commitIds, teamProject, buildId)];
                case 1:
                    buildWorkItemRefs = _a.sent();
                    tl.debug('Retrieved Build Commit work items.');
                    return [2 /*return*/, buildWorkItemRefs];
                case 2:
                    e_6 = _a.sent();
                    tl.error('Unable to retrieve Build Commit Work Items.');
                    tl.error(e_6.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getReleaseEndTime(endpointUrl, accessToken) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (endpointUrl === void 0) { endpointUrl = endpointUrlDefault; }
    if (accessToken === void 0) { accessToken = accessTokenDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var credentialHandler, release, deploymentJobs, endDate, _i, deploymentJobs_1, deploymentJob, taskGroups, _j, taskGroups_1, taskGroup, task;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    credentialHandler = azdev.getHandlerFromToken(accessToken);
                    webApi = new azdev.WebApi(endpointUrl, credentialHandler);
                    return [4 /*yield*/, getReleaseApi()];
                case 1:
                    releaseApi = _k.sent();
                    return [4 /*yield*/, getRelease()];
                case 2:
                    release = _k.sent();
                    deploymentJobs = (_f = (_e = (_d = (_c = (_b = (_a = release === null || release === void 0 ? void 0 : release.environments) === null || _a === void 0 ? void 0 : _a.find(function (w) { return (w === null || w === void 0 ? void 0 : w.id) === environmentId; })) === null || _b === void 0 ? void 0 : _b.deploySteps) === null || _c === void 0 ? void 0 : _c.find(function (f) { return (f === null || f === void 0 ? void 0 : f.deploymentId) === deploymentId; })) === null || _d === void 0 ? void 0 : _d.releaseDeployPhases) === null || _e === void 0 ? void 0 : _e.find(function (g) { return (g === null || g === void 0 ? void 0 : g.phaseId) === phaseId.toString(); })) === null || _f === void 0 ? void 0 : _f.deploymentJobs;
                    endDate = "";
                    if (deploymentJobs) {
                        for (_i = 0, deploymentJobs_1 = deploymentJobs; _i < deploymentJobs_1.length; _i++) {
                            deploymentJob = deploymentJobs_1[_i];
                            if (deploymentJob.tasks !== undefined) {
                                taskGroups = deploymentJob.tasks;
                                for (_j = 0, taskGroups_1 = taskGroups; _j < taskGroups_1.length; _j++) {
                                    taskGroup = taskGroups_1[_j];
                                    if (taskGroup.task !== undefined) {
                                        task = taskGroup.task;
                                        if (((_g = task === null || task === void 0 ? void 0 : task.name) === null || _g === void 0 ? void 0 : _g.indexOf('Cherwell')) === 0) {
                                            try {
                                                endDate = ((_h = taskGroup === null || taskGroup === void 0 ? void 0 : taskGroup.dateStarted) === null || _h === void 0 ? void 0 : _h.toLocaleString()) || '';
                                            }
                                            catch (e) {
                                                endDate = new Date().toLocaleString();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return [2 /*return*/, endDate];
            }
        });
    });
}
exports.getReleaseEndTime = getReleaseEndTime;
function getRelease() {
    return __awaiter(this, void 0, void 0, function () {
        var release, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, releaseApi.getRelease(teamProject, releaseId, undefined, undefined, ReleaseInterfaces.SingleReleaseExpands.Tasks, undefined)];
                case 1:
                    release = _a.sent();
                    tl.debug("Retrieved release");
                    return [2 /*return*/, release];
                case 2:
                    e_7 = _a.sent();
                    tl.error("Unable to retrieve Release.");
                    tl.error(e_7.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getReleaseStartTime(endpointUrl, accessToken) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (endpointUrl === void 0) { endpointUrl = endpointUrlDefault; }
    if (accessToken === void 0) { accessToken = accessTokenDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var credentialHandler, release;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    credentialHandler = azdev.getHandlerFromToken(accessToken);
                    webApi = new azdev.WebApi(endpointUrl, credentialHandler);
                    return [4 /*yield*/, getReleaseApi()];
                case 1:
                    releaseApi = _h.sent();
                    return [4 /*yield*/, getRelease()];
                case 2:
                    release = _h.sent();
                    if (release) {
                        return [2 /*return*/, (_g = (_f = (_e = (_d = (_c = (_b = (_a = release === null || release === void 0 ? void 0 : release.environments) === null || _a === void 0 ? void 0 : _a.find(function (w) { return w.id == environmentId; })) === null || _b === void 0 ? void 0 : _b.deploySteps) === null || _c === void 0 ? void 0 : _c.find(function (f) { return f.deploymentId === deploymentId; })) === null || _d === void 0 ? void 0 : _d.releaseDeployPhases) === null || _e === void 0 ? void 0 : _e.find(function (g) { return g.phaseId == phaseId.toString(); })) === null || _f === void 0 ? void 0 : _f.startedOn) === null || _g === void 0 ? void 0 : _g.toLocaleString()];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getReleaseStartTime = getReleaseStartTime;
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
