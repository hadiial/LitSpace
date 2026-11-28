import type { Book } from '../types/book';
import { calculateBookStats } from '../types/book';

interface StatsBannerProps {
  books: readonly Book[];
}

export default function StatsBanner({ books }: StatsBannerProps) {
  const stats = calculateBookStats(books);
  const pageReadPercent =
    stats.totalPages > 0 ? Math.round((stats.totalPagesRead / stats.totalPages) * 100) : 0;

  return (
    <section className="ls-stats-section" id="statistik" aria-labelledby="ls-hero-heading">
      <div className="ls-container">
        <div className="ls-hero">
          <div>
            <span className="ls-hero__eyebrow">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l1.9 5.8L20 10.7l-5 3.6 1.9 5.7L12 16.4 7.1 20 9 14.3 4 10.7l6.1-1.9L12 3z" />
              </svg>
              Ruang Katalog &amp; Pelacak Bacaan
            </span>

            <h1 className="ls-hero__title" id="ls-hero-heading">
              Kelola Koleksi Buku &amp; Progres Membaca di <span>LitSpace</span>
            </h1>

            <p className="ls-hero__desc">
              Pantau seluruh daftar buku, kategori bacaan, rating pribadi, hingga pencapaian
              halaman dalam satu ruang katalog modern yang rapi dan mudah diakses.
            </p>

            <div className="ls-hero__actions">
              <a href="#katalog" className="ls-btn ls-btn--primary">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Jelajahi Katalog
              </a>

              <a href="#tentang" className="ls-btn ls-btn--outline">
                Tentang LitSpace
              </a>
            </div>
          </div>

          <aside className="ls-progress-card" aria-label="Ringkasan progres bacaan">
            <div className="ls-progress-card__header">
              <span className="ls-progress-card__label">Progres Halaman Terbaca</span>
              <span className="ls-progress-card__pill">{stats.completionRate}% Selesai</span>
            </div>

            <div className="ls-progress-card__percent">
              <strong>{pageReadPercent}%</strong>
              <span>
                {stats.totalPagesRead.toLocaleString('id-ID')} dari{' '}
                {stats.totalPages.toLocaleString('id-ID')} halaman
              </span>
            </div>

            <div
              className="ls-progress-bar"
              role="progressbar"
              aria-valuenow={pageReadPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Persentase halaman terbaca"
            >
              <div
                className="ls-progress-bar__fill"
                style={{ width: `${pageReadPercent}%` }}
              />
            </div>

            <div className="ls-progress-card__meta">
              <div className="ls-progress-card__meta-item">
                <span>Antrean Ingin Dibaca</span>
                <strong>{stats.wantToReadBooks} Buku</strong>
              </div>
              <div className="ls-progress-card__meta-item">
                <span>Buku Favorit</span>
                <strong>{stats.favoriteBooks} Buku</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="ls-stats-grid" role="list" aria-label="Statistik koleksi buku">
          <article className="ls-stat-card" role="listitem">
            <div className="ls-stat-card__content">
              <span className="ls-stat-card__label">Total Koleksi</span>
              <strong className="ls-stat-card__value">{stats.totalBooks}</strong>
              <span className="ls-stat-card__sub">Judul tersedia di katalog</span>
            </div>
            <span className="ls-stat-card__icon ls-stat-card__icon--indigo" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </span>
          </article>

          <article className="ls-stat-card" role="listitem">
            <div className="ls-stat-card__content">
              <span className="ls-stat-card__label">Sedang Dibaca</span>
              <strong className="ls-stat-card__value">{stats.readingBooks}</strong>
              <span className="ls-stat-card__sub">Aktif dalam progres baca</span>
            </div>
            <span className="ls-stat-card__icon ls-stat-card__icon--blue" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </span>
          </article>

          <article className="ls-stat-card" role="listitem">
            <div className="ls-stat-card__content">
              <span className="ls-stat-card__label">Selesai Dibaca</span>
              <strong className="ls-stat-card__value">{stats.completedBooks}</strong>
              <span className="ls-stat-card__sub">{stats.completionRate}% koleksi tuntas</span>
            </div>
            <span className="ls-stat-card__icon ls-stat-card__icon--emerald" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
          </article>

          <article className="ls-stat-card" role="listitem">
            <div className="ls-stat-card__content">
              <span className="ls-stat-card__label">Rata-rata Rating</span>
              <strong className="ls-stat-card__value">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
              </strong>
              <span className="ls-stat-card__sub">Dari skala 5.0 bintang</span>
            </div>
            <span className="ls-stat-card__icon ls-stat-card__icon--amber" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
