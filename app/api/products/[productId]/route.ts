"use client"

import Collection from "@/lib/models/Collection"
import Product from "@/lib/models/Product"
import { connectToDB } from "@/lib/mongoDB"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {
    try {
      await connectToDB();
  
      // Log the request parameters for debugging
      console.log("Request Params:", params);

      // Fetch the product and populate its collections
      const product = await Product.findById(params.productId).populate({
        path: "collections",
        model: Collection,
      });

      // Log the fetched product for debugging
      console.log("Fetched Product:", product);

      // Handle cases where the product is not found
      if (!product) {
        return new NextResponse(
          JSON.stringify({ message: "Product not found" }),
          { status: 404 }
        );
      }

      // Send the response with proper JSON serialization
      return new NextResponse(JSON.stringify(product), {
        status: 200
      });
    } catch (err) {
      console.log("[productId_GET]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
