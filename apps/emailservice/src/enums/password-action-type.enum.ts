import { registerEnumType } from "@nestjs/graphql";

export enum PASSWORD_ACTION_TYPE {
    FORGET_PASSWORD = "FORGET_PASSWORD",
    CREATE_PASSWORD = "CREATE_PASSWORD",
}

registerEnumType(PASSWORD_ACTION_TYPE, {
    name: "PASSWORD_ACTION_TYPE"
});