const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/book-ride', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'book-ride.html'));
});

app.post('/submit-ride', (req, res) => {
  // Here you would typically save the ride details to a database
  // For this example, we'll just send back a success message
  res.json({ message: "Ride submitted for approval" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
