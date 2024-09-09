"use client"

import { columns } from '@/app/components/collections/CollectionColumns'
import { DataTable } from '@/app/components/custom_ui/DataTable'
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-separator'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Collections = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [collection, setCollections] = useState([])

    const getCollections = async() => {
        try {
            const res = await fetch("/api/collections", {
                method: "GET"
            })
            const data = await res.json()
            setCollections(data)
            setLoading(false)
        }
        catch(err) {
            console.error('Failed to fetch collections:', err)
        }
    }

    useEffect(() => {
        getCollections()
    },[])


  return (
    <>
        <div>
        
        </div>
        <div className='px-10 py-5'>
            <div className='flex items-center justify-between'>
                <p className='text-heading2-bold'>Collections</p>
                <Button className='bg-blue-1 text-white' onClick={() => router.push("/collections/new")}>
                    <Plus className='w-4 h-4 mr-2'/>
                    Create Collections
                </Button>
            </div>
            <Separator className='bg-grey-1 my-4'/>
            <DataTable columns={columns} data={collection} searchKey='title' />
        </div>
    </>
  )
}

export default Collections