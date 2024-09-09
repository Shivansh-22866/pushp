"use client"

import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
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

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.string()
})

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({initialData}) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
      title: '',
      description: '',
      image: ''
    }
  })

  const router = useRouter();

  const [loading, setLoading] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values)
    try {
      setLoading(true);
      const url = initialData ? `/api/collections/${initialData._id}` : "/api/collections"
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values)
      })

      if(res.ok) {
        setLoading(false);
        toast.success(`Collection ${initialData ? "updated" : "created"} successfully`)
        window.location.reload()
        router.push("/collections");
      }
    } catch(err) {
      console.error('Failed to create collection:', err)
      toast.error("Something went wrong! Please try again")
    }
  }
  return (
    <div className='p-10 '>
        {
          initialData? (
            <div className='flex items-center justify-between'>
              <p className='text-heading2-bold'>Edit Collection</p>
              <Delete id={initialData._id} />
            </div>
          ) : (
            <p className='text-heading2-bold'>Create Collection</p>
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
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                    <ImageUpload value={field.value ? [field.value] : []} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className='flex gap-10'>
                <Button type="submit" className='bg-blue-1 text-white'>Submit</Button>
                <Button type="button" className='bg-blue-1 text-white' onClick={() => router.push("/collections")}>Discard</Button>
            </div>
        </form>
        </Form>
    </div>
  )
}

export default CollectionForm