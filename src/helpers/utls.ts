// Получить скриншот видеопотока

import ffmpeg from "fluent-ffmpeg";
import jimp from "jimp";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fh from "./fileHandler";

import { readFileSync, writeFileSync } from "fs";

export interface ItakeScreenshot {
  source: string;
  clientId: string;
  fileName: string;
}
export interface IcompareImagesProps {
  fileName1: string;
  fileName2: string;
  threshold?: number;
}
export interface IpixelMatch {
  clientId: string;
  img1Name: string;
  img2Name: string;
}

/**
 * Получаем скриншоты
 * @param
 * @returns
 */
const takeScreenshot = ({ source, clientId, fileName }: ItakeScreenshot) => {
  console.log("source: ", source);
  return new Promise(async (resolve, reject) => {
    const outputFile = `${fileName}.png`;
    fh.createDirIfNotExists(`./thumbnails/${clientId}`);

    await ffmpeg({ source })
      .on("end", () => resolve("Thumbnail created " + outputFile))
      .on("error", reject)
      // .on("filenames", (filename) => console.log(filename))
      .screenshots({
        timemarks: [1],
        count: 1,
        filename: outputFile,
        folder: `./thumbnails/${clientId}`,
      });
  });
};

/**
 * Сравнить две картинки v1
 * @param
 * @returns
 */
const compareImages = async ({
  fileName1,
  fileName2,
  threshold = 0.15,
}: IcompareImagesProps) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file1 = await jimp.read(fileName1);
      const file2 = await jimp.read(fileName2);
      const hashFile1 = file1.hash();
      const hashFile2 = file2.hash();
      const distance = jimp.distance(file1, file2);
      const { percent: diff } = jimp.diff(file1, file2);

      if (distance > threshold || diff > threshold) {
        resolve({
          status: false,
          message: "Images don't match",
          img: { distance, diff },
        });
      } else {
        resolve({
          status: true,
          message: "Images are same",
          img: { distance, diff },
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Рисуем карту с изменениями
 * @param
 * @returns
 */
const pixelMatch = async ({ clientId, img1Name, img2Name }: IpixelMatch) => {
  const img1 = PNG.sync.read(
    readFileSync(`./thumbnails/${clientId}/${img1Name}.png`)
  );
  const img2 = PNG.sync.read(
    readFileSync(`./thumbnails/${clientId}/${img2Name}.png`)
  );
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  await pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });
  await writeFileSync(
    `./thumbnails/${clientId}/diff.png`,
    PNG.sync.write(diff)
  );
};

export { takeScreenshot, compareImages, pixelMatch };
