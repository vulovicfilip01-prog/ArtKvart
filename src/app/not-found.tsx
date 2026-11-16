import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="main-content"
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.2rem',
      }}
    >
      <div
        style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          color: 'var(--primary-color)',
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: '1.8rem', color: 'var(--text-light)', fontWeight: 800 }}>
        Stranica ili rad nisu pronađeni
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '460px' }}>
        Traženi umetnički rad ili profil možda više ne postoji ili je premešten na drugu adresu.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Nazad na početnu
        </Link>
        <Link href="/artists" className="btn-dark" style={{ textDecoration: 'none' }}>
          Istraži umetnike
        </Link>
      </div>
    </main>
  );
}
