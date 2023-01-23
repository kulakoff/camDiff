import Queue from "bull";

// Создаем очередь / подключаемся к существующей по имени
const camDiffQueue = new Queue("camDiff", {
  redis: {
    host: process.env.API_REDIS_HOST || "127.0.0.1",
    port: parseInt(String(process.env.API_REDIS_PORT || 6379)),
  },
});

export interface IcreateCamDiffWorker {
  url: string;
  client_id: number; //stream id
  type?: string | null; // Пока не используется, есть  задумка использовать этот атрибут  для выставления приоритера
  step?: number; //Количество милисекунд от текущей даты для снятия скриншота
  threshold?: number; //Чувствительность в процентах
}

export interface IcreateSslCheckerWorker {
  url: string;
  port: number;
}

const createCamDiffWorker = ({
  url,
  client_id,
  type,
  step = 1800,
  threshold = 0.15,
}: IcreateCamDiffWorker) => {
  return camDiffQueue.add(
    { url, client_id, step, threshold },
    {
      attempts: 2,
      // priority: getJobPriority(type),
    }
  );
};

const createSslCheckerWorker = ({ url, port }: IcreateSslCheckerWorker) => {
  return camDiffQueue.add(
    { url, port },
    {
      attempts: 5,
    }
  );
};

//Назначаем приоритет для задачи
const getJobPriority = (type: string | null) => {
  //   if (!task.qos) return 3;
  //   return task?.qos > 100 ? 1 : 2;
  return 3;
};

const sslCheckerQueue = new Queue("sslChecker", {
  redis: {
    host: process.env.API_REDIS_HOST || "127.0.0.1",
    port: parseInt(String(process.env.API_REDIS_PORT || 6379)),
  },
});

export { camDiffQueue, createCamDiffWorker, sslCheckerQueue, createSslCheckerWorker };
