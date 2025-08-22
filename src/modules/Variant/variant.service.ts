import { Pvariant } from '@prisma/client';
import { prisma } from '../../prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
import { isShopExistByShopId, NotFound } from '../../utils/utility';

const createVariant = async (payload: Pvariant & { variant: string[] }) => {
  const { type, shopId, description, variant } = payload;

  // 1. Check if shop exists
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, "Shop");

  // 2. Check if pvariant already exists
  const isExistVariant = await prisma.pvariant.findFirst({
    where: { type: type.toUpperCase(), shopId: isExistShop?.id as string },
  });
  if (isExistVariant) {
    throw new Error("Variant already exists for this shop");
  }

  // 3. Create parent pvariant
  const pvariant = await prisma.pvariant.create({
    data: {
      type: type.toUpperCase(),
      shopId: isExistShop?.id as string,
      description,
    },
  });

  // 4. Create child variant
  const createdVariant = await prisma.variant.create({
    data: {
      pvariantId: pvariant.id,
      variant: variant.map(v => v.toUpperCase()), // already string[]
    },
  });

  // 5. Return merged result
  return {
    ...pvariant,
    variant: createdVariant.variant,
  };
};

const updateVariant = async (
  id: string,
  payload: Partial<Pvariant> & { variant?: string[] }
) => {
  // 1. Validate shop exists
  const isExistShop = await isShopExistByShopId(payload?.shopId as string);
  await NotFound(isExistShop, "Shop");

  // 2. Update pvariant basic info
  const updatedPvariant = await prisma.pvariant.update({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
    data: {
      type: payload.type?.toUpperCase(),
      description: payload.description,
    },
  });

  // 3. Update child variant if provided
  let updatedVariants: string[] | undefined = undefined;
  if (payload.variant) {
    const uppercased = payload.variant.map(v => v.toUpperCase());
    await prisma.variant.updateMany({
      where: { pvariantId: id },
      data: { variant: uppercased },
    });
    updatedVariants = uppercased;
  }

  // 4. Return merged result with corrected casing
  return {
    ...updatedPvariant,
    variant: updatedVariants,
  };
};


const deleteVariant = async (id: string, shopId: string) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, "Shop");

  // delete all child variants first
  await prisma.variant.deleteMany({
    where: { pvariantId: id },
  });

  // then delete parent pvariant
  return await prisma.pvariant.delete({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
  });
};

const singleVariant = async (id: string, shopId: string) => {
  const isExistShop = await isShopExistByShopId(shopId as string);
  await NotFound(isExistShop, 'Shop');
  return await prisma.pvariant.findUnique({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
    include: { variant: true },
  });
};

const allVariant = async (query: any, shopId: string) => {
  const isExistShop = await isShopExistByShopId(shopId as string);
  await NotFound(isExistShop, 'Shop');
  const builder = new QueryBuilder(query, prisma.pvariant);
  const result = await builder
  .include({ variant: true })
  .rawFilter({ shopId: isExistShop?.id as string })
  .paginate().execute();

  const meta = await builder.countTotal();

  return {
    meta,
    result,
  };
};

export const VariantService = {
  createVariant,
  updateVariant,
  deleteVariant,
  allVariant,
  singleVariant,
};
