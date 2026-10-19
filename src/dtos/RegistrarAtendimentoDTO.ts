import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegistrarAtendimentoDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  observacoes?: string;

  @IsString()
  @IsNotEmpty()
  diagnostico!: string;
}
