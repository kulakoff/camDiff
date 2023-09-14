import * as fs from 'fs';
import csvParser from 'csv-parser';

interface StreamData {
  url: string;
  client_id: string;
}

const streamList: StreamData[] = [];
const csvFilePath = './cameras.csv';
const jsonFilePath = './stream-list.json';

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