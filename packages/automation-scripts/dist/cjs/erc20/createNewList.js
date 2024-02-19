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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewErc20List = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cysync_utils_1 = require("@cypherock/cysync-utils");
var lodash_1 = __importDefault(require("lodash"));
var coingecko_1 = require("./coingecko");
var config_1 = require("./config");
var diff_1 = require("./diff");
var MAX_RETRIES = 3;
var SLEEP_TIME = 10000;
var BATCH_LEN = 20;
var COIN_DETAILS_PATH = path_1.default.join(config_1.config.DATA_FOLDER, 'coinDetails');
var fetchInBatch = function (ids) { return __awaiter(void 0, void 0, void 0, function () {
    var retries, results, idsToFetch, promises, promiseResult, i, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                retries = 0;
                results = [];
                idsToFetch = ids;
                _a.label = 1;
            case 1:
                promises = idsToFetch.map(function (id) { return (0, coingecko_1.getCoingeckoCoinDetails)(id); });
                return [4 /*yield*/, Promise.allSettled(promises)];
            case 2:
                promiseResult = _a.sent();
                idsToFetch = [];
                for (i = 0; i < promiseResult.length; i += 1) {
                    result = promiseResult[i];
                    if (result.status === 'fulfilled') {
                        results.push(result.value);
                    }
                    else {
                        console.warn(result.reason);
                        idsToFetch.push(ids[i]);
                    }
                }
                if (!(idsToFetch.length > 0)) return [3 /*break*/, 4];
                retries += 1;
                console.log("Waiting between retries... ".concat(retries));
                return [4 /*yield*/, (0, cysync_utils_1.sleep)(SLEEP_TIME)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (0, cysync_utils_1.sleep)(50)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (idsToFetch.length > 0 && retries < MAX_RETRIES) return [3 /*break*/, 1];
                _a.label = 7;
            case 7: return [2 /*return*/, results];
        }
    });
}); };
var getAllCoinDetails = function (ids) { return __awaiter(void 0, void 0, void 0, function () {
    var allCoinDetails, chunkArray, totalFetched, _i, chunkArray_1, chunk, details, _a, details_1, detail;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                allCoinDetails = {};
                chunkArray = lodash_1.default.chunk(ids, BATCH_LEN);
                totalFetched = 0;
                _i = 0, chunkArray_1 = chunkArray;
                _b.label = 1;
            case 1:
                if (!(_i < chunkArray_1.length)) return [3 /*break*/, 8];
                chunk = chunkArray_1[_i];
                return [4 /*yield*/, fetchInBatch(chunk)];
            case 2:
                details = _b.sent();
                _a = 0, details_1 = details;
                _b.label = 3;
            case 3:
                if (!(_a < details_1.length)) return [3 /*break*/, 6];
                detail = details_1[_a];
                return [4 /*yield*/, fs_1.default.promises.writeFile(path_1.default.join(COIN_DETAILS_PATH, "".concat(detail.id, ".json")), JSON.stringify(detail, undefined, 2))];
            case 4:
                _b.sent();
                allCoinDetails[detail.id] = detail;
                _b.label = 5;
            case 5:
                _a++;
                return [3 /*break*/, 3];
            case 6:
                totalFetched += chunk.length;
                console.log(totalFetched, ids.length - totalFetched);
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/, allCoinDetails];
        }
    });
}); };
var getExistingCoinDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
    var files, map, _i, files_1, file, filePath, fileContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!fs_1.default.existsSync(COIN_DETAILS_PATH)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.default.promises.mkdir(COIN_DETAILS_PATH, { recursive: true })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, fs_1.default.promises.readdir(COIN_DETAILS_PATH)];
            case 3:
                files = _a.sent();
                map = {};
                _i = 0, files_1 = files;
                _a.label = 4;
            case 4:
                if (!(_i < files_1.length)) return [3 /*break*/, 7];
                file = files_1[_i];
                filePath = path_1.default.join(COIN_DETAILS_PATH, file);
                return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
            case 5:
                fileContent = _a.sent();
                map[file.split('.')[0]] = JSON.parse(fileContent);
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/, map];
        }
    });
}); };
var createNewErc20List = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list, uniqueIds, existingCoinDetails, existingCoinDetailsIds, remaingIds, allCoinDetails, _a, newCoinList, _loop_1, _i, list_1, coin, sortedList;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, (0, diff_1.getERC20TokenDifference)()];
            case 1:
                list = _h.sent();
                uniqueIds = lodash_1.default.uniq(list.filter(function (e) { return !e.is_zero_value_coin; }).map(function (e) { return e.id; }));
                return [4 /*yield*/, getExistingCoinDetails()];
            case 2:
                existingCoinDetails = _h.sent();
                existingCoinDetailsIds = Object.keys(existingCoinDetails);
                remaingIds = lodash_1.default.difference(uniqueIds, existingCoinDetailsIds);
                console.log({
                    uniqueIds: uniqueIds.length,
                    existingCoinDetailsIds: existingCoinDetailsIds.length,
                    remaingIds: remaingIds.length,
                });
                _a = [__assign({}, existingCoinDetails)];
                return [4 /*yield*/, getAllCoinDetails(remaingIds)];
            case 3:
                allCoinDetails = __assign.apply(void 0, _a.concat([(_h.sent())]));
                newCoinList = [];
                _loop_1 = function (coin) {
                    var coinDetails = allCoinDetails[coin.id];
                    if (coin.is_zero_value_coin) {
                        newCoinList.push(__assign(__assign({}, coin), { market_cap: 0 }));
                    }
                    else if (!coinDetails) {
                        console.warn("No coin details found for ".concat(coin.id));
                    }
                    else {
                        newCoinList.push(__assign(__assign({}, coin), { platforms: Object.entries((_b = coin.platforms) !== null && _b !== void 0 ? _b : {}).reduce(function (a, v) {
                                var _a;
                                var _b, _c, _d, _e;
                                return (__assign(__assign({}, a), (_a = {}, _a[v[0]] = __assign(__assign({}, v[1]), { decimal_place: (_e = (_d = (_b = coinDetails.detail_platforms) === null || _b === void 0 ? void 0 : _b[(_c = coingecko_1.coingeckoPlatformReverseMapping[v[0]]) !== null && _c !== void 0 ? _c : '']) === null || _d === void 0 ? void 0 : _d.decimal_place) !== null && _e !== void 0 ? _e : 18 }), _a)));
                            }, {}), market_cap: (_e = (_d = (_c = coinDetails.market_data) === null || _c === void 0 ? void 0 : _c.market_cap) === null || _d === void 0 ? void 0 : _d.usd) !== null && _e !== void 0 ? _e : 0, image: coinDetails.image, description: {
                                en: (_g = (_f = coinDetails.description) === null || _f === void 0 ? void 0 : _f.en) === null || _g === void 0 ? void 0 : _g.replace(/[\u2028]/g, '\n'),
                            }, last_updated_at: coinDetails.last_updated }));
                    }
                };
                for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                    coin = list_1[_i];
                    _loop_1(coin);
                }
                sortedList = lodash_1.default.orderBy(newCoinList, ['market_cap'], ['desc']);
                return [4 /*yield*/, fs_1.default.promises.writeFile(path_1.default.join(config_1.config.DATA_FOLDER, 'erc20.json'), JSON.stringify(sortedList, undefined, 2))];
            case 4:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createNewErc20List = createNewErc20List;
