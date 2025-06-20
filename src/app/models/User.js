"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
});
var User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
exports.default = User;
