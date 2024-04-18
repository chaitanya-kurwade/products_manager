import { registerEnumType } from "@nestjs/graphql";

export enum PAYMENT_TYPE {
    CARD = 'CARD',
    UPI = 'UPI',
    NET_BANKING = 'NET_BANKING',
    COD = 'COD',
}

registerEnumType(PAYMENT_TYPE, {
    name: "PAYMENT_TYPE"
});