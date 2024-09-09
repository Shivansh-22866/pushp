"use client"

import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/app/components/custom_ui/ImageUpload';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Delete from '../custom_ui/Delete';
import MultiText from '../custom_ui/MultiText';
import MultiSelect from '../custom_ui/MultiSelect';

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1)
})

interface ProductFormProps {
  initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({initialData}) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
      title: '',
      description: '',
      media:[],
      category: '',
      collections: [],
      tags: [],
      sizes: [],
      colors: [],
      price: 0.1,
      expense: 0.1
    }
  })

  const router = useRouter();

  const [loading, setLoading] = useState(false)
  const [collections, setCollections] = useState<CollectionType[]>([])

  const getCollection = async () => {
    try {
        setLoading(true)
        const res = await fetch("/api/collections", {
            method: "GET"
        })
        const data = await res.json()
        setCollections(data)
        setLoading(false)
    }

    catch(err) {
        console.error('Failed to fetch collections:', err)
        toast.error("Failed to fetch collections")
    }
  }

  useEffect(() => {
    getCollection()
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values)
    try {
      setLoading(true);
      const url = initialData ? `/api/products/${initialData._id}` : "/api/products"
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values)
      })

      if(res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"} successfully`)
        window.location.reload()
        router.push("/products");
      }
    } catch(err) {
      console.error('Failed to create product:', err)
      toast.error("Something went wrong! Please try again")
    }
  }
  return (
    <div className='p-10 '>
        {
          initialData? (
            <div className='flex items-center justify-between'>
              <p className='text-heading2-bold'>Edit Product</p>
              <Delete id={initialData._id} />
            </div>
          ) : (
            <p className='text-heading2-bold'>Create Product</p>
          )
        }
        <Separator className='bg-grey-1 mt-4 mb-7'/>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="description" {...field} rows={5} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                    <ImageUpload value={field.value} onChange={(url) => field.onChange([...field.value, url])} onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className='md:grid md:grid-cols-3 gap-8'>
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price ()</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Price" {...field} onKeyDown={handleKeyPress} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="expense"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Expense ()</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Expense" {...field} onKeyDown={handleKeyPress} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                        <Input placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        
                <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                    <MultiSelect
                      collections={collections}
                      placeholder="Collections"
                      value={field.value}
                      onChange={(_id) => field.onChange([...field.value, _id])}
                      onRemove={(idToRemove) =>
                        field.onChange([
                          ...field.value.filter((collectionId) => collectionId !== idToRemove),
                        ])
                      }
                    />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className='flex gap-10'>
                <Button type="submit" className='bg-blue-1 text-white'>Submit</Button>
                <Button type="button" className='bg-blue-1 text-white' onClick={() => router.push("/collections")}>Discard</Button>
            </div>
        </form>
        </Form>
    </div>
  )
}

export default ProductForm