"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs = __importStar(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const DB_FILE = 'db.json';
// Middleware
app.use(body_parser_1.default.json());
// Routes
app.get('/ping', (req, res) => {
    res.json(true);
});
app.post('/submit', (req, res) => {
    const submission = req.body;
    // Read current submissions from db.json
    let submissions = [];
    if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        submissions = JSON.parse(data).submissions;
    }
    // Add new submission
    submissions.push(submission);
    // Write updated submissions to db.json
    fs.writeFileSync(DB_FILE, JSON.stringify({ submissions }));
    res.json({ message: 'Submission saved successfully' });
});
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    // Read submissions from db.json
    let submissions = [];
    if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        submissions = JSON.parse(data).submissions;
    }
    // Return submission at specified index
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).json({ error: 'Submission not found' });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
