import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import { createClient } from '@/utils/supabase/server';
import { signout } from '@/app/login/actions';
import MobileMenu from '@/components/MobileMenu';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ArtKvart - Mreža Vizuelnih Umetnika",
    template: "%s | ArtKvart",
  },
  description: "Regionalna platforma za vizuelne umetnike, ilustratore, tatu majstore, grafiti umetnike i dizajnere.",
  openGraph: {
    title: "ArtKvart - Mreža Vizuelnih Umetnika",
    description: "Otkrijte izvanredne radove, povežite se sa vodećim studijima i pronađite talente.",
    type: "website",
    locale: "sr_RS",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let messagesCount = 0;
  if (user) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id);
    messagesCount = count || 0;
  }

  return (
    <html lang="sr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav className="navbar">
          <div className="nav-left">
            <Link href="/" className="nav-brand" style={{textDecoration: 'none'}}>
              <svg viewBox="0 0 24 24" fill="var(--primary-color)" width="28" height="28" style={{marginRight: 8}}>
                 <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
              </svg>
              Art<span>Kvart</span>
            </Link>
            <div className="nav-dropdowns">
              <Link href="/" className="dropdown" style={{ textDecoration: 'none' }}>
                <span>Istraži</span>
              </Link>
              <Link href="/artists" className="dropdown" style={{ textDecoration: 'none' }}>
                <span>Pronađi talente</span>
              </Link>
              <Link href="/jobs" className="dropdown" style={{ textDecoration: 'none' }}>
                <span>Karijera i Oglasi</span>
              </Link>
            </div>
          </div>
          
          <form action="/" method="GET" className="nav-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" name="q" placeholder="Pretraži umetnike, radove, tagove..." />
          </form>

          <div className="nav-right">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/upload" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{marginRight: '5px'}}>+</span> Objavi Rad
                </Link>
                <Link href="/inbox" className="btn-dark" style={{ textDecoration: 'none', padding: '0.4rem 0.85rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                  Poruke
                  {messagesCount > 0 && (
                    <span
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '0.05rem 0.45rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {messagesCount}
                    </span>
                  )}
                </Link>
                <Link href={`/artist/${user.id}`} style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem', textDecoration: 'none' }}>
                   {user.user_metadata?.full_name || user.email}
                </Link>
                <form action={signout}>
                   <button type="submit" className="btn-dark" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Odjavi se</button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-text" style={{textDecoration: 'none'}}>Prijavi se</Link>
                <Link href="/login?mode=signup" className="btn-primary" style={{textDecoration: 'none'}}>Registracija</Link>
              </>
            )}
          </div>

          <MobileMenu
            user={
              user
                ? {
                    id: user.id,
                    email: user.email,
                    fullName: user.user_metadata?.full_name,
                  }
                : null
            }
          />
        </nav>

        <div style={{ flex: 1 }}>
          {children}
        </div>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-brand-col">
              <Link href="/" className="nav-brand" style={{ textDecoration: 'none', marginBottom: '0.6rem' }}>
                <svg viewBox="0 0 24 24" fill="var(--primary-color)" width="24" height="24" style={{ marginRight: 8 }}>
                  <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
                </svg>
                Art<span>Kvart</span>
              </Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '320px' }}>
                Regionalna zajednica i portfolio platforma za digitalne, tradicionalne, tattoo i street-art umetnike.
              </p>
            </div>

            <div className="footer-links-col">
              <h4>Platforma</h4>
              <Link href="/">Istraži radove</Link>
              <Link href="/artists">Pronađi talente</Link>
              <Link href="/jobs">Oglasi za posao</Link>
              <Link href="/upload">Objavi rad</Link>
            </div>

            <div className="footer-links-col">
              <h4>Kategorije</h4>
              <Link href="/?category=Digitalna%20Umetnost">Digitalna Umetnost</Link>
              <Link href="/?category=Tetova%C5%BEe">Tetovaže</Link>
              <Link href="/?category=Grafiti">Grafiti i Murali</Link>
              <Link href="/?category=Tradicionalna">Tradicionalna umetnost</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ArtKvart. Sva prava zadržana.</span>
            <span>Napravljeno za umetnike sa Balkana</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
