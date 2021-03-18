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
var tl = require("azure-pipelines-task-lib/task");
var node_fetch_1 = require("node-fetch");
var FormData = require("form-data");
var workitem_1 = require("./workitem");
var url = 'https://spteam.aa.com/sites/MnE/TechOps';
var listName = 'TOT-LookAhead-Copy';
var listNameType = 'SP.Data.TOTLookAheadCopyListItem';
var clientId = tl.getInput('clientId', true);
var clientSecret = tl.getInput('clientSecret', true);
var changeNo = tl.getInput('changeNo', true);
var status = tl.getInput('status', true);
var changeTitle = tl.getInput('changeTitle', true);
var application = tl.getInput('application', true);
var businessDescription = tl.getInput('businessDescription', false);
var technicalDescription = tl.getInput('technicalDescription', false);
var impact = tl.getInput('impact', true);
var srManager = tl.getInput('srManager', true);
var startDate = '';
var endDate = '';
var teamsInvolved = tl.getInput('teamsInvolved', false);
var comms = tl.getInput('comms', false);
var commsUrl = tl.getInput('commsUrl', false);
var commsText = tl.getInput('commsText', false);
var fleetMigrationImpact = tl.getInput('fleetMigrationImpact', false);
var assignedResource = tl.getInput('assignedResource', false);
var additionalNotesUrl = tl.getInput('additionalNotesUrl', false);
var additionalNotesText = tl.getInput('additionalNotesText', false);
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, tenantName, tenantId, resourceId, tokenUrl, tokenHeaders, tokenBody, response, access_token, digestTokenHeaders, digestResponse, digest, lookAheadItemBody, listUrl, lookAheadItemHeaders, itemResponse, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, workitem_1.getReleaseStartTime()];
                case 1:
                    startDate = _b.sent();
                    return [4 /*yield*/, workitem_1.getReleaseEndTime()];
                case 2:
                    endDate = _b.sent();
                    _a = businessDescription + '\n';
                    return [4 /*yield*/, workitem_1.getWorkItemsforNotes()];
                case 3:
                    businessDescription = _a + (_b.sent());
                    tenantName = 'spteam.aa.com';
                    tenantId = '49793faf-eb3f-4d99-a0cf-aef7cce79dc1';
                    resourceId = '00000003-0000-0ff1-ce00-000000000000';
                    tokenUrl = "https://accounts.accesscontrol.windows.net/" + tenantId + "/tokens/OAuth/2";
                    tokenHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
                    tokenBody = new FormData();
                    tokenBody.append('grant_type', 'client_credentials');
                    tokenBody.append('client_id', clientId + "@" + tenantId);
                    tokenBody.append('client_secret', clientSecret);
                    tokenBody.append('resource', resourceId + "/" + tenantName + "@" + tenantId);
                    return [4 /*yield*/, node_fetch_1["default"](tokenUrl, {
                            method: 'POST',
                            body: tokenBody
                        }).then(function (res) { return res.json(); })];
                case 4:
                    response = _b.sent();
                    access_token = response.access_token;
                    digestTokenHeaders = {
                        Authorization: "Bearer " + access_token,
                        Accept: 'application/json;odata=verbose',
                        'Content-Type': 'application/json'
                    };
                    return [4 /*yield*/, node_fetch_1["default"](url + "/_api/contextinfo", {
                            method: 'POST',
                            headers: digestTokenHeaders
                        }).then(function (res) { return res.json(); })];
                case 5:
                    digestResponse = _b.sent();
                    digest = digestResponse.d.GetContextWebInformation.FormDigestValue;
                    lookAheadItemBody = {
                        __metadata: {
                            type: listNameType
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
                            Url: commsText || commsUrl
                        },
                        Assigned_x0020_Resource: assignedResource,
                        Additional_x0020_Notes: {
                            __metadata: { type: 'SP.FieldUrlValue' },
                            Description: additionalNotesUrl,
                            Url: additionalNotesText || additionalNotesUrl
                        },
                        Fleet_x0020_Migration_x0020_Cale: false
                    };
                    listUrl = url + "/_api/web/lists/GetByTitle('" + listName + "')/items";
                    lookAheadItemHeaders = {
                        Authorization: "Bearer " + access_token,
                        Accept: 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'X-RequestDigest': digest
                    };
                    return [4 /*yield*/, node_fetch_1["default"](listUrl, {
                            method: 'POST',
                            body: JSON.stringify(lookAheadItemBody),
                            headers: lookAheadItemHeaders
                        }).then(function (res) {
                            console.log(res.clone().status);
                            console.log(res.clone().statusText);
                            return res.json();
                        })];
                case 6:
                    itemResponse = _b.sent();
                    console.log('Successfully added item to TOT LookAhead List');
                    console.log('List Item Link:', itemResponse.d.__metadata.uri);
                    tl.setVariable('TOT_LookAhead_Item_Link', itemResponse.d.__metadata.uri, false, true);
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
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
