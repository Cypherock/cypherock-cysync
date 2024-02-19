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
import fs from 'fs';
import path from 'path';
import { erc20JsonList } from '@cypherock/coins';
import { sleep } from '@cypherock/cysync-utils';
import axios from 'axios';
import lodash from 'lodash';
import { config } from './config';
var MAX_RETRIES = 3;
var SLEEP_TIME = 10000;
var BATCH_LEN = 20;
var IMAGE_FOLDER_PATH = path.join(config.DATA_FOLDER, 'images');
var downloadFile = function (fileUrl, filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // eslint-disable-next-line no-async-promise-executor
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var localFilePath, response, w, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            localFilePath = path.resolve(filePath);
                            if (!fileUrl.startsWith('http')) {
                                resolve();
                                return [2 /*return*/];
                            }
                            if (fs.existsSync(localFilePath)) {
                                resolve();
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios({
                                    method: 'GET',
                                    url: fileUrl,
                                    responseType: 'stream',
                                })];
                        case 2:
                            response = _a.sent();
                            w = response.data.pipe(fs.createWriteStream(localFilePath));
                            w.on('finish', function () {
                                resolve();
                            });
                            w.on('error', function (err) {
                                reject(err);
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            reject(err_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
var fetchInBatch = function (coins) { return __awaiter(void 0, void 0, void 0, function () {
    var retries, coinsToFetch, promises, promiseResult, i, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                retries = 0;
                coinsToFetch = coins;
                _a.label = 1;
            case 1:
                promises = coinsToFetch.map(function (coin) {
                    var _a, _b;
                    return downloadFile((_b = (_a = coin.image) === null || _a === void 0 ? void 0 : _a.large) !== null && _b !== void 0 ? _b : '', path.join(IMAGE_FOLDER_PATH, "".concat(coin.id, ".png")));
                });
                return [4 /*yield*/, Promise.allSettled(promises)];
            case 2:
                promiseResult = _a.sent();
                coinsToFetch = [];
                for (i = 0; i < promiseResult.length; i += 1) {
                    result = promiseResult[i];
                    if (result.status === 'rejected') {
                        console.warn(result.reason);
                        coinsToFetch.push(coins[i]);
                    }
                }
                if (!(coinsToFetch.length > 0)) return [3 /*break*/, 4];
                retries += 1;
                console.log("Waiting between retries... ".concat(retries));
                return [4 /*yield*/, sleep(SLEEP_TIME)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, sleep(50)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (coinsToFetch.length > 0 && retries < MAX_RETRIES) return [3 /*break*/, 1];
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
export var downloadErc20Images = function () { return __awaiter(void 0, void 0, void 0, function () {
    var coinMap, _i, _a, coin, allCoins, chunkArray, totalFetched, _b, chunkArray_1, chunk;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!!fs.existsSync(IMAGE_FOLDER_PATH)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs.promises.mkdir(IMAGE_FOLDER_PATH, { recursive: true })];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2:
                coinMap = {};
                for (_i = 0, _a = erc20JsonList; _i < _a.length; _i++) {
                    coin = _a[_i];
                    if (!coin.is_zero_value_coin && ((_c = coin.image) === null || _c === void 0 ? void 0 : _c.large)) {
                        coinMap[coin.id] = coin;
                    }
                }
                allCoins = Object.values(coinMap);
                chunkArray = lodash.chunk(allCoins, BATCH_LEN);
                totalFetched = 0;
                _b = 0, chunkArray_1 = chunkArray;
                _d.label = 3;
            case 3:
                if (!(_b < chunkArray_1.length)) return [3 /*break*/, 6];
                chunk = chunkArray_1[_b];
                return [4 /*yield*/, fetchInBatch(chunk)];
            case 4:
                _d.sent();
                totalFetched += chunk.length;
                console.log(totalFetched, allCoins.length - totalFetched);
                _d.label = 5;
            case 5:
                _b++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
