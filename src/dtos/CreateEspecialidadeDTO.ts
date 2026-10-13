import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEspecialidadeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome!: string;
}
