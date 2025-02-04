import { PickType } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";

export class SignUpDto extends PickType(UserEntity, ["email", "name", "phone"]) { }
