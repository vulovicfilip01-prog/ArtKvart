import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from './actions';

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '600px' }}>
        <h2 className="login-title">Uredi Profil</h2>
        
        <form className="login-form" action={updateProfile}>
          <div className="form-group">
            <label htmlFor="fullName">Puno Ime / Umetničko Ime</label>
            <input type="text" id="fullName" name="fullName" defaultValue={profile?.full_name || ''} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Korisničko ime (Handle)</label>
            <input type="text" id="username" name="username" defaultValue={profile?.username || ''} placeholder="npr. nikola_art" />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokacija</label>
            <input type="text" id="location" name="location" defaultValue={profile?.location || ''} placeholder="Npr. Beograd, Srbija" />
          </div>

          <div className="form-group">
            <label htmlFor="category">Glavna kategorija</label>
            <select id="category" name="category" defaultValue={profile?.category || 'Digitalna Umetnost'} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}>
              <option value="Digitalna Umetnost">Digitalna Umetnost</option>
              <option value="Tradicionalna">Tradicionalna</option>
              <option value="Tetovaže">Tetovaže</option>
              <option value="Grafiti">Grafiti</option>
              <option value="Vajarstvo">Vajarstvo</option>
              <option value="Tekstil">Tekstil</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Kratka Biografija</label>
            <textarea id="bio" name="bio" rows={4} defaultValue={profile?.bio || ''} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', resize: 'vertical', outline: 'none' }} placeholder="Napišite nešto o sebi i svom iskustvu..."></textarea>
          </div>

          <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            <label htmlFor="avatarFile">Profilna slika / Avatar (Otpremi sa računara)</label>
            {profile?.avatar_url && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar_url}
                  alt="Trenutni avatar"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trenutna profilna slika</span>
              </div>
            )}
            <input
              type="file"
              id="avatarFile"
              name="avatarFile"
              accept="image/*"
              style={{ width: '100%', padding: '0.7rem 1rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.6rem' }}
            />
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              defaultValue={profile?.avatar_url || ''}
              placeholder="Ili nalepi link profilne slike (https://...)"
            />
          </div>

          <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            <label htmlFor="coverFile">Pozadinska slika / Cover (Otpremi sa računara)</label>
            {profile?.cover_url && (
              <div style={{ marginBottom: '0.8rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.cover_url}
                  alt="Trenutni cover"
                  style={{ width: '100%', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              </div>
            )}
            <input
              type="file"
              id="coverFile"
              name="coverFile"
              accept="image/*"
              style={{ width: '100%', padding: '0.7rem 1rem', backgroundColor: '#000', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', marginBottom: '0.6rem' }}
            />
            <input
              type="url"
              id="coverUrl"
              name="coverUrl"
              defaultValue={profile?.cover_url || ''}
              placeholder="Ili nalepi link pozadinske slike (https://...)"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
            Sačuvaj izmene
          </button>
        </form>
      </div>
    </div>
  )
}
