import fs from "fs";
import rimraf from "rimraf";
import du from "du";

const FileHandler = class {
  createDirIfNotExists(folderPath: string) {
    try {
      if (!fs.lstatSync(folderPath).isDirectory()) {
        fs.mkdirSync(folderPath);
      }
    } catch (e) {
      fs.mkdirSync(folderPath);
    }
  }

  removeDirectory(folderPath: string, callback: () => void) {
    rimraf(folderPath, callback);
  }

  getDirectorySize(folderPath: string, callback: any) {
    du(folderPath, (err, size) => {
      callback(err, size);
    });
  }

  deleteFile(filePath: string, callback:any){
    fs.unlink(filePath, (err)=>{
      if (err) {
        callback(err);
      } else {
        callback(null, `File ${filePath} deleted successfully`);
      }
    })
  }
};

export default new FileHandler();
