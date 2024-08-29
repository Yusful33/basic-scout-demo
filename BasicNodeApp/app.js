const express = require('express');
const { Client } = require('pg');
const axios = require('axios');
const fs = require('fs');


const app = express();
const port = 3000;


// Access the POSTGRES_PASSWORD environment variable
const dbPassword = process.env.POSTGRES_PASSWORD;

const db = new Client({
    host: 'db',
    user: 'postgres',
    password: dbPassword,
    // alt database is demo (postgres)
    database: 'postgres',
    port: 5432
  });

// Ensure the weather_data table exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  temperature FLOAT NOT NULL,
  description VARCHAR(255) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
  
db.connect(err => {
if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
}
console.log('Connected to PostgreSQL');

// Create the table after the connection is established
db.query(createTableQuery, (err, res) => {
    if (err) {
    console.error('Error creating table:', err);
    } else {
    console.log('Table is ready or already exists.');
    }
});
});


// Homepage 
app.get('/', (req, res) => {
    res.send(`
      <form action="/weather" method="get">
        <label for="city">Enter city:</label>
        <input type="text" id="city" name="city" required>
        <button type="submit">Get Weather</button>
      </form>
    `);
  });
  

// REST API Endpoint
app.get('/data', (req, res) => {
  db.query('SELECT * FROM weather_data', (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

// External API call with database insertion
app.get('/weather', async (req, res) => {
    const city = req.query.city || 'New York';  // Default to New York if no city is provided
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: '2011c5e9bd90ba0922ab2b165dc0d27b'
        }
      });
      const weatherData = response.data;
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
  
      // Insert data into the database
      const query = `INSERT INTO weather_data (city, temperature, description) VALUES (?, ?, ?)`;
      db.query(query, [city, temperature, description], (err, result) => {
        if (err) {
          console.error('Error inserting data into database:', err);
          res.status(500).send('Database error');
          return;
        }
        res.send(`Weather data for ${city} inserted into database.`);
      });
    } catch (error) {
      res.status(500).send('Error fetching weather data');
    }
  });
