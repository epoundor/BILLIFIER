import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";

export class OkResponse {
    @ApiProperty()
    message: "OK"
}

export class VerifyOtpResponse {
    @ApiProperty()
    user: UserEntity
    @ApiProperty()
    refreshToken: string
    @ApiProperty()
    accessToken: string
}