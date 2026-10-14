import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class UpdateMedicoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  crm!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefone!: string;

  @IsUUID()
  @IsNotEmpty()
  especialidadeId!: string;
}
