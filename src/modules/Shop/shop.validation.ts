import { z } from "zod";

export const createShopValidation=z.object({
    userId:z.string({
        message:"User Not Found"
    }),
    name :z.string({
        message:"name is required"
    }),
    shopImg:z.string({
        message:"shop img is required"
    }),
    email:z.string({
        message:"email is required"
    })
})


export const updateValidationSchema=createShopValidation.partial();