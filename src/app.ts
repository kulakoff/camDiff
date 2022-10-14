require("dotenv").config();

import Koa, { DefaultState, DefaultContext, ParameterizedContext } from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import "colors";

import { createCamDiffWorker, camDiffQueue } from "./queues/queues";

import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { KoaAdapter } from "@bull-board/koa";

import { takeScreenshot } from "./helpers/utls";

const app: Koa<DefaultState, DefaultContext> = new Koa();
const router: Router = new Router();
const APP_PORT = 3000;

const serverAdapter = new KoaAdapter();

serverAdapter.setBasePath("/admin");
createBullBoard({
  queues: [new BullAdapter(camDiffQueue)],
  serverAdapter,
});

router.get(
  "/health",
  async (ctx: ParameterizedContext<DefaultState, DefaultContext>) => {
    ctx.body = {
      status: "ok",
      data: "Server is working",
    };
  }
);

interface IRequestBody {
  url: string;
  client_id: number;
  step?: number;
}
router.post("/cam", async (ctx) => {
  /**
   * TODO: переделать типизацию для
   * ctx.request.body
   */
  const { url, client_id } = <any>ctx.request.body;
  if (!url || !client_id) {
    ctx.status = 404;
    return (ctx.body = { status: "fail", message: "bad request body" });
  }
  const job = await createCamDiffWorker({ url, client_id });
  ctx.body = { status: "created", streamId:client_id,jobId: job.id };
});

app.use(serverAdapter.registerPlugin());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// Прослушивание выполенных задач
camDiffQueue.on("global:completed", (jobId, result) =>
  console.log(`::log jobId ${jobId} completed. res: ${result}` )
);

app
  .listen(APP_PORT)
  .on("listening", () => console.log(`App started on port ${APP_PORT}`));
