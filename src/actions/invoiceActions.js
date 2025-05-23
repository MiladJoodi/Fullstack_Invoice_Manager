"use server"

import { connectMongoDB } from "@/lib/mongodb"
import Invoice from "@/models/InvoiceModel"
import { revalidatePath } from "next/cache"

export const getErrorMessages = (error)=>{
    let message;
    if(error instanceof Error){
        message = error.message
    } else if (error && typeof error === "object" && "message" in error) {
        message = String(error.message)
        
    } else if (typeof error === "string") {
        message = error
    } else {
        message = "Something went wrong"
    }
    return message;
}

export const createInvoice = async (formData) => {
    const { amount, customer, status } = formData

    try{
        if(!amount || !customer || !status){
            return {
                error: "Please fill all the fields",
            }
        }
        await connectMongoDB()
        await Invoice.create({
            customer,
            amount,
            status
        })

        revalidatePath("/")

        return {
            message: "Invoice Create successfully",
        }

    }catch(error){
        console.log(first)
        return {
            error: getErrorMessages(error),
        }
    }
    
}

export const getInvoices = async (params) => {
    
    const page = parseInt(params.page || 1);
    const limit = parseInt(params.limit || 10);
    const skip = (page - 1) * limit;

    const query = {
        ...(params.search && {
            $or: [
                { amount: { $regex: params.search, $options: "i" } },
                { status: { $regex: params.search, $options: "i" } },
                { "customer.name": { $regex: params.search, $options: "i" } },
                { "customer.email": { $regex: params.search, $options: "i" } },
            ],
        }),
    }

    try{
        await connectMongoDB()
        const invoices = await Invoice.find(query)
            .skip(skip)
            .limit(limit)

        const total = await Invoice.countDocuments(query);
        const pageCount = Math.ceil(total / limit);

        return JSON.stringify({
            total,
            pageCount,
            data: invoices,
            
        })

    }catch(error){
        console.log(first)
        return {
            error: getErrorMessages(error),
        }
    }
    
}

export const deleteInvoice = async (id) => {

    try{
        await connectMongoDB()
        await Invoice.findByIdAndDelete(id)

        revalidatePath("/")

        return {
            message: "Invoice deleted successfully",
        }

    }catch(error){
        console.log(first)
        return {
            error: getErrorMessages(error),
        }
    }
    
}

export const getInvoice = async (id) => {

    try{
        await connectMongoDB()
        const invoice = await Invoice.findById(id)
        return JSON.stringify(invoice)

    }catch(error){
        console.log(first)
        return {
            error: getErrorMessages(error),
        }
    }
    
}

export const updateInvoice = async (formData) => {
    const { amount, customer, status, id } = formData

    try{
        await connectMongoDB()
        await Invoice.findByIdAndUpdate(id, {
            amount,
            status
        })
        revalidatePath("/")
        return {
            message: "Invoice updated successfully",
        }

    }catch(error){
        console.log(first)
        return {
            error: getErrorMessages(error),
        }
    }
    
}