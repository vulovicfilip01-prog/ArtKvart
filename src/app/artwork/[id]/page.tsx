import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import type { Metadata } from 'next';
import LikeButton from '@/components/LikeButton';
import FollowButton from '@/components/FollowButton';
import DeleteArtworkButton from '@/components/DeleteArtworkButton';
import EditArtworkModal from '@/components/EditArtworkModal';
import ShareButton from '@/components/ShareButton';
import ArtworkLightbox from '@/components/ArtworkLightbox';
import ContactModalButton from '@/components/ContactModalButton';
import { postComment, deleteComment } from './actions';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: artwork } = await supabase
    .from('artworks')
    .select('title, description, image_url, profiles(full_name)')
    .eq('id', id)
    .single();

  if (!artwork) {
    return { title: 'Rad nije pronađen' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artistName = (artwork.profiles as any)?.full_name || 'Umetnik';

  return {
    title: `${artwork.title} – ${artistName}`,
    description: artwork.description || `Pogledajte rad "${artwork.title}" autora ${artistName} na platformi ArtKvart.`,
    openGraph: {
      title: `${artwork.title} | ArtKvart`,
      description: artwork.description || `Autor: ${artistName}`,
      images: artwork.image_url ? [artwork.image_url] : [],
    },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const artworkId = resolvedParams.id;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      *,
      profiles (
        id,
        full_name,
        username,
        avatar_url,
        followers_count,
        category
      )
    `)
    .eq('id', artworkId)
    .single();

  if (error || !artwork) {
    return notFound();
  }
  
  // Proveri lajk
  let isLikedByMe = false;
  let isFollowing = false;

  if (user) {
    const { data: like } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('artwork_id', artworkId).single();
    if (like) isLikedByMe = true;
    
    const { data: follow } = await supabase.from('follows').select('*').eq('follower_id', user.id).eq('following_id', artwork.profiles.id).single();
    if (follow) isFollowing = true;
  }

  // Dohvati komentare
  const { data: comments } = await supabase
    .from('comments')
    .select(`*, profiles(full_name, avatar_url)`)
    .eq('artwork_id', artworkId)
    .order('created_at', { ascending: false });

  // Pravi brojač pregleda (povećava views_count u bazi za 1)
  const views = (artwork.views_count || 0) + 1;
  await supabase.from('artworks').update({ views_count: views }).eq('id', artworkId);
  const isOwner = user?.id === artwork.profiles.id;

  // Dohvati još radova istog umetnika
  const { data: moreByArtist } = await supabase
    .from('artworks')
    .select('id, title, image_url, price, likes_count')
    .eq('artist_id', artwork.profiles.id)
    .neq('id', artworkId)
    .order('created_at', { ascending: false })
    .limit(4);

  // Dohvati slične radove iz iste kategorije
  const { data: similarArtworks } = await supabase
    .from('artworks')
    .select('id, title, image_url, price, profiles(full_name)')
    .eq('category', artwork.category)
    .neq('id', artworkId)
    .order('likes_count', { ascending: false })
    .limit(4);

  return (
    <main className="main-content">
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      
      {/* Left side: Artwork Image with Full-Screen Lightbox */}
      <div style={{ flex: '1 1 0%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ArtworkLightbox src={artwork.image_url} alt={artwork.title} />
      </div>

      {/* Right side: Sidebar Info */}
      <div style={{ width: '100%', maxWidth: '350px', flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--nav-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Artist Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <Link href={`/artist/${artwork.profiles.id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={artwork.profiles.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'} 
              alt={artwork.profiles.full_name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </Link>
          <div style={{ flex: 1 }}>
            <Link href={`/artist/${artwork.profiles.id}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ color: 'var(--text-light)', margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 600 }}>{artwork.profiles.full_name || 'Anonimni Umetnik'}</h3>
            </Link>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
              {artwork.profiles.category || 'Umetnik'}
            </div>
            
            {!isOwner && (
              <FollowButton artistId={artwork.profiles.id} isFollowingInitial={isFollowing} isLoggedIn={!!user} />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <LikeButton 
            artworkId={artwork.id} 
            initialLikes={artwork.likes_count || 0} 
            isLikedInitial={isLikedByMe}
            isLoggedIn={!!user}
          />
          <ShareButton title={artwork.title} />
          {isOwner && (
            <>
              <EditArtworkModal artwork={artwork} />
              <DeleteArtworkButton artworkId={artwork.id} />
            </>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            {artwork.likes_count || 0} Lajkova
          </span>
          <span style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {views} Pregleda
          </span>
          <span style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {comments?.length || 0} Kom.
          </span>
        </div>

        {/* Artwork Info */}
        <div>
          <h2 style={{ fontSize: '1.3rem', margin: '0 0 0.8rem 0', color: 'var(--text-light)', fontWeight: 700 }}>{artwork.title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="profile-badge">{artwork.category}</span>
            {artwork.price && (
              <span
                style={{
                  backgroundColor: 'rgba(46, 204, 113, 0.15)',
                  color: '#2ecc71',
                  border: '1px solid rgba(46, 204, 113, 0.35)',
                  padding: '0.2rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                Na prodaju • {artwork.price}
              </span>
            )}
          </div>
          {artwork.price && !isOwner && (
            <div style={{ marginBottom: '1rem' }}>
              <ContactModalButton
                artistId={artwork.profiles.id}
                artistName={artwork.profiles.full_name || 'Umetnik'}
                username={artwork.profiles.username}
                category={artwork.profiles.category}
                buttonLabel={`Kupi / Upit za rad (${artwork.price})`}
                buttonClassName="btn-primary"
                defaultSubject={`Upit za kupovinu rada: ${artwork.title} (${artwork.price})`}
              />
            </div>
          )}
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>
            {artwork.description || 'Umetnik nije dodao opis za ovaj rad.'}
          </p>
        </div>
        
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Objavljeno: {new Date(artwork.created_at).toLocaleDateString('sr-RS')}
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-light)' }}>Komentari ({comments?.length || 0})</h3>
          
          {user ? (
            <form action={postComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="hidden" name="artworkId" value={artwork.id} />
              <textarea name="content" required placeholder="Napiši komentar..." rows={2} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', resize: 'none', outline: 'none' }}></textarea>
              <button type="submit" className="btn-dark" style={{ alignSelf: 'flex-end', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>Objavi</button>
            </form>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Prijavite se da ostavite komentar.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {comments?.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.profiles?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '0.2rem' }}>{c.profiles?.full_name || 'Korisnik'}</div>
                    {user?.id === c.user_id && (
                      <form action={deleteComment}>
                        <input type="hidden" name="commentId" value={c.id} />
                        <input type="hidden" name="artworkId" value={artwork.id} />
                        <button
                          type="submit"
                          title="Obriši komentar"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Obriši
                        </button>
                      </form>
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', wordBreak: 'break-word', lineHeight: '1.4' }}>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>

      {/* More by this artist */}
      {moreByArtist && moreByArtist.length > 0 && (
        <section style={{ marginTop: '3.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-light)', fontWeight: 700 }}>
              Više radova od umetnika {artwork.profiles.full_name}
            </h3>
            <Link href={`/artist/${artwork.profiles.id}`} style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600 }}>
              Ceo portfolio →
            </Link>
          </div>
          <div className="gallery-grid">
            {moreByArtist.map((item) => (
              <Link href={`/artwork/${item.id}`} key={item.id} className="art-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="art-image" />
                <div className="art-info">
                  <div className="art-title">{item.title}</div>
                  {item.price && <div style={{ color: '#2ecc71', fontSize: '0.8rem', fontWeight: 600 }}>Na prodaju • {item.price}</div>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Similar Artworks in Category */}
      {similarArtworks && similarArtworks.length > 0 && (
        <section style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-light)', fontWeight: 700, marginBottom: '1rem' }}>
            Slični radovi iz kategorije: {artwork.category}
          </h3>
          <div className="gallery-grid">
            {similarArtworks.map((item) => (
              <Link href={`/artwork/${item.id}`} key={item.id} className="art-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="art-image" />
                <div className="art-info">
                  <div className="art-title">{item.title}</div>
                  <div className="art-artist">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(item.profiles as any)?.full_name || 'Umetnik'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
