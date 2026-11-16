import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { deleteMessage } from './actions';

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="main-content" style={{ maxWidth: '900px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.8rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-light)' }}>
            Inboks i Upiti za Saradnju
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Poruke i poslovni upiti koje su vam poslali klijenti i drugi umetnici sa vašeg profila.
          </p>
        </div>
        <Link href={`/artist/${user.id}`} className="btn-dark" style={{ textDecoration: 'none' }}>
          Nazad na profil
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {msg.subject}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Od:{' '}
                    {msg.sender_id ? (
                      <Link href={`/artist/${msg.sender_id}`} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                        {msg.sender_name || 'Umetnik'}
                      </Link>
                    ) : (
                      <strong style={{ color: 'var(--text-light)' }}>{msg.sender_name || 'Posetilac'}</strong>
                    )}
                    {msg.sender_email && ` (${msg.sender_email})`} •{' '}
                    {new Date(msg.created_at).toLocaleDateString('sr-RS', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  {msg.sender_email && (
                    <a
                      href={`mailto:${msg.sender_email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', textDecoration: 'none' }}
                    >
                      Odgovori putem emaila
                    </a>
                  )}
                  <form action={deleteMessage}>
                    <input type="hidden" name="messageId" value={msg.id} />
                    <button
                      type="submit"
                      className="btn-dark"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#e74c3c' }}
                    >
                      Obriši
                    </button>
                  </form>
                </div>
              </div>

              <p
                style={{
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'var(--surface-color)',
                  padding: '1rem',
                  borderRadius: '8px',
                }}
              >
                {msg.content}
              </p>
            </div>
          ))
        ) : (
          <div
            style={{
              backgroundColor: 'var(--nav-bg)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
            }}
          >
            Trenutno nemate nijednu primljenu poruku u inboksu.
          </div>
        )}
      </div>
    </main>
  );
}
