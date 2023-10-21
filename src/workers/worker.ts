import throng from "throng";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
// import Queue from "bull";
import { camDiffQueue, IcreateCamDiffWorker } from "../queues/queues";
import fh from "../helpers/fileHandler";
import { compareImages, pixelMatch, takeScreenshot } from "../helpers/utls";

const workers = process.env.APP_CONCURRENCY || 2;
const maxJobsPerWorker = 1;

interface ItakeScreenshot {
  source: string;
  clientId: string;
  fileName: string;
}

// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

const toBase64 = (data: string): string => {
  return Buffer.from(data).toString("base64");
};

const start = () => {
  console.log("::: Worker start");

  camDiffQueue.process(maxJobsPerWorker, async (job) => {
    try {
      const now = new Date().toLocaleString("RU")

      job.log("Worker | Job started: " + now);
      let progress: number = 0;
      let result: any;

      const { client_id, url } = <IcreateCamDiffWorker>job.data;
      const flHost: string = url.split("//")[1].split("/")[0].split(":")[0]; //return "fl2.lanta.me"
      const flPort: string = url.split("//")[1].split("/")[0].split(":")[1]; //return "8443"
      const flStreamId: string = url.split("//")[1].split("/")[1]; //return "streamId == client_id"
      console.log(`:: DEBUG | Worker start | flHost: ${flHost} | flPort: ${flPort} | flStreamId: ${flStreamId}`);

      const apiPath = process.env.APP_FLUSSONIC_API_STREAMS as string;
      const reqUrl = `https://${flHost}:${flPort}/${apiPath}/${flStreamId}`;
      // console.log(reqUrl);
      const reqUrlVideoScreenshot = `https://${flHost}:${flPort}/${flStreamId}`;

      //Проверяем статус запрашиваемого стрима
      const { data } = await axios
        .get(reqUrl, {
          headers: {
            Authorization: `Basic ${toBase64(
              (process.env.APP_FLUSSONIC_USERNAME +
                ":" +
                process.env.APP_FLUSSONIC_PASSWORD) as string
            )}`,
          },
        })
        .catch((e) => job.log(e));

      const dvrEnabled = data.stats.dvr_enabled;
      const dvrAlive = data.stats.alive;
      const dvrActive = dvrEnabled && dvrAlive;

      if (dvrActive) {
        job.log(`Worker | DVR is active:  ${new Date().toLocaleString()}`);
      } else {
        job.log(`Worker | DVR is not active:  ${new Date().toLocaleString()}`);
        return { status: "OK", message: "DVR is not active" };
      }

      const momentStep = 1800;
      const thisMoment: number = +(Date.now() / 1000).toFixed(0) - 300;
      const previousMoment: number = thisMoment - momentStep;
      const firstImgName = `${thisMoment}_imgCurrent`;
      const secondImgName = `${thisMoment}_imgPrevious`;

      // Получаем скриншоты с камер
      const result_ =
        (await dvrActive) &&
        Promise.all([
          //получаем скриншот на текущий момент
          takeScreenshot({
            clientId: flStreamId,
            source: reqUrlVideoScreenshot + `/${thisMoment}-preview.mp4`,
            fileName: firstImgName,
          }).then(() => {
            progress = +25;
            job.log(`Worker | get first img: get ${firstImgName}:  ${new Date().toLocaleString()}`);
            job.progress(progress);
          }),
          //получаем предыдущий скриншот
          takeScreenshot({
            clientId: flStreamId,
            source: reqUrlVideoScreenshot + `/${previousMoment}-preview.mp4`,
            fileName: secondImgName,
          }).then(() => {
            progress = +25;
            job.log(`Worker | get second img: get ${secondImgName}:  ${new Date().toLocaleString()}`);
            job.progress(progress);
          }),
        ])
          //Сравниваем полученные скриншоты
          .then(async () => {
            job.log(`Worker | Start compare images:  ${new Date().toLocaleString()}`);
            const compareResult = await compareImages({
              fileName1: `./thumbnails/${flStreamId}/${firstImgName}.png`,
              fileName2: `./thumbnails/${flStreamId}/${secondImgName}.png`,
            });
            result = { streamId: flStreamId, compare: compareResult };
            return result;
          });

      result_.then((data: any) => {
        console.log("result data:");
        console.log(data);
        job.log(`job is complete:  ${new Date().toLocaleString()}`);
        if ( data.compare.status === true) {
          console.log("img is same, remove tmp files");
          // console.log(client_id);
          // console.log(`rm file ./thumbnails/${client_id}/${firstImgName}.png`);
          // console.log(`rm file ./thumbnails/${client_id}/${secondImgName}.png`);
          const filepathFirst = `./thumbnails/${client_id}/${firstImgName}.png`
          const filepathSecond = `./thumbnails/${client_id}/${secondImgName}.png`

          fh.deleteFile(filepathFirst, (err:any, res:any)=>{
            if(err){
              console.error(err)
            } else {
              console.log(res);
            }
          })

          fh.deleteFile(filepathSecond, (err:any, res:any)=>{
            if(err){
              console.error(err)
            } else {
              console.log(res);
            }
          })

          // Удалить скриншоты

        }

        if (data.compare.status === false) {
          console.log("::img don't match, need");
        }
        progress = +100;
        job.progress(progress);
      });

      /** TODO:
       *  - make pixelMatch image difference map!
       *  - make fail event to tg
       */


      // throw an error 5% of the time
      // if (Math.random() < 0.05) {
      //   throw new Error("This job failed!");
      // }

      // while (progress < 100) {
      //   await sleep(50);
      //   progress += 1;
      //   job.progress(progress);
      // }

      return result_;
    } catch (e) {
      throw new Error(`This job failed, ${e}`);
    }
  });
};

throng({ workers, start });
