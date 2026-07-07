import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lapakbuku.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@lapakbuku.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create Seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@lapakbuku.com' },
    update: {},
    create: {
      name: 'Budi Penjual',
      email: 'seller@lapakbuku.com',
      password: hashedPassword,
      role: 'SELLER',
      sellerProfile: {
        create: {
          storeName: 'Toko Buku Budi',
          storeDescription: 'Menjual buku baru dan bekas berkualitas',
        }
      },
      addresses: {
        create: {
          recipientName: 'Budi',
          phone: '08123456789',
          province: 'Jawa Barat',
          city: 'Bandung',
          postalCode: '40132',
          fullAddress: 'Jl. Dago No. 123',
          isDefault: true,
        }
      }
    },
  });

  // 3. Create Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@lapakbuku.com' },
    update: {},
    create: {
      name: 'Andi Pembeli',
      email: 'buyer@lapakbuku.com',
      password: hashedPassword,
      role: 'BUYER',
      addresses: {
        create: {
          recipientName: 'Andi',
          phone: '08987654321',
          province: 'DKI Jakarta',
          city: 'Jakarta Selatan',
          postalCode: '12810',
          fullAddress: 'Jl. Tebet Barat No. 45',
          isDefault: true,
        }
      }
    },
  });

  // 4. Create Categories
  const categoriesData = [
    { name: 'Fiksi', slug: 'fiksi' },
    { name: 'Non Fiksi', slug: 'non-fiksi' },
    { name: 'Edukasi', slug: 'edukasi' },
    { name: 'Pengembangan Diri', slug: 'pengembangan-diri' },
    { name: 'Bisnis & Ekonomi', slug: 'bisnis' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 5. Create Books
  const fiksi = await prisma.category.findUnique({ where: { slug: 'fiksi' } });
  const pengembanganDiri = await prisma.category.findUnique({ where: { slug: 'pengembangan-diri' } });

  if (fiksi && pengembanganDiri) {
    const book1 = await prisma.book.create({
      data: {
        title: 'Bumi Manusia',
        author: 'Pramoedya Ananta Toer',
        isbn: '9789799731234',
        description: 'Buku pertama dari Tetralogi Buru. Menceritakan kisah Minke, anak pribumi yang bersekolah di HBS.',
        price: 95000,
        stock: 15,
        conditionStatus: 'NEW',
        sellerId: seller.id,
        categoryId: fiksi.id,
        coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
      }
    });

    const book2 = await prisma.book.create({
      data: {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9786020633176',
        description: 'Cara Mudah dan Terbukti untuk Membentuk Kebiasaan Baik dan Menghilangkan Kebiasaan Buruk.',
        price: 108000,
        stock: 50,
        conditionStatus: 'NEW',
        sellerId: seller.id,
        categoryId: pengembanganDiri.id,
        coverImageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop',
      }
    });

    const book3 = await prisma.book.create({
      data: {
        title: 'Laut Bercerita',
        author: 'Leila S. Chudori',
        isbn: '9786024246945',
        description: 'Novel tentang hilangnya para aktivis tahun 1998 (preloved).',
        price: 65000,
        stock: 1,
        conditionStatus: 'USED',
        sellerId: seller.id,
        categoryId: fiksi.id,
        coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop',
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
