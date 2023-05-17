export class CreateCamWorkerDto {
  url: string;
  client_id: string; //stream id
  type?: string | null; // Пока не используется, есть  задумка использовать этот атрибут  для выставления приоритера
  step?: number; //Количество милисекунд от текущей даты для снятия скриншота
  threshold?: number; //Чувствительность в процентах
}
