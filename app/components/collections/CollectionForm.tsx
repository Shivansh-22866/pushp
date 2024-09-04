"use client"

import { Separator } from '@/components/ui/separator'
import React from 'react'
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
import ImageUpload from '@/components/custom_ui/ImageUpload';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.string()
})

const CollectionForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: ''
    }
  })

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values)
    // handle form submission here
  }
  return (
    <div className='p-10 '>
        <p className='text-heading2-bold'>Create Collection</p>
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
                    <Input placeholder="title" {...field} />
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
                    <Textarea placeholder="description" {...field} rows={5} />
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