"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var path_1 = __importDefault(require("path"));
exports.config = {
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
    COINGECKO_URL: ' https://pro-api.coingecko.com/api/v3/',
    DATA_FOLDER: path_1.default.join(__dirname, '..', '..', '..', '.data'),
};
