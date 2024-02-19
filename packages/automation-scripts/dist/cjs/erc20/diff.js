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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getERC20TokenDifference = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var coins_1 = require("@cypherock/coins");
var lodash_1 = __importDefault(require("lodash"));
var coingecko_1 = require("./coingecko");
var config_1 = require("./config");
var createContractMapFromExistingList = function (list) {
    var _a;
    var map = {};
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var coin = list_1[_i];
        if (!coin.platforms)
            continue;
        for (var platform in coin.platforms) {
            if (!coin.platforms[platform])
                continue;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!coins_1.evmCoinList[platform])
                continue;
            var tokenDetails = coin.platforms[platform];
            if (!tokenDetails)
                continue;
            map["".concat(platform, ":").concat(tokenDetails.contract_address.toLowerCase())] = __assign(__assign({}, coin), { platforms: (_a = {},
                    _a[platform] = __assign({}, tokenDetails),
                    _a) });
        }
    }
    return map;
};
var createContractMapFromCoingeckoList = function (list) {
    var _a;
    var map = {};
    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
        var coin = list_2[_i];
        if (!coin.platforms)
            continue;
        for (var platform in coin.platforms) {
            if (!coin.platforms[platform])
                continue;
            var mappedPlatform = coingecko_1.coingeckoPlatformMapping[platform];
            if (!mappedPlatform)
                continue;
            var contractAddress = coin.platforms[platform];
            if (!contractAddress)
                continue;
            map["".concat(mappedPlatform, ":").concat(contractAddress.toLowerCase())] = {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                platforms: (_a = {},
                    _a[mappedPlatform] = {
                        contract_address: contractAddress,
                        decimal_place: 0,
                    },
                    _a),
            };
        }
    }
    return map;
};
var getChangedContracts = function (params) {
    var _a, _b;
    var sameContracts = params.sameContracts, coingeckoCoinMap = params.coingeckoCoinMap, existingCoinMap = params.existingCoinMap;
    var changedContracts = [];
    var changedCoinList = [];
    var idChanges = [];
    var changedCoins = [];
    for (var _i = 0, sameContracts_1 = sameContracts; _i < sameContracts_1.length; _i++) {
        var contractAddress = sameContracts_1[_i];
        var coingeckoCoin = coingeckoCoinMap[contractAddress];
        var existingCoin = existingCoinMap[contractAddress];
        if (!coingeckoCoin || !existingCoin)
            continue;
        if (coingeckoCoin.id !== existingCoin.id ||
            coingeckoCoin.name !== existingCoin.name ||
            coingeckoCoin.symbol !== existingCoin.symbol) {
            changedContracts.push(contractAddress);
            changedCoinList.push(__assign({}, coingeckoCoin));
            if (coingeckoCoin.id !== existingCoin.id) {
                idChanges.push({
                    oldId: existingCoin.id,
                    oldVersion: existingCoin.version,
                    newId: coingeckoCoin.id,
                    platform: Object.keys((_a = existingCoin.platforms) !== null && _a !== void 0 ? _a : {})[0],
                });
            }
            changedCoins.push({
                id: coingeckoCoin.id,
                platform: Object.keys((_b = existingCoin.platforms) !== null && _b !== void 0 ? _b : {})[0],
            });
        }
    }
    var unchangedCoinList = lodash_1.default
        .difference(sameContracts, changedContracts)
        .map(function (e) { return existingCoinMap[e]; })
        .filter(function (e) { return !!e; });
    return {
        changedContracts: changedContracts,
        changedCoinList: changedCoinList,
        changedCoins: changedCoins,
        idChanges: idChanges,
        unchangedCoinList: unchangedCoinList,
    };
};
var getRemovedContracts = function (params) {
    var removedContracts = params.removedContracts, existingCoinMap = params.existingCoinMap;
    var removedCoinList = [];
    for (var _i = 0, removedContracts_1 = removedContracts; _i < removedContracts_1.length; _i++) {
        var contractAddress = removedContracts_1[_i];
        var existingCoin = existingCoinMap[contractAddress];
        if (!existingCoin)
            continue;
        if (existingCoin.is_custom_coin) {
            removedCoinList.push(__assign({}, existingCoin));
        }
        else {
            removedCoinList.push(__assign(__assign({}, existingCoin), { is_zero_value_coin: true }));
        }
    }
    return { removedCoinList: removedCoinList };
};
var verifyDuplicateIds = function (list) {
    var idSet = new Set();
    var duplicateIdList = [];
    for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
        var coin = list_3[_i];
        if (!coin.platforms)
            continue;
        for (var platform in coin.platforms) {
            if (!coin.platforms[platform])
                continue;
            var tokenDetails = coin.platforms[platform];
            if (!tokenDetails)
                continue;
            var id = (0, coins_1.createErc20AssetId)({
                parentAssetId: platform,
                assetId: coin.id,
                version: coin.version,
            });
            if (idSet.has(id)) {
                duplicateIdList.push(id);
            }
            else {
                idSet.add(id);
            }
        }
    }
    if (duplicateIdList.length > 0) {
        throw new Error("Duplicate ids found in list: ".concat(duplicateIdList.join(',')));
    }
};
var getAddedContracts = function (params) {
    var addedContracts = params.addedContracts, coingeckoCoinMap = params.coingeckoCoinMap, existingCoinMap = params.existingCoinMap;
    var addedCoinList = [];
    var _loop_1 = function (contractAddress) {
        var coingeckoCoin = coingeckoCoinMap[contractAddress];
        if (!coingeckoCoin)
            return "continue";
        var existingCoinWithSameId = Object.values(existingCoinMap).find(function (e) {
            var _a, _b;
            return e &&
                e.id === coingeckoCoin.id &&
                Object.keys((_a = e.platforms) !== null && _a !== void 0 ? _a : {})[0] ===
                    Object.keys((_b = coingeckoCoin.platforms) !== null && _b !== void 0 ? _b : {})[0];
        });
        var newCoin = __assign({}, coingeckoCoin);
        if (existingCoinWithSameId) {
            var hash = crypto_1.default
                .createHash('sha256')
                .update(contractAddress)
                .digest('hex');
            newCoin.version = hash.slice(0, 8);
        }
        addedCoinList.push(newCoin);
    };
    for (var _i = 0, addedContracts_1 = addedContracts; _i < addedContracts_1.length; _i++) {
        var contractAddress = addedContracts_1[_i];
        _loop_1(contractAddress);
    }
    return { addedCoinList: addedCoinList };
};
var getERC20TokenDifference = function (dontSaveToFile) { return __awaiter(void 0, void 0, void 0, function () {
    var coingeckoCoinMap, _a, existingCoinMap, coingeckoContractAddresses, existingContractAddresses, removedContracts, addedContracts, sameContracts, _b, changedContracts, idChanges, changedCoins, changedCoinList, unchangedCoinList, removedCoinList, addedCoinList, newCoinList;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = createContractMapFromCoingeckoList;
                return [4 /*yield*/, (0, coingecko_1.getCoingeckoCoinList)()];
            case 1:
                coingeckoCoinMap = _a.apply(void 0, [_c.sent()]);
                existingCoinMap = createContractMapFromExistingList(coins_1.erc20JsonList);
                coingeckoContractAddresses = Object.keys(coingeckoCoinMap);
                existingContractAddresses = Object.keys(existingCoinMap);
                removedContracts = lodash_1.default.difference(existingContractAddresses, coingeckoContractAddresses);
                addedContracts = lodash_1.default.difference(coingeckoContractAddresses, existingContractAddresses);
                sameContracts = lodash_1.default.intersection(coingeckoContractAddresses, existingContractAddresses);
                _b = getChangedContracts({
                    sameContracts: sameContracts,
                    coingeckoCoinMap: coingeckoCoinMap,
                    existingCoinMap: existingCoinMap,
                }), changedContracts = _b.changedContracts, idChanges = _b.idChanges, changedCoins = _b.changedCoins, changedCoinList = _b.changedCoinList, unchangedCoinList = _b.unchangedCoinList;
                removedCoinList = getRemovedContracts({
                    removedContracts: removedContracts,
                    coingeckoCoinMap: coingeckoCoinMap,
                    existingCoinMap: existingCoinMap,
                }).removedCoinList;
                addedCoinList = getAddedContracts({
                    addedContracts: addedContracts,
                    coingeckoCoinMap: coingeckoCoinMap,
                    existingCoinMap: existingCoinMap,
                }).addedCoinList;
                newCoinList = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], unchangedCoinList, true), addedCoinList, true), changedCoinList, true), removedCoinList, true);
                verifyDuplicateIds(newCoinList);
                if (!!dontSaveToFile) return [3 /*break*/, 3];
                return [4 /*yield*/, fs_1.default.promises.writeFile(path_1.default.join(config_1.config.DATA_FOLDER, 'diff.json'), JSON.stringify({
                        removedContracts: removedContracts.length,
                        addedContracts: addedContracts.length,
                        sameContracts: sameContracts.length,
                        changedContracts: changedContracts.length,
                        coingeckoContractAddresses: coingeckoContractAddresses.length,
                        existingContractAddresses: existingContractAddresses.length,
                        idChanges: idChanges,
                        changedCoins: changedCoins,
                        removedCoinList: removedCoinList,
                        changedCoinList: changedCoinList,
                        addedCoinList: addedCoinList,
                        unchangedCoinList: unchangedCoinList,
                        newCoinList: newCoinList,
                    }, undefined, 2))];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/, newCoinList];
        }
    });
}); };
exports.getERC20TokenDifference = getERC20TokenDifference;
