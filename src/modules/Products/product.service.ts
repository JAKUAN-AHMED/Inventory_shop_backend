import { Product} from "@prisma/client"
import { prisma } from "../../prisma/client";
import { isExistUserById, isShopExist, isShopExistByShopId, NotFound } from "../../utils/utility";
import { deleteFromDigitalOceanAWS, uploadToDigitalOceanAWS } from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
const createProduct=async(file:any,payload:Product)=>{
    const { title, img, price, description,shopId } = payload;
      

    //check shop exist or not

    const isExistShop=await isShopExistByShopId(shopId);
    await NotFound(isExistShop,'Shop');

    //check the product already exist or not
    const isExistProduct=await prisma.product.findFirst({
      where:{
        shopId
      }
    })

    if(isExistProduct) {
      throw new AppError(409,'Already Exist Prodouct');
    }


    
      let imageUrls: string = '';
      if (file) {
        //  imageUrls = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
        const { location } = await uploadToDigitalOceanAWS(file);
        imageUrls = location as string;
      }
      
  
      const result = await prisma.product.create({
        data: {
          title,
          price,
          description,
          img,
          shopId,
        },
      });
    
      return result;
}



//all product
const allProducts=async(query:any,userId:string)=>{
  const shop=await isShopExist(userId)
  await NotFound(shop,'Shop');
  const builder=new QueryBuilder(query,prisma.product);
  const result=await builder
  .rawFilter({
    "shopId":shop?.id as string
  })
  .paginate()
  .execute();
  const meta=await builder.countTotal();

  return {
    meta,
    result
  }
}

//single product
const singleProduct=async(id:string)=>{
  return  await prisma.product.findUnique({
    where:{
      id
    }
  })
}

//delete a product
const deleteProduct=async(id:string)=>{

  const product=await prisma.product.findUnique({
    where:{
      id
    }
  })

  await deleteFromDigitalOceanAWS(product?.img as string);

  return await prisma.product.delete({
    where:{
      id
    }
  })
}


//update product
const updateProduct=async(id:string,payload:Partial<Product>)=>{
    
    const isExistProduct=await prisma.product.findUnique({
      where:{
        id
      }
    })
    await NotFound(isExistProduct,'Product');
    return await prisma.product.update({
        where:{
            id: isExistProduct?.id as string
        },
        data:{
            ...payload
        }
    })
}



export const productService={
    createProduct,
    allProducts,
    singleProduct,
    deleteProduct,
    updateProduct
}