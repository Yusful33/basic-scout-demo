const { Client } = require('pg');

const createWeatherDataTable = async (client) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS weather_data (
        id SERIAL PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        temperature FLOAT NOT NULL,
        description VARCHAR(255) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
  await client.query(sql);
};

const insertWeatherData = async (client, city, temperature, description) => {
    if (temperature === null || isNaN(temperature)) {
      throw new Error('Invalid temperature');
    }
  
    const sql = "INSERT INTO weather_data (city, temperature, description) VALUES ($1, $2, $3);";
    const result = await client.query(sql, [city, temperature, description]);
    return result;
  };
  

const getWeatherData = async (client) => {
  const sql = "SELECT * FROM weather_data";
  const result = await client.query(sql);
  return result;
};

const clearWeatherTable = async (client) => {
  const sql = "TRUNCATE TABLE weather_data";
  await client.query(sql);
};

module.exports = { createWeatherDataTable, insertWeatherData, getWeatherData, clearWeatherTable};
