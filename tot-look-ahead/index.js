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
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var url, listName, listNameType, clientId, clientSecret, changeNo, status_1, changeTitle, application, businessDescription, _a, technicalDescription, impact, srManager, startDate, endDate, teamsInvolved, comms, commsUrl, commsText, fleetMigrationImpact, assignedResource, additionalNotesUrl, additionalNotesText, tenantName, tenantId, resourceId, tokenUrl, tokenHeaders, tokenBody, response, access_token, digestTokenHeaders, digestResponse, digest, lookAheadItemBody, listUrl, lookAheadItemHeaders, itemResponse, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    url = 'https://spteam.aa.com/sites/MnE/TechOps';
                    listName = 'TOT-LookAhead-Copy';
                    listNameType = 'SP.Data.TOTLookAheadCopyListItem';
                    clientId = tl.getInput('clientId', true);
                    clientSecret = tl.getInput('clientSecret', true);
                    changeNo = tl.getInput('changeNo', true);
                    status_1 = 'Completed';
                    changeTitle = tl.getInput('changeTitle', true);
                    application = tl.getInput('application', true);
                    _a = tl.getInput('businessDescription', false) + '\n';
                    return [4 /*yield*/, workitem_1.getWorkItemsforNotes()];
                case 1:
                    businessDescription = _a + (_b.sent());
                    technicalDescription = tl.getInput('technicalDescription', false);
                    impact = tl.getInput('impact', true);
                    srManager = tl.getInput('srManager', true);
                    startDate = '';
                    endDate = '';
                    teamsInvolved = tl.getInput('teamsInvolved', false);
                    comms = tl.getInput('comms', false);
                    commsUrl = tl.getInput('commsUrl', false);
                    commsText = tl.getInput('commsText', false);
                    fleetMigrationImpact = tl.getInput('fleetMigrationImpact', false);
                    assignedResource = tl.getInput('assignedResource', false);
                    additionalNotesUrl = tl.getInput('additionalNotesUrl', false);
                    additionalNotesText = tl.getInput('additionalNotesText', false);
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
                case 2:
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
                case 3:
                    digestResponse = _b.sent();
                    digest = digestResponse.d.GetContextWebInformation.FormDigestValue;
                    lookAheadItemBody = {
                        __metadata: {
                            type: listNameType
                        },
                        Change_x0020__x0023__x0020_Requi: changeNo || 'N/A',
                        Scheduled: status_1 || 'Completed',
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
                            console.log(res.status);
                            console.log(res.statusText);
                            return res.json();
                        })];
                case 4:
                    itemResponse = _b.sent();
                    /*if (inputString == 'bad') {
                      tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                      return;
                    }*/
                    console.log('Successfully added item to TOT LookAhead List');
                    console.log('List Item Link:', itemResponse.d.__metadata.uri);
                    tl.setVariable('TOT_LookAhead_Item_Link', itemResponse.d.__metadata.uri, false, true);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
run();
