// app_b/server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 1001;

app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'kaan',
  host: 'database',
  database: 'mydb',
  password: '0909',
  port: 5432,
});

// Improved HTML template for the form
const formHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Record</title>
</head>
<body>
    <h1>Submit a New Record</h1>
    <form action="/submit" method="post">
        <input type="text" name="firstName" placeholder="First Name" required>
        <input type="text" name="lastName" placeholder="Last Name" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(formHTML);
});

app.post('/submit', async (req, res) => {
  const { firstName, lastName } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM names WHERE firstname = $1 AND lastname = $2', [firstName, lastName]);
    if (result.rows.length > 0) {
      res.send('Name already exists. <a href="/">Try again</a>');
    } else {
      await client.query('INSERT INTO names(firstname, lastname) VALUES($1, $2)', [firstName, lastName]);
      res.send('Record added successfully! <a href="/">Add another record</a>');
    }
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Application 1 running on port ${port}`);
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
