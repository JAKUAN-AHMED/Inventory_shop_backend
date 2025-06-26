import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import { HttpStatusCode } from "axios";
import AppError from "../../errors/AppError";
import { NotFound } from "../../utils/utility";
import stripe from "../../config/stripe";


//create product
const createProduct = catchAsync(async (req, res) => {
    const { name, amount, currency = 'usd', interval, Duraion } = req.body;


    const isExist = await prisma.license.findUnique({
        where: {
            name
        }
    })

    await NotFound(isExist, 'The name you this is not exist at the license collection  and license');

    const isAlreadyProductCreated = await prisma.product.findUnique({
        where: {
            productName: name
        }
    })

    if (isAlreadyProductCreated) {
        throw new Error("Already Created Product");

    }

    const dbproduct = await prisma.product.create({
        data: {
            productName: name,
            productPrice: amount,
        }
    })
    const product = await stripe.products.create({ name });
    const price = await stripe.prices.create({
        unit_amount: amount * 100,
        currency: currency,
        recurring: {
            interval: interval, // e.g., 'month'
            interval_count: Duraion || 1, // e.g., 3 for every 3 months
        },
        product: product.id,
    });
    if (product) {
        await prisma.product.update({
            where: {
                id: dbproduct.id
            },
            data: {
                productId: product.id,
                priceId: price.id,
                licenseId: isExist?.id
            }
        })
    }
    const result = {
        product,
        price
    }
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created  Product' : 'Failed to Create Product',
    });
})



const allProducts = catchAsync(async (req, res) => {
    const result = await prisma.product.findMany({
        select: {
            productName: true,
            productId: true
        }
    })

    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrived All Plans' : 'Failed to Get  Plans',
        Data: isOk ? result : [],
    });
})
const updateProduct = catchAsync(async (req, res) => {
    const { name, price } = req.body;
    let isExist = null;
    if (name) {
        isExist = await prisma.license.findUnique({
            where: {
                name
            }
        })

        await NotFound(isExist, 'The name you this is not exist at the license collection  and license');
        await prisma.license.update({
            where: {
                id: isExist?.id
            },
            data: {
                price,
                name
            }
        })

        await prisma.product.update({
            where: {
                productName: name
            },
            data: {
                productPrice: price
            }
        })
    }
    const product = await stripe.products.update(req.params.id, { name });
    if (price) {

        await NotFound(req.params.id, "Product Id");
        // Create new price for the product
        const newPrice = await stripe.prices.create({
            unit_amount: price * 100,
            currency: "usd",
            product: req.params.id,
        });



    }
    const isOk = product ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Update Product Name' : 'Failed to Delete User',
    });

})


const createSession = async (req: Request, res: Response): Promise<void> => {
    // const userId=req.user.id;
    // await NotFound(userId,'User ID');
    req.body.userId = req.user.id;
    const { productId, userId } = req.body;

    const product = await prisma.product.findUnique({ where: { productId } });
    if (!product) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'product not found',
            Data: [],
        });
        return;
    }


    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: product.priceId!,
                quantity: 1,
            },
        ],
        success_url: `http://localhost:3000/payment/success`,
        cancel_url: `http://localhost:3000/payment/cancel`,
        metadata: {
            userId,
            licenseId: product.licenseId!,
        },
    });

    // const Data = {
    //     userId,
    //     licenseId: product.licenseId!,
    //     stripeSessionId: session?.id!,
    //     amount: Number(product.productPrice) ?? 0,
    //     currency: 'usd',
    //     status: 'UNPAID',
    // }

    // console.log('data',Data)
    const paymentData = await prisma.subscription.create({
        data: {
            userId,
            licenseId: product.licenseId!,
            stripeSessionId: session?.id!,
            amount: Number(product.productPrice) ?? 0,
            currency: 'usd',
            status: 'UNPAID',
        },
    });



    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Session created successfully',
        Data: {
            paymentData,
            sessionUrl: session.url,
        },
    });
};

const deleteProduct = catchAsync(async (req, res) => {

    const isExistProduct = await prisma.product.findUnique({
        where: {
            productId: req.params.id
        }
    })

    await NotFound(isExistProduct, 'Product')

    await prisma.product.delete({
        where: {
            productId: req.params.id
        }
    })
    const result = await stripe.products.update(req.params.id, {
        active: false,
    });



    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted Product' : 'Failed to Delete Product',
    });
})

export const webhook = async (req: Request, res: Response) => {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            config.stripe.subscription_webhook_sec as string,
        );
    } catch (err: any) {
        // console.error('   Error deserializing webhook:', err.message);
        throw new AppError(
            HttpStatusCode.InternalServerError,
            'internal server error',
        );
    }
    // console.log('✅ event type: ' + event.type);

    try {
        switch (event.type) {
            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                const stripePaymentId = invoice.id as string;
                const payementData = await prisma.subscription.update({
                    where: { stripeSessionId: invoice.id },
                    data: {
                        stripePaymentId: invoice.id as string,
                        status: 'PAID',
                    },
                });
                sendResponse(res, {
                    statusCode: 200,
                    success: true,
                    message: 'Payment  created successfully',
                });
                console.log(`✅ Payment confirmed for session: ${invoice.id}`);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }


    } catch (error) {
        console.error('Error processing webhook event:', error);
    }
};

export const SubscriptionController = {
    createProduct,
    updateProduct,
    createSession,
    webhook,
    deleteProduct,
    allProducts
}