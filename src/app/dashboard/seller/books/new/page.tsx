import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddBookForm } from "./AddBookForm";

export default async function NewBookPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SELLER') {
    redirect("/");
  }

  // Fetch all categories for the select dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AddBookForm categories={categories} />
      </div>
    </div>
  );
}
