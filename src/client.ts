//тестовый клиент для имитации добавления задач

import axios from "axios";
import console from "console";
import { IcreateCamDiffWorker } from "./queues/queues";

const streamsEndpoint = "http://127.0.0.1:5000/cameras";

const getStreams = async () => {
  // Получаем список стримов
  const { data } = await axios.get(streamsEndpoint);
  // console.log(data);
  console.log(data.length);

  // Создаем задачи
  data.map((stream: IcreateCamDiffWorker) => {
    axios
      .post("http://localhost:3030/cam", stream)
      .then(() => console.log(`add  task, streamId ${stream.client_id}`));
  });
};

getStreams();
