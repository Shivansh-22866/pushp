import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";

import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const orders = await Order.find().sort({createdAt: "desc"})

        const orderDetails = await Promise.all(orders.map(async (order) => {
            const customer = await Customer.findOne({clerkId: order.customerClerkId})
            return {
                _id: order._id,
                customer: customer.name,
                products: order.products.length,
                totalAmount: order.totalAmount,
                shippingRate: order.shippingRate,
                createdAt: format(order.createdAt, "MM dd, yyyy")
            }
        }))

        return NextResponse.json(orderDetails, {status: 200})
    }

    catch(err) {

    }
}