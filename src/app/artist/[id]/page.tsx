import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import FollowButton from '@/components/FollowButton';
import ContactModalButton from '@/components/ContactModalButton';
import ArtistProfileTabs from '@/components/ArtistProfileTabs';
import ShareButton from '@/components/ShareButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url, category')
    .eq('id', id)
    .single();

  if (!profile) {
    return { title: 'Umetnik nije pronađen' };
  }

  return {
    title: `${profile.full_name || 'Umetnik'} (${profile.category || 'Portfolio'})`,
    description: profile.bio || `Pogledajte portfolio umetnika ${profile.full_name} na ArtKvart platformi.`,
    openGraph: {
      title: `${profile.full_name || 'Umetnik'} | ArtKvart Portfolio`,
      description: profile.bio || 'Pogledajte radove i portfolio na ArtKvart-u.',
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function ArtistProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artistId = resolvedParams.id;
  
  const supabase = await createClient();
  
  // Dohvati profil iz baze
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', artistId)
    .single();
    
  // Ako profil ne postoji, vrati 404
  if (error || !profile) {
    return notFound();
  }

  // Proveri da li trenutno ulogovani korisnik gleda svoj profil i da li već prati umetnika
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === artistId;
  let isFollowing = false;

  if (user && !isOwner) {
    const { data: follow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', artistId)
      .single();
    if (follow) isFollowing = true;
  }

  // Dohvati radove ovog umetnika
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  // Dohvati radove koje je ovaj umetnik lajkovao
  const { data: likesRows } = await supabase
    .from('likes')
    .select('artwork_id, artworks(*)')
    .eq('user_id', artistId)
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const likedArtworks = (likesRows || []).map((row: any) => row.artworks).filter(Boolean);

  return (
    <main className="main-content" style={{ padding: 0, maxWidth: '100%' }}>
      {/* Cover Photo */}
      <div className="profile-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} alt="Cover" />
      </div>

      {/* Profile Info */}
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'} alt={profile.full_name || 'Avatar'} />
          </div>
          
          <div className="profile-actions">
            {isOwner ? (
              <>
                <Link href="/settings/profile" className="btn-dark" style={{textDecoration: 'none'}}>Uredi profil</Link>
                <ShareButton title={profile.full_name || 'ArtKvart Portfolio'} />
              </>
            ) : (
              <>
                <FollowButton artistId={artistId} isFollowingInitial={isFollowing} isLoggedIn={!!user} />
                <ContactModalButton
                  artistId={artistId}
                  artistName={profile.full_name || 'Korisnik bez imena'}
                  username={profile.username}
                  location={profile.location}
                  category={profile.category}
                />
                <ShareButton title={profile.full_name || 'ArtKvart Portfolio'} />
              </>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <h1 className="profile-name" style={{ marginBottom: 0 }}>{profile.full_name || 'Korisnik bez imena'}</h1>
            {profile.available_for_work !== false && (
              <span
                style={{
                  backgroundColor: 'rgba(46, 204, 113, 0.14)',
                  color: '#2ecc71',
                  border: '1px solid rgba(46, 204, 113, 0.35)',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                ● Dostupan za saradnju
              </span>
            )}
          </div>
          <p className="profile-handle" style={{ marginTop: '0.3rem' }}>@{profile.username || 'umetnik'} • {profile.location || 'Nepoznata lokacija'}</p>
          <p className="profile-bio">{profile.bio || 'Ovaj umetnik još uvek nije dodao biografiju.'}</p>
          <div className="profile-stats" style={{ flexWrap: 'wrap' }}>
            <span><strong>{profile.followers_count || 0}</strong> Pratilaca</span>
            <span><strong>{profile.following_count || 0}</strong> Prati</span>
            {profile.category && <span className="profile-badge">{profile.category}</span>}
            {profile.instagram_url && (
              <a
                href={profile.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark"
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                Instagram ↗
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark"
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                Sajt / Portfolio ↗
              </a>
            )}
          </div>
        </div>

        <ArtistProfileTabs profile={profile} artworks={artworks || []} likedArtworks={likedArtworks} />
      </div>
    </main>
  );
}
