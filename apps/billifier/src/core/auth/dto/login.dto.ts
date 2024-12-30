import { ApiProperty, PickType } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { IsEmail, IsPhoneNumber, IsOptional } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string | undefined;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phone: string | undefined;
}
