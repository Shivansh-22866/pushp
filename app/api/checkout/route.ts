import { metadata } from '@/app/(auth)/layout';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    typescript: true
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
  export async function POST(req: NextRequest) {
    try {
      const { cartItems, customer } = await req.json();
  
      if (!cartItems || !customer) {
        return new NextResponse("Not enough data to checkout", { status: 400 });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        shipping_options: [
          { shipping_rate: "shr_1PyzFjP2XOr2Y5w7phLz3UqJ" },
          { shipping_rate: "shr_1PyzEyP2XOr2Y5w7O1Fqt3Gu" },
          { shipping_rate: "shr_1PyzGGP2XOr2Y5w7KpfhoMFO" }
        ],
        line_items: cartItems.map((cartItem: any) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: cartItem.item.title,
              metadata: {
                productId: cartItem.item._id,
                ...(cartItem.size && { size: cartItem.size }),
                ...(cartItem.color && { color: cartItem.color }),
              },
            },
            unit_amount: cartItem.item.price * 100,
          },
          quantity: cartItem.quantity,
        })),
        client_reference_id: customer.clerkId,
        success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
        cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
      });
  
      return NextResponse.json(session, { headers: corsHeaders });
    } catch (err) {
      console.log("[checkout_POST]", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }