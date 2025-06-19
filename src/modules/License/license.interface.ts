type LicenseType =
  | "AIRPLANE"
  | "HELICOPTER"
  | "GAS_BALLOON"
  | "HOT_AIR_BALLOON"
  | "GLIDER";

export interface ILicense{
    name:string,
    type:LicenseType,
    description:string,
    price:number,
    // topics?:string[]
}