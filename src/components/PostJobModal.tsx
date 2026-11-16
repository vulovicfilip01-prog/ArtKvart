'use client'

import { useState } from 'react'
import { createJob } from '@/app/jobs/actions'
import { useRouter } from 'next/navigation'

export default function PostJobModal({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleOpen = () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    setIsOpen(true)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    await createJob(formData)
    setIsSubmitting(false)
    setIsOpen(false)
  }

  return (
    <>
      <button onClick={handleOpen} className="btn-primary">
        + Objavi Oglas
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--nav-bg)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 15px 50px rgba(0,0,0,0.65)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ color: 'var(--text-light)', fontSize: '1.35rem', fontWeight: 700 }}>
                Objavi novi oglas za posao / projekat
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form action={handleSubmit}>
              <div className="form-group">
                <label htmlFor="job-title">Naziv pozicije / projekta</label>
                <input
                  id="job-title"
                  name="title"
                  type="text"
                  required
                  placeholder="Npr. 2D Concept Artist za video igru"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label htmlFor="job-company">Studio / Klijent</label>
                  <input
                    id="job-company"
                    name="company"
                    type="text"
                    required
                    placeholder="Npr. Nordeus / Ink Studio"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="job-location">Lokacija</label>
                  <input
                    id="job-location"
                    name="location"
                    type="text"
                    placeholder="Npr. Beograd / Remote"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label htmlFor="job-type">Tip angažmana</label>
                  <select
                    id="job-type"
                    name="jobType"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      backgroundColor: '#000',
                      color: 'var(--text-light)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  >
                    <option value="Freelance / Projekat">Freelance / Projekat</option>
                    <option value="Stalni posao">Stalni posao</option>
                    <option value="Honorarni rad">Honorarni rad</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="job-category">Kategorija</label>
                  <select
                    id="job-category"
                    name="category"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      backgroundColor: '#000',
                      color: 'var(--text-light)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  >
                    <option value="Digitalna Umetnost">Digitalna Umetnost</option>
                    <option value="Tradicionalna">Tradicionalna</option>
                    <option value="Tetovaže">Tetovaže</option>
                    <option value="Grafiti">Grafiti</option>
                    <option value="Vajarstvo">Vajarstvo</option>
                    <option value="Tekstil">Tekstil</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label htmlFor="job-budget">Budžet / Plata</label>
                  <input
                    id="job-budget"
                    name="budget"
                    type="text"
                    placeholder="Npr. 800€ - 1500€ / Po dogovoru"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="job-email">Kontakt Email za prijave</label>
                  <input
                    id="job-email"
                    name="contactEmail"
                    type="email"
                    required
                    placeholder="posao@studio.rs"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="job-description">Opis posla i uslovi</label>
                <textarea
                  id="job-description"
                  name="description"
                  rows={4}
                  required
                  placeholder="Opišite šta tražite od umetnika, rokove i način prijave..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    backgroundColor: '#000',
                    color: 'var(--text-light)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.2rem' }}>
                <button type="button" onClick={() => setIsOpen(false)} className="btn-dark">
                  Otkaži
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Objavljivanje...' : 'Objavi Oglas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
