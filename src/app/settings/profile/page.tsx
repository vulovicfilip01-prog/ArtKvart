import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from './actions';
import SubmitButton from '@/components/SubmitButton';
import ImageUploadInput from '@/components/ImageUploadInput';
import ChangePasswordForm from '@/components/ChangePasswordForm';

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

          <div className="form-group">
            <label htmlFor="instagramUrl">Instagram profil (Link ili @korisnicko_ime)</label>
            <input type="text" id="instagramUrl" name="instagramUrl" defaultValue={profile?.instagram_url || ''} placeholder="npr. https://instagram.com/tvoj_profil ili @tvoj_profil" />
          </div>

          <div className="form-group">
            <label htmlFor="websiteUrl">Lični sajt / Portfolio link (Opciono)</label>
            <input type="url" id="websiteUrl" name="websiteUrl" defaultValue={profile?.website_url || ''} placeholder="https://..." />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', backgroundColor: 'var(--surface-color)', padding: '0.9rem 1rem', borderRadius: '8px' }}>
            <input
              type="checkbox"
              id="availableForWork"
              name="availableForWork"
              defaultChecked={profile?.available_for_work !== false}
              style={{ width: '18px', height: '18px', accentColor: '#2ecc71', cursor: 'pointer' }}
            />
            <label htmlFor="availableForWork" style={{ marginBottom: 0, cursor: 'pointer', color: 'var(--text-light)', fontWeight: 600 }}>
              ● Dostupan/na sam za freelance projekte, narudžbine i zakazivanje termina
            </label>
          </div>

          <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            <ImageUploadInput
              id="avatarFile"
              name="avatarFile"
              label="Profilna slika / Avatar (Otpremi sa računara ili telefona)"
              initialPreview={profile?.avatar_url}
              isAvatar={true}
            />
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              defaultValue={profile?.avatar_url || ''}
              placeholder="Ili nalepi link profilne slike (https://...)"
              style={{ marginTop: '0.6rem' }}
            />
          </div>

          <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            <ImageUploadInput
              id="coverFile"
              name="coverFile"
              label="Pozadinska slika / Cover (Otpremi sa računara ili telefona)"
              initialPreview={profile?.cover_url}
            />
            <input
              type="url"
              id="coverUrl"
              name="coverUrl"
              defaultValue={profile?.cover_url || ''}
              placeholder="Ili nalepi link pozadinske slike (https://...)"
              style={{ marginTop: '0.6rem' }}
            />
          </div>

          <SubmitButton
            label="Sačuvaj izmene"
            pendingLabel="Čuvanje profila u toku..."
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
          />
        </form>

        <ChangePasswordForm />
      </div>
    </div>
  )
}
