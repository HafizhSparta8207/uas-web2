# LapakBuku - Marketplace Jual Beli Buku

LapakBuku adalah platform marketplace modern untuk jual beli buku baru dan bekas. Proyek ini dibangun sebagai bagian dari UAS Pemrograman Web 2.

## Fitur Utama

* **Sistem Akun (Multi-role)**: Admin, Penjual (Seller), Pembeli (Buyer) menggunakan NextAuth.js.
* **Katalog Buku**: Pencarian, filter kategori, dan filter kondisi buku (Baru/Bekas).
* **Keranjang Belanja & Checkout**: Simulasi alur checkout dari keranjang hingga pesanan dibuat.
* **Dashboard Role-based**: 
  * Dashboard Penjual untuk manajemen pesanan dan buku.
  * Dashboard Pembeli untuk riwayat pesanan.
  * Dashboard Admin untuk ringkasan data.
* **UI/UX Modern**: Animasi hover pada buku (efek spine buku), desain premium dengan Tailwind CSS v4.

## Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4, Lucide React (Icons), Google Fonts (Fraunces, Work Sans, IBM Plex Mono)
* **Database**: MySQL 8
* **ORM**: Prisma (v6)
* **Autentikasi**: NextAuth.js (Credentials) dengan bcrypt
* **Validasi**: Zod

## Cara Menjalankan Secara Lokal

1. **Persiapan Database**
   Pastikan Anda memiliki MySQL berjalan (misalnya melalui XAMPP).
   Database `lapakbuku` akan digunakan secara default.

2. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   File `.env` sudah disiapkan dengan koneksi ke database lokal:
   ```
   DATABASE_URL="mysql://root:@localhost:3306/lapakbuku"
   NEXTAUTH_SECRET="rahasia-nextauth-lapakbuku-uas"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Migrasi Database & Seeding**
   ```bash
   npx prisma migrate dev --name init
   npx tsx prisma/seed.ts
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Akses di `http://localhost:3000`

## Akun Demo

Anda dapat masuk dengan akun-akun berikut (password untuk semua akun: `password123`):

* **Admin**: `admin@lapakbuku.com`
* **Penjual**: `seller@lapakbuku.com`
* **Pembeli**: `buyer@lapakbuku.com`
