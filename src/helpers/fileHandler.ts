import fs from "fs";
import rimraf from "rimraf";
import du from "du";

/**
 * Class representing a FileHandler for common file and directory operations.
 */
const FileHandler = class {
  /**
   * Creates a directory if it does not exist.
   * @param {string} folderPath - The path of the directory to create.
   */
  createDirIfNotExists(folderPath: string) {
    try {
      if (!fs.lstatSync(folderPath).isDirectory()) {
        fs.mkdirSync(folderPath);
      }
    } catch (e) {
      fs.mkdirSync(folderPath);
    }
  }

  /**
   * Removes a directory and its contents.
   * @param {string} folderPath - The path of the directory to remove.
   * @param {Function} callback - The callback function to execute when the operation is complete.
   */
  removeDirectory(folderPath: string, callback: () => void) {
    rimraf(folderPath, callback);
  }

  /**
   * Gets the size of a directory.
   * @param {string} folderPath - The path of the directory to get the size of.
   * @param {Function} callback - The callback function to execute with the directory size.
   */
  getDirectorySize(folderPath: string, callback: any) {
    du(folderPath, (err, size) => {
      callback(err, size);
    });
  }

  /**
   * Deletes a file.
   * @param {string} filePath - The path of the file to delete.
   * @param {Function} callback - The callback function to execute when the operation is complete.
   */
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
