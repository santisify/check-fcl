"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastUpdate = exports.currentLinkStatuses = void 0;
exports.fetchFriendLinks = fetchFriendLinks;
exports.checkLinkStatus = checkLinkStatus;
exports.checkAllLinkStatuses = checkAllLinkStatuses;
exports.startServer = startServer;
exports.runDailyCheck = runDailyCheck;
// server/index.ts - 后端服务逻辑，保持原有的功能
var axios_1 = require("axios");
var express_1 = require("express");
var cors_1 = require("cors");
var node_cron_1 = require("node-cron");
var fs = require("fs");
// Global variable to store the latest link statuses
var currentLinkStatuses = [];
exports.currentLinkStatuses = currentLinkStatuses;
var lastUpdate = new Date(0); // Initialize to epoch time
exports.lastUpdate = lastUpdate;
var currentFriendLinksData = null; // Store the original friend links data
/**
 * Fetches friend link data from the provided URL
 * @param url The URL to fetch friend link data from
 * @returns Promise<FriendLinksData>
 */
// @ts-ignore
function fetchFriendLinks(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(url, {
                            timeout: 10000, // 10 second timeout
                            headers: {
                                'User-Agent': 'FriendLink Checker Bot 1.0'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to fetch friend links from ".concat(url, ":"), error_1);
                    throw new Error("Failed to fetch friend links: ".concat(error_1));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks the status of a single URL
 * @param url The URL to check
 * @param name
 * @returns Promise<LinkStatus>
 */
// @ts-ignore
function checkLinkStatus(url, name) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, response, responseTime, error_2, responseTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.head(url, {
                            timeout: 10000, // 10 second timeout
                            maxRedirects: 5,
                            headers: {
                                'User-Agent': 'FriendLink Checker Bot 1.0'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    responseTime = Date.now() - startTime;
                    return [2 /*return*/, {
                            name: name,
                            link: url,
                            status: response.status,
                            message: "Status ".concat(response.status),
                            lastChecked: new Date(),
                            responseTime: responseTime
                        }];
                case 3:
                    error_2 = _a.sent();
                    responseTime = Date.now() - startTime;
                    // Handle different types of errors
                    if (error_2.code === 'ECONNABORTED' || error_2.code === 'ETIMEDOUT') {
                        return [2 /*return*/, {
                                name: name,
                                link: url,
                                status: 'timeout',
                                message: 'Request timeout',
                                lastChecked: new Date(),
                                responseTime: responseTime
                            }];
                    }
                    else if (error_2.response) {
                        // Server responded with error status
                        return [2 /*return*/, {
                                name: name,
                                link: url,
                                status: error_2.response.status,
                                message: "Status ".concat(error_2.response.status),
                                lastChecked: new Date(),
                                responseTime: responseTime
                            }];
                    }
                    else {
                        // Network error or other error
                        return [2 /*return*/, {
                                name: name,
                                link: url,
                                status: 'error',
                                message: error_2.message || 'Network error',
                                lastChecked: new Date(),
                                responseTime: responseTime
                            }];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks the status of all friend links
 * @param friendLinksData The friend links data to check
 * @returns Promise<LinkStatus[]>
 */
function checkAllLinkStatuses(friendLinksData) {
    return __awaiter(this, void 0, void 0, function () {
        var allLinks, results, concurrencyLimit, queue, batch, batchPromises, batchResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allLinks = friendLinksData.friends
                        .filter(function (category) { return category.id_name !== "special-links"; }) // Exclude special-links from checking
                        .flatMap(function (category) {
                        return category.link_list.map(function (link) { return ({ name: link.name, link: link.link }); });
                    });
                    results = [];
                    concurrencyLimit = 5;
                    queue = __spreadArray([], allLinks, true);
                    _a.label = 1;
                case 1:
                    if (!(queue.length > 0)) return [3 /*break*/, 3];
                    batch = queue.splice(0, concurrencyLimit);
                    batchPromises = batch.map(function (item) { return checkLinkStatus(item.link, item.name); });
                    return [4 /*yield*/, Promise.all(batchPromises)];
                case 2:
                    batchResults = _a.sent();
                    results.push.apply(results, batchResults);
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
// Create Express app
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT || '3000', 10);
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Serve static files from dist directory (Vite build output)
app.use(express_1.default.static('dist'));
// API endpoint to get current link statuses
app.get('/api/status', function (_req, res) {
    try {
        // Combine link statuses with original link data to include avatar and other details
        var result = {
            lastUpdate: lastUpdate.toISOString(), // Convert Date to ISO string for proper JSON serialization
            totalLinks: currentLinkStatuses.length,
            statuses: currentLinkStatuses.map(function (status) {
                // Find the original link data in currentFriendLinksData
                var originalLink = null;
                if (currentFriendLinksData) {
                    for (var _i = 0, _a = currentFriendLinksData.friends; _i < _a.length; _i++) {
                        var category = _a[_i];
                        originalLink = category.link_list.find(function (link) { return link.link === status.link; });
                        if (originalLink)
                            break;
                    }
                }
                // Return status with original link data if found
                if (originalLink) {
                    return __assign(__assign({}, originalLink), { status: status.status, message: status.message, lastChecked: status.lastChecked.toISOString ? status.lastChecked.toISOString() : status.lastChecked, responseTime: status.responseTime });
                }
                else {
                    // If original link not found, return status as is
                    return __assign(__assign({}, status), { lastChecked: status.lastChecked.toISOString ? status.lastChecked.toISOString() : status.lastChecked });
                }
            })
        };
        res.json(result);
    }
    catch (error) {
        console.error('Error in /api/status endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Serve the main page (Vite will handle this in dev mode, Express serves in prod)
app.get('/', function (_req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
// Function to start the web server
function startServer() {
    var currentPort = PORT;
    var maxRetries = 10; // 最多重试10个端口
    var retries = 0;
    function attemptListen(port) {
        app.listen(port, function () {
            console.log("Friend link checker server running on port ".concat(port));
        }).on('error', function (err) {
            if (err.code === 'EADDRINUSE') {
                retries++;
                if (retries <= maxRetries) {
                    var newPort = port + 1;
                    console.log("Port ".concat(port, " is busy, trying port ").concat(newPort, " (attempt ").concat(retries, "/").concat(maxRetries, ")"));
                    attemptListen(newPort);
                }
                else {
                    console.error("Could not find an available port after ".concat(maxRetries, " attempts. Please free up a port."));
                    process.exit(1);
                }
            }
            else {
                console.error('Server error:', err);
                process.exit(1);
            }
        });
    }
    attemptListen(currentPort);
}
// Function to run the daily check
function runDailyCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var friendLinksData, statuses, validLinks, invalidLinks, linksToCheck, _loop_1, _i, linksToCheck_1, originalLink, resultData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("Starting daily friend link check at ".concat(new Date().toISOString()));
                    return [4 /*yield*/, fetchFriendLinks('https://santisify.top/links.json')];
                case 1:
                    friendLinksData = _a.sent();
                    // Store the original friend links data for API use
                    currentFriendLinksData = friendLinksData;
                    return [4 /*yield*/, checkAllLinkStatuses(friendLinksData)];
                case 2:
                    statuses = _a.sent();
                    // Update the global variables
                    exports.currentLinkStatuses = currentLinkStatuses = statuses;
                    exports.lastUpdate = lastUpdate = new Date();
                    validLinks = [];
                    invalidLinks = [];
                    linksToCheck = friendLinksData.friends
                        .filter(function (category) { return category.id_name !== "special-links"; })
                        .flatMap(function (category) {
                        return category.link_list.map(function (link) { return (__assign({}, link)); });
                    });
                    _loop_1 = function (originalLink) {
                        var status_1 = statuses.find(function (s) { return s.link === originalLink.link; });
                        // Consider status codes 200-299 as valid (2xx are good)
                        // Also consider 3xx redirects as valid for friend links
                        if (status_1 && typeof status_1.status === 'number' && status_1.status >= 200 && status_1.status < 400) {
                            validLinks.push(originalLink);
                        }
                        else {
                            // Add status information to the invalid link object
                            invalidLinks.push(__assign(__assign({}, originalLink), { status: status_1 ? status_1.status : 'error', message: status_1 ? status_1.message : 'No status found' }));
                        }
                    };
                    // For each link that was checked, determine if it's valid or invalid
                    for (_i = 0, linksToCheck_1 = linksToCheck; _i < linksToCheck_1.length; _i++) {
                        originalLink = linksToCheck_1[_i];
                        _loop_1(originalLink);
                    }
                    resultData = {
                        friends: [
                            {
                                id_name: "friends",
                                desc: "Common links included in circle friends",
                                link_list: validLinks
                            },
                            {
                                id_name: "inactive-links",
                                desc: "Inactive or rule-breaking friends",
                                link_list: invalidLinks
                            }
                        ]
                    };
                    // Save the result to result.json in the current directory
                    fs.writeFileSync('./result.json', JSON.stringify(resultData, null, 2));
                    console.log("Daily check completed. Checked ".concat(statuses.length, " links."));
                    console.log("Valid links: ".concat(validLinks.length, ", Invalid links: ").concat(invalidLinks.length));
                    console.log('Results saved to result.json');
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error during daily check:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Schedule the daily check at 00:00 (midnight)
// The cron expression "0 0 * * *" means:
// - 0 seconds
// - 0 minutes  
// - 0 hours (midnight)
// - Every day
// - Every month
// - Every day of the week
node_cron_1.default.schedule('0 0 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runDailyCheck()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, {
    scheduled: true,
    timezone: "Asia/Shanghai" // Set to China Standard Time
});
// Initialize the check when the server starts
runDailyCheck().then(function () {
    startServer();
    // Also run the check every hour to keep data fresh
    node_cron_1.default.schedule('0 * * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runDailyCheck()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, {
        scheduled: true,
        timezone: "Asia/Shanghai"
    });
});
