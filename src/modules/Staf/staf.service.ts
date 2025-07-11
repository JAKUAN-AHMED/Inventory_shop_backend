import { Staf } from "@prisma/client"
import { prisma } from "../../prisma/client";
import bcrypt from 'bcrypt';
import { alreadyExist, isExistByEmail, NotFound } from "../../utils/utility";
import { uploadToDigitalOceanAWS } from "../../utils/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
const createStaf=async(file:any,payload:Staf)=>{
    const { name, email, password, address, phone,shopId } = payload;
    
      //check user is already exist or not
      const existingUser = await isExistByEmail(payload.email);
      await alreadyExist(existingUser, 'Already Exist This Email');
    
      let imageUrls: string = '';
      if (file) {
        //  imageUrls = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
        const { location } = await uploadToDigitalOceanAWS(file);
        imageUrls = location as string;
      }
      // Hash the password
      const hashedpassword = await bcrypt.hash(password, 10);
    
      // Explicitly set the role to a valid value (e.g., "STAF")
      const result = await prisma.staf.create({
        data: {
          name,
          email,
          phone,
          address,
          password: hashedpassword,
          role: 'STAF',
          shopId,
          profileImage: imageUrls ? imageUrls : 'https://ibb.co/q36v3f9w',
        },
      });
    
      return result;
}



//all staf
const allStaf=async(query:any,userId:string)=>{
  const shop=await prisma.shop.findUnique({
    where:{
      userId
    }
  })

  await NotFound(shop);
  const builder=new QueryBuilder(query,prisma.staf);
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

//single staf
const singleStaf=async(id:string)=>{
  return  await prisma.staf.findUnique({
    where:{
      id
    }
  })
}

//delete a staf
const deleteStaf=async(id:string)=>{
  return await prisma.staf.delete({
    where:{
      id
    }
  })
}
export const StafService={
    createStaf,
    allStaf,
    singleStaf,
    deleteStaf
}