import { DataTable } from '@/app/components/custom_ui/DataTable'
import { columns } from '@/app/components/orders/OrderColumns'
import { Separator } from '@radix-ui/react-separator'
import React from 'react'

const Orders = async () => {
  const res = await fetch("http://localhost:3000///api///orders/")
  const orders = await res.json()

  console.log(orders)

  return (
    <div className='px-10 py-5'>
        <p className='text-heading2-bold'>Orders</p>
        <Separator className='bg-grey-1 my-5' />
        <DataTable columns={columns} data={orders} searchKey='_id' />
    </div>
  )
}

export default Orders