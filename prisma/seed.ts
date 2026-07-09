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
    { name: 'Komik & Manga', slug: 'komik-manga' },
    { name: 'Anak & Remaja', slug: 'anak-remaja' },
    { name: 'Agama', slug: 'agama' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const getCatId = async (slug: string, fallback: number) => {
    const cat = await prisma.category.findUnique({ where: { slug } });
    return cat ? cat.id : fallback;
  };

  const fiksiId = await getCatId('fiksi', 1);
  const nonFiksiId = await getCatId('non-fiksi', 2);
  const edukasiId = await getCatId('edukasi', 3);
  const pengembanganDiriId = await getCatId('pengembangan-diri', 4);
  const bisnisId = await getCatId('bisnis', 5);
  const komikId = await getCatId('komik-manga', 6);
  const agamaId = await getCatId('agama', 8);

  // Helper mapping
  const categoryMap: any = {
    "Fiksi": fiksiId,
    "Non Fiksi": nonFiksiId,
    "Edukasi": edukasiId,
    "Pengembangan Diri": pengembanganDiriId,
    "Bisnis & Ekonomi": bisnisId,
    "Komik & Manga": komikId,
    "Agama": agamaId,
  };

  // Clear existing books to prevent duplicates
  await prisma.book.deleteMany();

  // 5. Books Data
  const rawBooks = [
    { title: "Laut Bercerita", author: "Leila S. Chudori", category: "Fiksi", price: 65000, stock: 10, condition: "Bekas", isbn: "9786024246938", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Novel yang mengangkat tema penculikan aktivis pada tahun 1998.", origin: "Indonesia" },
    { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Fiksi", price: 95000, stock: 5, condition: "Baru", isbn: "9789799731234", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah perjuangan Minke di masa kolonial Belanda.", origin: "Indonesia" },
    { title: "Gadis Kretek", author: "Ratih Kumala", category: "Fiksi", price: 78000, stock: 12, condition: "Baru", isbn: "9789792281415", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah cinta dan sejarah industri kretek di Indonesia.", origin: "Indonesia" },
    { title: "Cantik Itu Luka", author: "Eka Kurniawan", category: "Fiksi", price: 110000, stock: 4, condition: "Baru", isbn: "9789792283518", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Novel realisme magis peraih penghargaan internasional.", origin: "Indonesia" },
    { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Fiksi", price: 69000, stock: 15, condition: "Bekas", isbn: "9789793062792", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah perjuangan 10 anak Belitung menempuh pendidikan.", origin: "Indonesia" },
    { title: "Ronggeng Dukuh Paruk", author: "Ahmad Tohari", category: "Fiksi", price: 85000, stock: 3, condition: "Bekas", isbn: "9789792277289", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Trilogi novel tentang kehidupan penari ronggeng di desa terpencil.", origin: "Indonesia" },
    { title: "Filosofi Kopi", author: "Dee Lestari", category: "Fiksi", price: 55000, stock: 8, condition: "Baru", isbn: "9789799625724", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kumpulan cerita pendek tentang pencarian jiwa dan kopi terbaik.", origin: "Indonesia" },
    { title: "Dilan 1990", author: "Pidi Baiq", category: "Fiksi", price: 59000, stock: 20, condition: "Baru", isbn: "9786027870413", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah cinta romantis remaja Bandung era 90-an.", origin: "Indonesia" },
    { title: "Negeri 5 Menara", author: "Ahmad Fuadi", category: "Edukasi", price: 75000, stock: 6, condition: "Baru", isbn: "9789792248456", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kehidupan para santri pesantren dalam mengejar impian global.", origin: "Indonesia" },
    { title: "Pulang", author: "Leila S. Chudori", category: "Fiksi", price: 82000, stock: 7, condition: "Baru", isbn: "9789799105158", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah eksil politik Indonesia di Paris tahun 1965.", origin: "Indonesia" },
    { title: "Perahu Kertas", author: "Dee Lestari", category: "Fiksi", price: 79000, stock: 11, condition: "Baru", isbn: "9789791227780", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah cinta antara dua insan yang memiliki radar mimpi yang sama.", origin: "Indonesia" },
    { title: "Hujan", author: "Tere Liye", category: "Fiksi", price: 88000, stock: 14, condition: "Baru", isbn: "9786020324784", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Novel fiksi ilmiah tentang persahabatan, cinta, dan perpisahan dunia masa depan.", origin: "Indonesia" },
    { title: "Amba", author: "Laksmi Pamuntjak", category: "Fiksi", price: 90000, stock: 5, condition: "Bekas", isbn: "9789792288124", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah cinta berlatar belakang sejarah Buru.", origin: "Indonesia" },
    { title: "Saman", author: "Ayu Utami", category: "Fiksi", price: 60000, stock: 4, condition: "Bekas", isbn: "9789799023179", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Novel pemenang sayembara DKJ yang mendobrak tabu sastra.", origin: "Indonesia" },
    { title: "Aroma Karsa", author: "Dee Lestari", category: "Fiksi", price: 125000, stock: 9, condition: "Baru", isbn: "9786026716209", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Eksplorasi mendalam dunia wewangian dan mitologi kuno.", origin: "Indonesia" },
    
    { title: "Roll Over and Die", author: "kiki", category: "Fiksi", price: 85000, stock: 5, condition: "Baru", isbn: "9784865545227", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah fantasi gelap tentang perjuangan merebut kebebasan.", origin: "Jepang" },
    { title: "Flower and Asura", author: "Akane Torikai", category: "Fiksi", price: 75000, stock: 4, condition: "Baru", isbn: "9784309291111", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Manga drama psikologis mendalam tentang hubungan manusia.", origin: "Jepang" },
    { title: "The Dangers in My Heart", author: "Norio Sakurai", category: "Fiksi", price: 60000, stock: 12, condition: "Baru", isbn: "9784253249111", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Manga komedi romantis sekolahan yang menggemaskan.", origin: "Jepang" },
    { title: "Norwegian Wood", author: "Haruki Murakami", category: "Fiksi", price: 99000, stock: 8, condition: "Baru", isbn: "9780375704024", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah nostalgia kedewasaan, kehilangan, dan seksualitas.", origin: "Jepang" },
    { title: "Kafka on the Shore", author: "Haruki Murakami", category: "Fiksi", price: 115000, stock: 6, condition: "Baru", isbn: "9781400079278", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Perjalanan magis seorang pemuda berumur 15 tahun melarikan diri dari rumah.", origin: "Jepang" },
    { title: "No Longer Human", author: "Osamu Dazai", category: "Fiksi", price: 55000, stock: 10, condition: "Baru", isbn: "9780811204811", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Mahakarya sastra klasik Jepang tentang keterasingan sosial.", origin: "Jepang" },
    { title: "Demon Slayer Vol. 1", author: "Koyoharu Gotouge", category: "Fiksi", price: 45000, stock: 25, condition: "Baru", isbn: "9781974700523", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Manga aksi petualangan Tanjiro menyelamatkan adiknya.", origin: "Jepang" },
    { title: "Jujutsu Kaisen Vol. 1", author: "Gege Akutami", category: "Fiksi", price: 45000, stock: 18, condition: "Baru", isbn: "9781974710027", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah pertempuran kutukan penyihir jujutsu.", origin: "Jepang" },
    { title: "Attack on Titan Vol. 1", author: "Hajime Isayama", category: "Fiksi", price: 45000, stock: 15, condition: "Bekas", isbn: "9781612620244", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Perjuangan umat manusia melawan raksasa misterius.", origin: "Jepang" },
    { title: "Your Name", author: "Makoto Shinkai", category: "Fiksi", price: 80000, stock: 7, condition: "Baru", isbn: "9781975311111", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Adaptasi novel dari film animasi fenomena pertukaran tubuh.", origin: "Jepang" },
    { title: "Weathering With You", author: "Makoto Shinkai", category: "Fiksi", price: 80000, stock: 6, condition: "Baru", isbn: "9781975333333", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah cinta anak sekolahan dengan gadis pengendali cuaca.", origin: "Jepang" },
    { title: "Blue Lock Vol. 1", author: "Muneyuki Kaneshiro", category: "Fiksi", price: 45000, stock: 20, condition: "Baru", isbn: "9781646516111", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Manga olahraga sepak bola dengan sistem survival ekstrem.", origin: "Jepang" },
    { title: "Chainsaw Man Vol. 1", author: "Tatsuki Fujimoto", category: "Fiksi", price: 45000, stock: 14, condition: "Baru", isbn: "9781974709930", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kisah Denji sang pemburu iblis dengan gergaji mesin.", origin: "Jepang" },
    { title: "Spy x Family Vol. 1", author: "Tatsuya Endo", category: "Fiksi", price: 45000, stock: 22, condition: "Baru", isbn: "9781974715466", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Komedi mata-mata tentang keluarga buatan yang penuh rahasia.", origin: "Jepang" },
    { title: "The Miracles of the Namiya General Store", author: "Keigo Higashino", category: "Fiksi", price: 95000, stock: 9, condition: "Baru", isbn: "9786020383111", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Novel misteri hangat tentang kotak surat lintas waktu.", origin: "Jepang" },
    
    { title: "Atomic Habits", author: "James Clear", category: "Pengembangan Diri", price: 108000, stock: 15, condition: "Baru", isbn: "9781847941831", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Cara mudah membangun kebiasaan baik dan menghilangkan kebiasaan buruk.", origin: "Inggris" },
    { title: "Milk and Honey", author: "Rupi Kaur", category: "Fiksi", price: 85000, stock: 8, condition: "Baru", isbn: "9781449474256", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Kumpulan puisi dan prosa tentang cinta, trauma, dan penyembuhan.", origin: "Inggris" },
    { title: "How Innovation Works", author: "Matt Ridley", category: "Pengembangan Diri", price: 120000, stock: 5, condition: "Baru", isbn: "9780062916594", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Penjelasan mendalam bagaimana inovasi terjadi di dunia nyata.", origin: "Inggris" },
    { title: "The Psychology of Money", author: "Morgan Housel", category: "Bisnis & Ekonomi", price: 98000, stock: 11, condition: "Baru", isbn: "9781544514789", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Pelajaran abadi tentang kekayaan, ketamakan, dan kebahagiaan.", origin: "Inggris" },
    { title: "Start With Why", author: "Simon Sinek", category: "Bisnis & Ekonomi", price: 110000, stock: 6, condition: "Baru", isbn: "9781591846444", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Bagaimana para pemimpin hebat menginspirasi semua orang untuk bertindak.", origin: "Inggris" },
    { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", category: "Bisnis & Ekonomi", price: 88000, stock: 14, condition: "Baru", isbn: "9781612680194", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Pelajaran keuangan dasar yang tidak diajarkan di sekolah umum.", origin: "Inggris" },
    { title: "The Intelligent Investor", author: "Benjamin Graham", category: "Bisnis & Ekonomi", price: 210000, stock: 4, condition: "Baru", isbn: "9780060555665", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Buku panduan utama tentang value investing di pasar saham.", origin: "Inggris" },
    { title: "Zero to One", author: "Peter Thiel", category: "Bisnis & Ekonomi", price: 95000, stock: 7, condition: "Baru", isbn: "9780804139298", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Catatan tentang startup dan bagaimana membangun masa depan.", origin: "Inggris" },
    { title: "Sapiens", author: "Yuval Noah Harari", category: "Edukasi", price: 145000, stock: 10, condition: "Baru", isbn: "9780062316097", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Riwayat singkat umat manusia dari zaman batu hingga masa kini.", origin: "Inggris" },
    { title: "Homo Deus", author: "Yuval Noah Harari", category: "Edukasi", price: 145000, stock: 5, condition: "Bekas", isbn: "9780062464316", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Masa depan umat manusia dan agenda besar abad ke-21.", origin: "Inggris" },
    { title: "Deep Work", author: "Cal Newport", category: "Pengembangan Diri", price: 92000, stock: 8, condition: "Baru", isbn: "9781455586691", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Aturan untuk meraih sukses fokus di dunia yang penuh distraksi.", origin: "Inggris" },
    { title: "Show Your Work!", author: "Austin Kleon", category: "Pengembangan Diri", price: 68000, stock: 13, condition: "Baru", isbn: "9780761178972", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "10 cara membagikan kreativitasmu dan membuat dirimu ditemukan.", origin: "Inggris" },
    { title: "Steal Like an Artist", author: "Austin Kleon", category: "Pengembangan Diri", price: 68000, stock: 12, condition: "Baru", isbn: "9780761169253", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Panduan ilustrasi kreativitas yang menyenangkan di era digital.", origin: "Inggris" },
    { title: "The Subtle Art of Not Giving a Fck", author: "Mark Manson", category: "Pengembangan Diri", price: 85000, stock: 16, condition: "Baru", isbn: "9780062457714", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Pendekatan waras untuk menjalani kehidupan yang baik dan jujur.", origin: "Inggris" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Edukasi", price: 160000, stock: 3, condition: "Bekas", isbn: "9780374275631", imageUrl: "https://image.tmdb.org/t/p/original/ldvQnsTN8RimwT69qCpLGWawlQf.jpg", description: "Analisis mendalam dua sistem yang menggerakkan cara berpikir kita.", origin: "Inggris" }
  ];

  for (const book of rawBooks) {
    const categoryId = categoryMap[book.category] || fiksiId;
    const conditionStatus: 'NEW' | 'USED' = book.condition === 'Baru' ? 'NEW' : 'USED';
    
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        categoryId: categoryId,
        price: book.price,
        stock: book.stock,
        conditionStatus: conditionStatus,
        isbn: book.isbn,
        coverImageUrl: book.imageUrl,
        description: book.description,
        origin: book.origin,
        sellerId: seller.id,
      }
    });
  }

  console.log(`Database seeded successfully with ${rawBooks.length} books!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
