"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["BUYER", "SELLER"]),
});

export async function registerUser(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Validasi gagal",
        details: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, role } = validatedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // If seller, create empty seller profile automatically (optional)
    if (role === "SELLER") {
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          storeName: `Toko ${name}`,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan pada server" };
  }
}
