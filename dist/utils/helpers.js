"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJwt = exports.generateJwt = void 0;
const jwt = __importStar(require("jsonwebtoken"));
// const JWT_SECRET = process.env.SECRET;
const JWT_SECRET = 'secret';
const EXPIRES_IN = 3600 * 24;
function generateJwt(data) {
    return jwt.sign(data, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: EXPIRES_IN,
    });
}
exports.generateJwt = generateJwt;
function decodeJwt(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string')
        return decoded;
    const { userId, email, firstName, lastName, role } = decoded;
    return { userId, email, firstName, lastName, role };
}
exports.decodeJwt = decodeJwt;
