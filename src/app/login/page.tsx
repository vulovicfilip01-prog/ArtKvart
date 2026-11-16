import Link from 'next/link'
import { login, signup } from './actions'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string, mode?: string }>
}) {
  const { message, mode } = await searchParams;
  const isSignup = mode === 'signup';

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <svg viewBox="0 0 24 24" fill="var(--primary-color)" width="40" height="40" style={{marginBottom: '1rem'}}>
             <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
          </svg>
        </div>
        <h2 className="login-title">
          {isSignup ? 'Napravi ArtKvart nalog' : 'Dobrodošli nazad'}
        </h2>
        
        {message && (
          <div className="login-message">
            {message}
          </div>
        )}

        <form className="login-form" action={isSignup ? signup : login}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName">Puno Ime / Umetničko Ime</label>
              <input type="text" id="fullName" name="fullName" required placeholder="Npr. Marko Marković" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email adresa</label>
            <input type="email" id="email" name="email" required placeholder="umetnik@primer.com" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input type="password" id="password" name="password" required placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
            {isSignup ? 'Registruj se' : 'Prijavi se'}
          </button>
        </form>

        <div className="login-footer">
          {isSignup ? (
            <p>Već imate nalog? <Link href="/login" className="login-link">Prijavite se ovde</Link></p>
          ) : (
            <p>Nemate nalog? <Link href="/login?mode=signup" className="login-link">Registrujte se besplatno</Link></p>
          )}
        </div>
      </div>
    </div>
  )
}
