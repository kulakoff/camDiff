import { IsEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
export class CreateCamWorkerDto {
  @IsUrl()
  url: string;
  @IsString()
  client_id:   string; //stream id
  @IsString()
  type?: string | null; // Пока не используется, есть  задумка использовать этот атрибут  для выставления приоритера
  step?: number; //Количество милисекунд от текущей даты для снятия скриншота
  @IsNumber()
  threshold?: number; //Чувствительность в процентах
}
