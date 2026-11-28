import { useState } from 'react';

interface NavbarProps {
  totalBooks?: number;
}

const NAV_ITEMS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Statistik', href: '#statistik' },
  { label: 'Katalog Buku', href: '#katalog' },
  { label: 'Tentang', href: '#tentang' },
] as const;

export default function Navbar({ totalBooks }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="ls-navbar" id="beranda">
      <div className="ls-container ls-navbar__inner">
        <a href="#beranda" className="ls-brand" aria-label="Beranda LitSpace">
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
          <span className="ls-brand__text">
            <span className="ls-brand__name">
              Lit<span>Space</span>
            </span>
            <span className="ls-brand__tagline">
              {typeof totalBooks === 'number'
                ? `Katalog Buku Digital`
                : 'Katalog & Rak Bacaan Digital'}
            </span>
          </span>
        </a>

        <nav className="ls-navbar__nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`ls-navbar__link${index === 0 ? ' ls-navbar__link--active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ls-navbar__right">
          <div className="ls-student-badge" aria-label="Identitas mahasiswa">
            <span className="ls-student-badge__avatar" aria-hidden="true">
              SH
            </span>
            <div className="ls-student-badge__info">
              <span className="ls-student-badge__name">Salman Hadi Al Ghifari</span>
              <span className="ls-student-badge__nim">NIM 1247050065</span>
            </div>
          </div>

          <button
            type="button"
            className="ls-navbar__toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="ls-mobile-menu"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {mobileMenuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Compact visible identity bar on very small mobile screens */}
      <div className="ls-navbar__mobile-strip">
        <div className="ls-container ls-navbar__mobile-strip-inner">
          <span className="ls-navbar__mobile-strip-name">Salman Hadi Al Ghifari</span>
          <span className="ls-navbar__mobile-strip-nim">NIM 1247050065</span>
        </div>
      </div>

      <div
        id="ls-mobile-menu"
        className={`ls-navbar__mobile${mobileMenuOpen ? ' ls-navbar__mobile--open' : ''}`}
      >
        <div className="ls-container">
          <nav className="ls-navbar__mobile-links" aria-label="Navigasi seluler">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="ls-navbar__link"
                onClick={handleNavClick}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ls-navbar__mobile-identity">
            <div className="ls-student-badge">
              <span className="ls-student-badge__avatar" aria-hidden="true">
                SH
              </span>
              <div className="ls-student-badge__info">
                <span className="ls-student-badge__name">Salman Hadi Al Ghifari</span>
                <span className="ls-student-badge__nim">NIM 1247050065</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
