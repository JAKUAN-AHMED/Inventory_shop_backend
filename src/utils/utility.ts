
import AppError from "../errors/AppError"
import { ExplanationType } from "../modules/Questions/question.service";
import { prisma } from "../prisma/client"



export  async function isExistByEmail(email:string){
    const existingUser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    return existingUser;
}

export async function alreadyExist(param:any,msg?:string){
   if(param)
   {
    throw new AppError(409,`${msg}`)
   }
}

export async function isExistUserById(id:string) {
    return await prisma.user.findUnique({
        where:{
            id
        }
    })
}


export async function NotFound (value:any,msg?:string){
    if(!value){
        throw new AppError(404,`${msg} Not Found`)
    }
}


type optionsType = {
    label: "A" | "B" | "C" | "D",
    value: string
}


export function isValidOptions(options: any): options is optionsType[] {
  if (!Array.isArray(options)) return false;

  return options.every(opt => 
    typeof opt === "object" &&
    opt !== null &&
    (opt.label === "A" || opt.label === "B" || opt.label === "C" || opt.label === "D") &&
    typeof opt.value === "string"
  );
}


export function isExplanation(obj: unknown): obj is ExplanationType {
  return (
    typeof obj === "object" &&
    obj !== null &&
    !Array.isArray(obj) &&
    typeof (obj as any).text === "string" &&
    typeof (obj as any).img === "string"
  );
}