import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import { createClient } from '@/utils/supabase/server';
import { signout } from '@/app/login/actions';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtKvart - Mreža Vizuelnih Umetnika",
  description: "Platforma za umetnike",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
              <div className="dropdown">
                <span>Istraži</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0h10L5 6z"/></svg>
              </div>
              <div className="dropdown">
                <span>Edukacija</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0h10L5 6z"/></svg>
              </div>
              <div className="dropdown">
                <span>Karijera</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0h10L5 6z"/></svg>
              </div>
              <div className="dropdown">
                <span>Pronađi talente</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0h10L5 6z"/></svg>
              </div>
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
        </nav>

        {children}
      </body>
    </html>
  );
}
