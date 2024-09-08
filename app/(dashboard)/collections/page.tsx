"use client"

import React, { useEffect, useState } from 'react'

const Collections = () => {
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

    console.log(collection)

  return (
    <div>Collections</div>
  )
}

export default Collections