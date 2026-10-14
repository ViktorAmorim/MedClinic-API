import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsDateString,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class UpdatePacienteDTO {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsEmail()
  email?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  cpf?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  dataNascimento?: string;
}
