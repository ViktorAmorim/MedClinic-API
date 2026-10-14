import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreatePacienteDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  senha!: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/) // Regex para validar o CPF no formato XXX.XXX.XXX-XX
  @IsNotEmpty()
  cpf!: string;

  @IsDateString()
  @IsNotEmpty()
  dataNascimento!: string;
}
