import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from '../../../../libs/data/src/lib/task.types';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional() @IsString() description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)   
  status?: TaskStatus;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

   @IsOptional() @IsString() description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  category?: string;
}

export class QueryTaskDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
