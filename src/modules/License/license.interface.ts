enum LicenseType {
  AIRPLANE = "AIRPLANE",
  HELICOPTER = "HELICOPTER",
  GAS_BALLOON = "GAS_BALLOON",
  HOT_AIR_BALLOON = "HOT_AIR_BALLOON",
  GLIDER = "GLIDER"
}

export interface ILicense{
    name:string,
    type:LicenseType,
    description:string,
    price:number,
    topics?:string[]
}