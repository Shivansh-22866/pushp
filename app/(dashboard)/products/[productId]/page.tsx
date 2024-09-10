"use client"

import Loader from '@/app/components/custom_ui/Loader'
import ProductForm from '@/app/components/products/ProductForm'
import React, { useEffect, useState } from 'react'

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)


  const getProductDetails = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      console.log(res)
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }

  useEffect(() => {
    getProductDetails()
  })

  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails