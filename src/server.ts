import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import * as fs from 'fs';

const app: Application = express();
const PORT = 3000;
const DB_FILE = 'db.json';

interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: string;
}

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/ping', (req: Request, res: Response) => {
  res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const submission: Submission = req.body;

  // Read current submissions from db.json
  let submissions: Submission[] = [];
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

app.get('/read', (req: Request, res: Response) => {
  const index: number = parseInt(req.query.index as string, 10);

  // Read submissions from db.json
  let submissions: Submission[] = [];
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    submissions = JSON.parse(data).submissions;
  }

  // Return submission at specified index
  if (index >= 0 && index < submissions.length) {
    res.json(submissions[index]);
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
