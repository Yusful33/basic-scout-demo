const { Client } = require('pg');
const { PostgreSqlContainer } = require('@testcontainers/postgresql');
const { createWeatherDataTable, getWeatherData, insertWeatherData, clearWeatherTable } = require('./databaseSetup');


describe('insertWeatherData', () => {
  jest.setTimeout(300000);  

  let client;
  let postgresContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    client = new Client({ connectionString: postgresContainer.getConnectionUri() });
    await client.connect();
    await createWeatherDataTable(client);
  });

  afterAll(async () => {
    await client.end();
    await postgresContainer.stop();
  });


  it('should insert data into the database', async () => {
    const result = await insertWeatherData(client, 'New York', 25.0, 'Clear sky');
    expect(result.rowCount).toBe(1);

    const { rows } = await getWeatherData(client);
    console.log(rows);
    expect(rows.length).toBeGreaterThan(0); // Check that rows are returned
    expect(rows[0].city).toBe('New York');
    expect(rows[0].temperature).toBe(25.0);
    expect(rows[0].description).toBe('Clear sky');
    console.log(rows[0].city)
  });
});
