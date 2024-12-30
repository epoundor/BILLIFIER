import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsOptional, IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string | undefined;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phone: string | undefined;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    otp: string;
}
