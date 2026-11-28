interface FooterProps {
  totalBooks?: number;
}

const EXPLORE_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Statistik Koleksi', href: '#statistik' },
  { label: 'Katalog Buku', href: '#katalog' },
  { label: 'Tentang LitSpace', href: '#tentang' },
] as const;

const FEATURED_CATEGORIES = [
  'Fiksi & Sastra',
  'Teknologi & Pemrograman',
  'Pengembangan Diri',
  'Sains & Sejarah',
  'Desain Antarmuka',
] as const;

export default function Footer({ totalBooks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ls-footer" id="tentang">
      <div className="ls-container ls-footer__main">
        {/* Column 1: Brand & Overview */}
        <div className="ls-footer__brand">
          <div className="ls-footer__brand-head">
            <span className="ls-brand__logo" aria-hidden="true">
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
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </span>
            <span className="ls-footer__brand-name">
              Lit<span>Space</span>
            </span>
          </div>

          <p className="ls-footer__desc">
            LitSpace adalah aplikasi katalog buku digital pribadi untuk mengorganisasi daftar bacaan,
            memantau progres halaman, dan merangkum statistik koleksi buku secara terstruktur.
          </p>

          <div className="ls-footer__tags">
            <span className="ls-footer__tag">Katalog Buku</span>
            <span className="ls-footer__tag">Pelacak Bacaan</span>
            <span className="ls-footer__tag">Akses Terbuka</span>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h2 className="ls-footer__heading">Navigasi</h2>
          <ul className="ls-footer__list">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="ls-footer__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h2 className="ls-footer__heading">Kategori Koleksi</h2>
          <ul className="ls-footer__list">
            {FEATURED_CATEGORIES.map((category) => (
              <li key={category}>
                <a href="#katalog" className="ls-footer__link">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Developer Identity */}
        <div>
          <h2 className="ls-footer__heading">Identitas Pengembang</h2>
          <div className="ls-footer__identity-card">
            <div className="ls-footer__identity-head">
              <span className="ls-footer__identity-avatar" aria-hidden="true">
                SH
              </span>
              <div>
                <p className="ls-footer__identity-name">Salman Hadi Al Ghifari</p>
                <p className="ls-footer__identity-role">NIM 1247050065</p>
              </div>
            </div>

            <div className="ls-footer__identity-details">
              <div className="ls-footer__identity-row">
                <span>Nama</span>
                <strong>Salman Hadi Al Ghifari</strong>
              </div>
              {typeof totalBooks === 'number' && (
                <div className="ls-footer__identity-row">
                  <span>Koleksi Katalog</span>
                  <strong>{totalBooks} Judul Buku</strong>
                </div>
              )}
              <div className="ls-footer__identity-row">
                <span>Kontak</span>
                <div className="ls-footer__identity-links">
                  <a href="mailto:salmanhadialghifari3@gmail.com">Email</a>
                  <span aria-hidden="true">|</span>
                  <a
                    href="https://github.com/hadiial"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ls-footer__bottom">
        <div className="ls-container ls-footer__bottom-inner">
          <span>
            &copy; {currentYear} <strong>LitSpace</strong>. Dibuat oleh{' '}
            <strong>Salman Hadi Al Ghifari</strong> (<strong>1247050065</strong>).
          </span>
        </div>
      </div>
    </footer>
  );
}
