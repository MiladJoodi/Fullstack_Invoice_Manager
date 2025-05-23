"use client"

import React, { useEffect, useState } from 'react'
import ActionModal from '../widgets/ActionModal'
import { Button } from '../ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Link from 'next/link'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LoadingButton } from '../widgets/Loader'
import { useRouter, useSearchParams } from 'next/navigation'
import { createInvoice, getInvoice, updateInvoice } from '@/actions/invoiceActions'
import { toast } from 'react-toastify'


const customers = [
  {
    id: 1,
    name: "Akpareva Zino",
    image: "https://images.unsplash.com/flagged/photo-1557807869-bcf3e8e4ca98?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    email: "donaldzee.ng@gmail.com"
  },
  {
    id: 2,
    name: "Akpareva Zino2",
    image: "https://media.istockphoto.com/id/182035224/nl/foto/fierce-male-to-female-transexual.jpg?s=2048x2048&w=is&k=20&c=cdn_9r-rMakUX8ZWQooOUdnfxqwTb0mAsZAA973KgM4=",
    email: "johndoi@gmail.com"
  },
  {
    id: 3,
    name: "Jane Doe",
    image: "https://accountmanagement.gettyimages.com/Account/ProfileImage/90f722c8-aa89-44ee-b088-2805003eb44d.jpg",
    email: "johndoi@gmail.com"
  }
]


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name id required",
  }),
  status: z.string().min(2, {
    message: "Status id required",
  }),
  amount: z.string().min(2, {
    message: "Amount id required",
  }),
})

export default function CreateInvoice() {

  const [open, setOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      status: "Unpaid",
    },
  })

  const isLoading = form.formState.isSubmitting


  async function onSubmit(values) {
    console.log(values)
    const { name, amount, status } = values;
    const customer = customers.find((c)=> c.name === name);

    const formData = {
      amount,
      customer,
      status,
      id: id ? id : ""
    }

    if (id){
      //update
      const res = await updateInvoice(formData)
      console.log(res)

      if(res?.error){
        toast.error(res?.error)
      }
      if(res?.message){
        toast.success(res?.message)
      }
      form.reset()
      setOpen(false)

    } else {
      //create
      const res = await createInvoice(formData)
      console.log(res)

      if(res?.error){
        toast.error(res?.error)
      }
      if(res?.message){
        toast.success(res?.message)
      }
      form.reset()
      setOpen(false)
    }
  }

  useEffect(()=>{
    const fetchInvoice = async () => {
      const res = await getInvoice(id);
      const inv = JSON.parse(res);

      form.setValue("name", inv?.customer?.name)
      form.setValue("amount", inv?.amount)
      form.setValue("status", inv?.status)
    }

    if (id){
      setOpen(true)
      fetchInvoice()
    }
  }, [id])

  useEffect(()=>{
    if(!open){
      router.replace("/")
    }
  },[open, router])

  return (
    <ActionModal
      title="Create Invoice"
      desc="Create a new invoice"
      trigger={
        <Button className="text-white space-x-1">
          <span>Create Invoice</span>
          <span className='text-lg'>+</span>
        </Button>
      }
      open={open}
      setOpen={setOpen}
    >

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>

                    <SelectGroup>
                      <SelectLabel>Customer</SelectLabel>
                      <>
                        {customers?.map((item) => {
                          const { name } = item
                          return (
                            <SelectItem key={item.id} value={name}>{name}</SelectItem>
                          )
                        })}
                      </>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Unpaid" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Unpaid
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Paid" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Paid
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          {isLoading ? (
            <LoadingButton
              btnText={"Loading"}
              btnClass="w-full"
              btnVariant={"outline"}
            />
          ) : (
            <Button className="w-full" type="submit">
              {id ? "Update Invoice" : "Create Invoice"}
            </Button>
          )}
        </form>
      </Form>

    </ActionModal>
  )
}
