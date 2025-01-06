// import {getenv }from "../../core/env.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL//getenv("DATABASE_URL"),
    },
  },
});

export async function read_merchant_by_email(email) {
  try {
    const merchant = await prisma.merchant.findFirst({
      where: {
        email
      }
    })

    if (!merchant) return false

    return merchant
  }

  catch (err) {
    console.log("Error while trying to read merchant by email: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function write_merchant(data) {
  try {
    const merchant = await prisma.merchant.create({
      data
    })

    if (!merchant) return false

    return merchant
  }

  catch (err) {
    console.log("Error while trying to create merchant: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function read_merchant() {
  try {
    const merchant = await prisma.merchant.findMany({
    })

    if (!merchant) return false

    return merchant
  }

  catch (err) {
    console.log("Error while trying to read merchant: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function read_merchant_by_id(merchant_id) {
  try {
    const merchant = await prisma.merchant.findFirst({
      where: {
        merchant_id
      }
    })

    if (!merchant) return false

    return merchant
  }

  catch (err) {
    console.log("Error while trying to read merchant by id: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}


export async function update_merchant(merchant_id, data, prisma) {
  try {
    let merchant = await prisma.merchant.update({
      where: {
        merchant_id
      },
      data
    })
    if (!merchant) return false

    return merchant
  }

  catch (err) {
    console.log("Error while trying to update_merchant: " + err)
    return false
  } finally {
  }
}