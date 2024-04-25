import { registerEnumType } from "@nestjs/graphql";

export enum ORDER_STATUS {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

registerEnumType(ORDER_STATUS, {
    name: "ORDER_STATUS"
});