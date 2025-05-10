const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'https://daily-j.netlify.app' }));

app.use(express.json());

const ENTRIES_FILE = 'entries.json';

// GET random quote
app.get('/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    res.json({ quote: data[0].q, author: data[0].a });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quote' });
  }
});

// GET all journal entries
app.get('/entries', (req, res) => {
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf-8'));
  } catch (error) {
    entries = [];
  }
  res.json(entries);
});

// POST a new journal entry
app.post('/entry', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Entry text cannot be empty' });
  }

  let entries = [];
  try {
    entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf-8'));
  } catch (error) {
    entries = [];
  }

  const newEntry = {
    id: Date.now().toString(),
    text: text.trim(),
    date: new Date().toISOString()
  };
  entries.push(newEntry);

  try {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
    res.status(201).json({ message: 'Entry saved!', entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save entry' });
  }
});

// DELETE an entry by ID
app.delete('/entry/:id', (req, res) => {
  const entryId = req.params.id;
  let entries = [];

  try {
    entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf-8'));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to read entries' });
  }

  const index = entries.findIndex(entry => entry.id === entryId);
  if (index === -1) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  entries.splice(index, 1);

  try {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});

// PUT (edit) an entry by ID
app.put('/entry/:id', (req, res) => {
  const entryId = req.params.id;
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Updated text cannot be empty' });
  }

  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf-8'));
  } catch {
    return res.status(500).json({ message: 'Failed to read entries' });
  }

  const entryIndex = entries.findIndex(entry => entry.id === entryId);
  if (entryIndex === -1) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  entries[entryIndex].text = text.trim();
  entries[entryIndex].date = new Date().toISOString();

  try {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
    res.json({ message: 'Entry updated!', entry: entries[entryIndex] });
  } catch {
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
