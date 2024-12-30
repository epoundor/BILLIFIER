import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class UserEntity implements User {
    @ApiProperty({ readOnly: true })
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phone: string | undefined;

    @ApiProperty({ readOnly: true })
    emailVerified: boolean;

    @IsStrongPassword()
    password: string;

    @ApiProperty({ readOnly: true })
    createdAt: Date;

    @ApiProperty({ readOnly: true })
    updatedAt: Date;
}
