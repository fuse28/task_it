import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  mentionedUserIds?: number[];
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  mentionedUserIds?: number[];
}
