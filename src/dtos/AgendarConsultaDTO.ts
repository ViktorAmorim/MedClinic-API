import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";

export class AgendarConsultaDTO {
  @IsUUID()
  medicoId!: string;

  @IsUUID()
  pacienteId!: string;

  @IsDateString()
  @Matches(/(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/i, {
    message: "A data deve informar o fuso horário, como -03:00 ou Z.",
  })
  dataHora!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
