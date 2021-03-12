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
exports.getWorkItemsforNotes = void 0;
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
//ADO Connecton Objects
var endpointUrlDefault = tl.getVariable('System.TeamFoundationCollectionUri') || '';
var accessTokenDefault = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false) || '';
function getWorkItemsforNotes(endpointUrl, accessToken) {
    if (endpointUrl === void 0) { endpointUrl = endpointUrlDefault; }
    if (accessToken === void 0) { accessToken = accessTokenDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var credentialHandler, releaseNotes, releaseNotesWorkItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    tl.debug("Retrieved release work items.");
                    return [2 /*return*/, releaseApi];
                case 2:
                    e_1 = _a.sent();
                    tl.error("Unable to initialize getReleaseApi");
                    tl.error(e_1.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/, releaseApi];
            }
        });
    });
}
function setFailedRelease() {
    tl.setResult(tl.TaskResult.Failed, "Failed", undefined);
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
                    tl.debug("Retrieved Build work items.");
                    return [2 /*return*/, buildWorkItemRefs];
                case 2:
                    e_2 = _a.sent();
                    tl.error("Unable to retrieve Build Work Items.");
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
                    tl.debug("Retrieved release work items.");
                    return [2 /*return*/, releaseWorkItemRefs];
                case 2:
                    e_3 = _a.sent();
                    tl.error("Unable to retrieve Release Work Items.");
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
        var fieldsOnPrem, fieldsSaaS, workItems, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    fieldsOnPrem = ["System.Id", "AAIT.ID", "System.Title", "System.WorkItemType"];
                    fieldsSaaS = ["System.Id", "AAIT.ID", "System.Title", "System.WorkItemType"];
                    return [4 /*yield*/, workItemApi.getWorkItems(workItemIds, fieldsOnPrem)];
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
                    if (releaseId !== undefined && releaseId !== null && releaseId > 0)
                        isRelease = true;
                    if (!isRelease) return [3 /*break*/, 2];
                    return [4 /*yield*/, getReleaseWorkItems()];
                case 1:
                    releaseWorkItems = (_a.sent()) || [];
                    if (releaseWorkItems !== null && releaseWorkItems !== undefined && releaseWorkItems.length > 0) {
                        releaseWorkItems.forEach(function (fe) { return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null; });
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
                        buildWorkItems.forEach(function (fe) { return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null; });
                    }
                    return [4 /*yield*/, getBuildCommitWorkItems([build.sourceVersion || ''])];
                case 6:
                    buildCommitWorkItems = _a.sent();
                    if (buildCommitWorkItems !== null && buildCommitWorkItems !== undefined && buildCommitWorkItems.length > 0) {
                        buildCommitWorkItems.forEach(function (fe) { return workItemIds.indexOf(Number(fe.id)) === -1 ? workItemIds.push(Number(fe.id)) : null; });
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
                    tl.debug("Retrieved Build.");
                    return [2 /*return*/, returnedBuild];
                case 2:
                    e_5 = _a.sent();
                    tl.error("Unable to retrieve Build.");
                    tl.error(e_5.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
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
                    tl.debug("Retrieved Build Commit work items.");
                    return [2 /*return*/, buildWorkItemRefs];
                case 2:
                    e_6 = _a.sent();
                    tl.error("Unable to retrieve Build Commit Work Items.");
                    tl.error(e_6.toString());
                    setFailedRelease();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// //Debugging the code for testing.
// let azdoToken = "mhuanek6d7xj5prvshjqc7vujlywqzyquhtx2bkbtr6jkwxe34wa";
// let collectionUri = 'https://azuredevops.aa.com/USAIT/';
// //const credentialHandler: IRequestHandler = azdev.getHandlerFromToken(azdoToken);
// releaseId = 137672;
// buildId = 700605
// teamProject = 'TechOpsR';
// let result= getWorkItemsforNotes(collectionUri,azdoToken);
// console.log(result);
