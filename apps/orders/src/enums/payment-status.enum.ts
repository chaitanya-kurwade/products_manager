import { registerEnumType } from "@nestjs/graphql";

export enum PAYMENT_STATUS {
    PAID = 'PAID',
    TO_BE_PAID = 'TO_BE_PAID',
}

registerEnumType(PAYMENT_STATUS, {
    name: 'PAYMENT_STATUS'
})