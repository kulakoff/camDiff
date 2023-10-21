import * as fs from 'fs';
import csvParser from 'csv-parser';

/**
 * Represents data structure for a streaming source.
 * @typedef {Object} StreamData
 * @property {string} url - The URL of the streaming source.
 * @property {string} client_id - The client ID associated with the streaming source.
 */

interface StreamData {
  url: string;
  client_id: string;
}

/**
 * Reads streaming data from a CSV file and converts it to a JSON file.
 * @param {string} csvFilePath - The path of the CSV file.
 * @param {string} jsonFilePath - The path of the JSON file to write the result.
 * @param {Function} callback - The callback function to handle errors.
 */
function processCSV(csvFilePath: string, jsonFilePath: string, callback: (error: Error | null) => void): void {
  const streamList: StreamData[] = [];

  const readStream = fs.createReadStream(csvFilePath);

  readStream
    .on('error', (error) => {
      callback(error);
    })
    .pipe(csvParser({ separator: ';' }))
    .on('data', (row: StreamData) => {
      streamList.push(row);
    })
    .on('end', () => {
      console.log('Stream list:');
      console.log(streamList);

      // Write the parsed data to a JSON file
      fs.writeFile(jsonFilePath, JSON.stringify(streamList, null, 2), (error) => {
        if (error) {
          callback(error);
        } else {
          console.log('Result has been written to JSON file:', jsonFilePath);
          callback(null);
        }
      });
    });
}

const csvFilePath = './cameras.csv';
const jsonFilePath = './stream-list.json';

processCSV(csvFilePath, jsonFilePath, (error) => {
  if (error) {
    console.error('Error:', error.message);
  }
});