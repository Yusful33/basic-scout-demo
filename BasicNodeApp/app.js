const express = require('express');
const { Client } = require('pg');
const axios = require('axios');
const fs = require('fs');



const app = express();
const port = 3000;


// Undefined variable
// const undefinedVariable = notDefined; 


// Access the POSTGRES_PASSWORD environment variable
const dbPassword = process.env.POSTGRES_PASSWORD;


function getSecret(secretName) {
    try {
      const secret = fs.readFileSync(`/run/secrets/${secretName}`, 'utf8');
      return secret.trim();
    } catch (err) {
      console.error(`Error reading secret ${secretName}:`, err);
      return null;
    }
  }

function insertWeatherData(db, city, temperature, description) {
return new Promise((resolve, reject) => {
    const query = `INSERT INTO weather_data (city, temperature, description) VALUES ($1, $2, $3)`;
    db.query(query, [city, temperature, description], (err, result) => {
    if (err) {
        console.error('Error inserting data into database:', err);
        reject(err);
    } else {
        resolve(result);
    }
    });
});
}
  

console.log(getSecret('api-key'));

// Read the secret from the file
const apiKey = fs.readFileSync('/run/secrets/api-key', 'utf8').trim();


const db = new Client({
    host: 'db',
    user: 'postgres',
    password: dbPassword,
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
  db.query('SELECT * FROM weather_data;', (err, results) => {
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
          appid: apiKey,
          units: 'imperial'     }
      });
      const weatherData = response.data;
      const temperatureFahrenheit = weatherData.main.temp;
      const description = weatherData.weather[0].description;
  
      // Insert Data into Database
      await insertWeatherData(db, city, temperatureFahrenheit, description);

      // Render the data on the page
      res.send(`
        <h1>Weather Data for ${city}</h1>
        <p>Temperature: ${temperatureFahrenheit}°F</p>
        <p>Description: ${description}</p>
        <p>Data has been successfully loaded into the database.</p>
        <a href="/" style="text-decoration: none; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px;">Go back</a>
        <a href="/data" style="text-decoration: none; background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px;">View All Data</a>
      `);
    } catch (error) {
        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching weather data');
    }
  });

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });