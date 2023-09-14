const fs = require('fs');
const csv = require('csv-parser');

// Create an array to store the stream data
const streamList = [];

// Specify the path to your CSV file
const csvFilePath = './cameras.csv';

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv({ separator: ';' })) // Specify the separator used in your CSV file
  .on('data', (row) => {
    // Process each row of data
    console.log(row);
    const { url, client_id } = row;
    streamList.push({ url, client_id });
  })
  .on('end', () => {
    // All data has been read and parsed
    console.log('Stream list:');
    // console.log(streamList);

    // Write the parsed data to a JSON file
    const jsonFilePath = './cameras.json';
    fs.writeFileSync(jsonFilePath, JSON.stringify(streamList, null, 2));

    console.log('Result has been written to JSON file:', jsonFilePath);
  })
  .on('error', (error) => {
    // Handle any errors during reading/parsing
    console.error('Error:', error.message);
  });