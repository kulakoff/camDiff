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

const streamList: StreamData[] = [];
const csvFilePath: string = './cameras.csv';
const jsonFilePath: string = './stream-list.json';

/**
 * Reads a CSV file containing streaming data and converts it to JSON format.
 * @param {string} csvFilePath - The path of the CSV file.
 * @param {string} jsonFilePath - The path of the JSON file to write the result.
 */
fs.createReadStream(csvFilePath)
  .pipe(csvParser({ separator: ';' }))
  .on('data', (row:any) => {
    const { url, client_id } = row;
    streamList.push({ url, client_id });
  })
  .on('end', () => {
    console.log('Stream list:');
    console.log(streamList);

    // Write the parsed data to a JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(streamList, null, 2));

    console.log('Result has been written to JSON file:', jsonFilePath);
  })
  .on('error', (error:any) => {
    console.error('Error:', error.message);
  });