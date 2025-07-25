import { Suppliers } from "@prisma/client";
import { isShopExist, NotFound } from "../../utils/utility";
import { prisma } from "../../prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";

const createSupplier = async (payload:Suppliers & {userId:string}) => {
    const {shopId,userId,CompanyName,city,country,address,prevdueMoney,zipCode,email,bankAccount,domain,file,name,phone}=payload;
     if(!shopId
        || !userId
        || !CompanyName
        || !city
        || !country
        || !address
        || !prevdueMoney
        || !zipCode
        || !email
        || !bankAccount
        || !domain
        || !file
        || !name
        || !phone
    ){
        throw new Error("required field is missing");
    }
    const isExistShop=await isShopExist(userId);
    await NotFound(isExistShop, "Shop");

    const result=await prisma.suppliers.create({
        data: { 
            shopId,
            phone,
            prevdueMoney,
            zipCode,
            CompanyName,
            city,
            country,
            address,
            email,
            bankAccount,
            domain,
            file,
            name
        }
    });
    return result;
}


//update supplier
const updateSupplier = async (payload:Partial<Suppliers> & {userId:string}) => {
    const {id,shopId,userId,CompanyName,city,country,address,prevdueMoney,zipCode,email,bankAccount,domain,file,name,phone}=payload;
    if (!id) throw new Error("Supplier ID is required for update");
    const isExistShop=await isShopExist(userId);
    await NotFound(isExistShop, "Shop");

    const result=await prisma.suppliers.update({
        where: { id,shopId: isExistShop?.id },
        data: { 
            shopId,
            phone,
            prevdueMoney,
            zipCode,
            CompanyName,
            city,
            country,
            address,
            email,
            bankAccount,
            domain,
            file,
            name
        }
    });
    return result;
}

//delete supplier
const deleteSupplier = async (id: string, userId: string) => {
    if (!id) throw new Error("Supplier ID is required for deletion");
    const isExistShop = await isShopExist(userId);
    await NotFound(isExistShop, "Shop");

    const result = await prisma.suppliers.delete({
        where: { id ,shopId: isExistShop?.id }
    });
    return result;
}

//get all suppliers
const getAllSuppliers = async (userId: string,query:any) => {
    const isExistShop = await isShopExist(userId);
    await NotFound(isExistShop, "Shop");
    const builder=new QueryBuilder(query,prisma.suppliers);
    const result=await builder
        .search(["CompanyName","city","country","address","email","bankAccount","domain","name","phone"])
        .filter(["CompanyName","city","country","address","email","bankAccount","domain","name","phone"])
        .rawFilter({
            shopId: isExistShop?.id
        })
        .sort(["-createdAt"])
        .paginate()
        .execute();


        const meta=await builder.countTotal();
        return {
            meta: {
                total: meta,
                page: query.page || 1,
                limit: query.limit || 10
            },
             data: result
        }

   
}

//get supplier by id
const getSupplierById = async (id: string, userId: string) => {
    if (!id) throw new Error("Supplier ID is required for retrieval");
    const isExistShop = await isShopExist(userId);
    await NotFound(isExistShop, "Shop");

    const result = await prisma.suppliers.findFirst({
        where: { id, shopId: isExistShop?.id }
    });
    await NotFound(result, "Supplier");
    return result;
}

export const suppliersService = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getAllSuppliers,
    getSupplierById
};