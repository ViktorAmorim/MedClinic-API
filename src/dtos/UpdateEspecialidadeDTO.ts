import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateEspecialidadeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;
}
