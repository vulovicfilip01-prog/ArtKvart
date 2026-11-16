import { uploadArtwork } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import ImageUploadInput from '@/components/ImageUploadInput'

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ako korisnik nije ulogovan, ne može da pristupi ovoj stranici
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <h2 className="login-title">Objavi Novi Rad</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Pokažite svoj talenat svetu. Popunite detalje o svom novom delu.
        </p>

        <form className="login-form" action={uploadArtwork}>
          <div className="form-group">
            <label htmlFor="title">Naslov dela</label>
            <input type="text" id="title" name="title" required placeholder="Npr. Cyberpunk Beograd" />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Kategorija</label>
            <select id="category" name="category" required style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }}>
              <option value="Digitalna Umetnost">Digitalna Umetnost</option>
              <option value="Tradicionalna">Tradicionalna</option>
              <option value="Tetovaže">Tetovaže</option>
              <option value="Grafiti">Grafiti</option>
              <option value="Vajarstvo">Vajarstvo</option>
              <option value="Tekstil">Tekstil</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis (Opciono)</label>
            <textarea id="description" name="description" rows={4} placeholder="Šta vas je inspirisalo?" style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', resize: 'vertical' }}></textarea>
          </div>

          <div className="form-group">
            <ImageUploadInput
              id="file"
              name="file"
              label="Slika (Otpremi fajl sa računara ili telefona)"
            />
            <small style={{color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem', lineHeight: '1.4'}}>
              *Maksimalna veličina fajla je 10MB.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Ili link do slike (URL alternativa)</label>
            <input type="url" id="imageUrl" name="imageUrl" placeholder="https://..." />
          </div>

          <SubmitButton
            label="Objavi Rad na Profilu"
            pendingLabel="Otpremanje slike u toku..."
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1rem' }}
          />
        </form>
      </div>
    </div>
  )
}
