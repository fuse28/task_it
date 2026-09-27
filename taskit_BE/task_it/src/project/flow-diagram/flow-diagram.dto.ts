import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFlowDiagramDto {
  @IsInt()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateFlowDiagramDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  data?: { nodes: unknown[]; edges: unknown[] };
}
