# LitSpace — Katalog & Manajemen Koleksi Buku Digital

**LitSpace** adalah aplikasi web katalog buku digital dan pelacak progres membaca yang dibangun menggunakan **React**, **Vite**, dan **TypeScript**. Aplikasi ini mengusung tema terang dengan aksen indigo (`#4F46E5`) dan footer gelap terstruktur untuk memudahkan pengelolaan koleksi buku secara langsung di browser tanpa halaman login/register.

---

## Identitas Pengembang

| Informasi | Detail |
| :--- | :--- |
| **Nama** | Salman Hadi Al Ghifari |
| **NIM** | 1247050065 |
| **Mata Kuliah** | Pengembangan Aplikasi Web |
| **Stack Teknologi** | React 19, TypeScript, Vite, CSS Custom Properties |

---

## Daftar Fitur Utama

- **Statistik Koleksi & Progres Membaca Real-Time (`StatsBanner`)**: Menampilkan persentase halaman terbaca, total koleksi, jumlah buku sedang dibaca, selesai dibaca, rata-rata rating, antrean ingin dibaca, dan jumlah favorit secara dinamis.
- **Katalog Buku Interaktif (`BookCard`)**: Menampilkan sampul gambar atau placeholder gradien rapi, judul, penulis, kategori, format buku (`Cetak`, `E-Book`, `Audiobook`), rating, status baca, progress bar halaman, serta tombol **Ubah Status**, **Favorit**, **Lihat Detail**, dan **Hapus**.
- **Panel Filter Katalog (`FilterSidebar`)**:
  - Filter berdasarkan **Kategori**, **Status Baca**, dan **Format Buku** beserta jumlah buku pada setiap opsi.
  - Pembatasan 3 opsi default pada Kategori & Status Baca dengan tombol independen **Tampilkan Semua / Tampilkan Lebih Sedikit** (opsi aktif tetap terlihat saat diperkecil).
  - Panel filter *scrollable* vertikal dengan *sticky header* dan tombol **Reset Filter**.
  - Mendukung tombol **Tampilkan / Sembunyikan Filter** pada layar tablet dan mobile (`<= 1024px`).
- **Pencarian & Pengurutan**: Pencarian real-time berdasarkan judul atau nama penulis serta pengurutan (*Terbaru Ditambahkan*, *Judul A–Z*, *Judul Z–A*, *Rating Tertinggi*, dan *Tahun Terbit Terbaru*).
- **Tambah Buku Baru (`AddBookModal`)**: Form terkontrol dengan validasi dasar untuk judul, penulis, tahun terbit, jumlah halaman, rating (`0–5`), URL sampul opsional, pilihan warna placeholder, dan sinopsis.
- **Modal Detail & Sinopsis (`BookDetailModal`)**: Menampilkan sinopsis lengkap, progres membaca, penerbit, tahun terbit, ISBN, serta aksi cepat ubah status, favorit, dan hapus buku.
- **Penyimpanan Persisten (`localStorage`) & Reset Data Awal**: Seluruh perubahan koleksi tersimpan otomatis pada `localStorage` dengan key `"litspace_books_v1"`, disertai tombol **Reset Data Awal** untuk mengembalikan data bawaan.
- **Desain Responsif**: Tata letak adaptif untuk desktop, tablet, dan mobile (termasuk menu navigasi mobile, identitas mahasiswa yang selalu tampil jelas di navbar & footer, serta toggle sidebar filter).

---

## Penjelasan Singkat Komponen React

Aplikasi disusun secara modular di dalam `src/components/` dengan pemisahan tanggung jawab yang jelas:

### 1. `App.tsx` (Root State & Orchestrator)
- **State (`useState`)**: Mengelola `books` (dimuat dari `localStorage` key `"litspace_books_v1"`), `searchQuery`, `sortBy`, `selectedCategory`, `selectedStatus`, `selectedFormat`, `selectedBookId`, `isAddModalOpen`, dan `isMobileSidebarOpen`.
- **Effect (`useEffect`)**: Menyinkronkan perubahan state `books` ke `localStorage` secara otomatis.
- **List & Conditional Rendering**: Merender daftar `BookCard` menggunakan `.map()` dengan `key={book.id}`, menampilkan bar filter aktif, *empty state* saat hasil kosong, serta membuka `AddBookModal` dan `BookDetailModal` secara kondisional.

### 2. `Navbar.tsx`
- **Props**: Menerima `totalBooks?: number` untuk info katalog.
- **State**: `mobileMenuOpen` untuk membuka/menutup menu navigasi di layar mobile.
- **Event Handling**: `onClick` pada tombol hamburger dan tautan navigasi mobile. Menampilkan identitas **Salman Hadi Al Ghifari (NIM 1247050065)**.

### 3. `StatsBanner.tsx`
- **Props**: Menerima `books: readonly Book[]` lalu menghitung metrik koleksi melalui helper `calculateBookStats(books)`.

### 4. `FilterSidebar.tsx`
- **Props**: Menerima nilai filter aktif (`selectedCategory`, `selectedStatus`, `selectedFormat`), jumlah item (`categoryCounts`, `statusCounts`, `formatCounts`), status toggle mobile (`isMobileOpen`), serta callback (`onCategoryChange`, `onStatusChange`, `onFormatChange`, `onResetFilters`, `onCloseMobile`).
- **State**: `isCategoryExpanded` dan `isStatusExpanded` untuk memperluas/memperkecil daftar opsi secara independen melalui subkomponen reusable `CollapsibleFilterGroup`.
- **Event Handling**: `onClick` pada tiap opsi filter, tombol expand/collapse, tombol reset filter, dan tombol tutup sidebar mobile.

### 5. `BookCard.tsx`
- **Props**: Menerima objek `book` dan callback aksi (`onToggleStatus`, `onToggleFavorite`, `onDelete`, `onViewDetail`).
- **Event Handling**: `onClick` pada tombol toggle status baca, tombol favorit (ikon hati), tombol lihat detail, dan tombol hapus.

### 6. `AddBookModal.tsx`
- **Props**: Menerima `isOpen`, `onClose`, dan `onAddBook`.
- **State**: `values` (nilai seluruh input form) dan `errors` (pesan validasi per field).
- **Event Handling**: `onChange` untuk *controlled inputs* (menghapus pesan error saat diperbaiki), `onClick` untuk pemilih warna sampul, `onSubmit` untuk validasi & pengiriman data buku baru, serta listener `keydown` (`Escape`) untuk menutup modal.

### 7. `BookDetailModal.tsx`
- **Props**: Menerima `book: Book | null`, `onClose`, `onToggleStatus`, `onToggleFavorite`, dan `onDelete`.
- **Event Handling**: `onClick` pada backdrop, tombol tutup, dan tombol aksi cepat di dalam modal, serta listener `keydown` (`Escape`).

### 8. `Footer.tsx`
- **Props**: Menerima `totalBooks?: number`. Menampilkan navigasi, kategori koleksi, serta kartu identitas pengembang **Salman Hadi Al Ghifari (1247050065)** beserta tautan kontak.

---

## Cara Menjalankan Proyek

```bash
# 1. Instal dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Pemeriksaan ESLint
npm run lint

# 4. Build produksi (termasuk pemeriksaan TypeScript tsc -b)
npm run build
```
