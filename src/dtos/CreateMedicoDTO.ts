import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateMedicoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  crm!: string;

  @IsEmail()
  @MaxLength(150)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsUUID()
  especialidadeId!: string;
}
