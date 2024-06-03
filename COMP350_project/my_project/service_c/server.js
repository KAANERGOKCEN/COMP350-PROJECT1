// application_2/server.js
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 1000;

const pool = new Pool({
  user: 'kaan',
  host: 'database',
  database: 'mydb',
  password: '0909',
  port: 5432,
});

// Improved HTML structure
const generateHTML = (rows) => {
  const listItems = rows.map(row => `<li>${row.firstname} ${row.lastname} - <a href="/delete/${row.id}" onclick="return confirm('Are you sure you want to delete this record?');">Delete</a></li>`).join('');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>List of Names</title>
</head>
<body>
    <h1>List of Records</h1>
    <ul>${listItems}</ul>
    <a href="/">Refresh List</a>
</body>
</html>
  `;
};

app.get('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, firstname, lastname FROM names ORDER BY id');
    res.send(generateHTML(result.rows));
  } catch (error) {
    console.error('Failed to retrieve records:', error);
    res.status(500).send('Failed to load data.');
  } finally {
    client.release();
  }
});

app.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM names WHERE id = $1', [id]);
    res.redirect('/');
  } catch (error) {
    console.error('Failed to delete record:', error);
    res.status(500).send('Failed to delete record.');
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Application 2 running on port ${port}`);
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
