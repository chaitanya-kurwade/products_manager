import { registerEnumType } from "@nestjs/graphql";

export enum CURRENCY {
    INR = 'INR',
    USD = 'USD',
}

registerEnumType(CURRENCY, {
    name: 'CURRENCY',
    description: 'Supported currencies',
});
