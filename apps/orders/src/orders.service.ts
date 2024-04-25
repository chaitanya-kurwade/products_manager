import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name) private readonly ordersModel: Model<OrderDocument>) {
  }

  async createOrder(createOrderInput: CreateOrderInput): Promise<Order> {
    // const existingOrder = await this.ordersModel.findById(createOrderInput.orderNumber);
    const orderByNumber = await this.ordersModel.findOne({ orderNumber: createOrderInput.orderNumber });
    if (orderByNumber) {
      throw new BadRequestException(`order already exists with _id: ${orderByNumber._id}`);
    }
    return await this.ordersModel.create(createOrderInput);
  }

  async getAllOrders(): Promise<Order[]> {
    const allOrders = await this.ordersModel.find().exec();
    if (!allOrders || allOrders.length === 0) {
      throw new NotFoundException('Orders not found');
    }
    return allOrders;
  }

  async getOneOrder(_id: string): Promise<Order> {
    const order = await this.ordersModel.findById(_id).exec();
    if (!order) {
      throw new NotFoundException(`order not found with _id: ${_id}`);
    }
    return order;
  }

  async updateOrderById(_id: string, updateOrderInput: UpdateOrderInput): Promise<Order> {
    const order = await this.ordersModel.findById(_id);
    if (!order) {
      throw new NotFoundException(`order not updated with _id: ${_id}`);
    }
    const updatedOrder = await this.ordersModel.findByIdAndUpdate(_id, updateOrderInput, { new: true });
    return updatedOrder;
  }

  async removeOrder(_id: string): Promise<string> {
    const getOrder = await this.ordersModel.findByIdAndDelete(_id).exec();
    if (!getOrder) {
      throw new NotFoundException(`order not deleted with _id: ${_id}`);
    }
    return `order deleted with _id: ${_id}`;
  }
}
