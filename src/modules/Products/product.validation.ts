import { z } from "zod";

export const productValidationSchema=z.object({
    title:z.string({
        message:"title is required"
    }),
    price:z.number({
        message:"price is required"
    }),
    description:z.string({
        message:"description is required"
    })
})

export const updateproductValidationSchema=productValidationSchema.partial();