'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import H2 from './h2';

type ContactForm = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  company?: string; // honeypot
};

export default function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
    company: '',
  });

  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const runConfetti = useCallback(async () => {
    try {
      const confettiModule = await import('canvas-confetti');
      const confetti = confettiModule.default || confettiModule;

      // create a fullscreen canvas attached to body so confetti is visible everywhere
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);

      const anyConfetti: any = confetti;
      const maybeCreate =
        typeof anyConfetti.create === 'function'
          ? anyConfetti.create(canvas, { resize: true, useWorker: true })
          : anyConfetti;

      if (typeof maybeCreate === 'function') {
        maybeCreate({
          particleCount: 160,
          spread: 120,
          startVelocity: 30,
          origin: { x: 0.5, y: 0.3 },
        });
        maybeCreate({
          particleCount: 80,
          spread: 90,
          startVelocity: 45,
          origin: { x: 0.2, y: 0.4 },
        });
        maybeCreate({
          particleCount: 80,
          spread: 90,
          startVelocity: 45,
          origin: { x: 0.8, y: 0.4 },
        });
      }

      // remove canvas after animation
      setTimeout(() => {
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }, 3500);
    } catch (err) {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(null);

    // Client-side validations
    const nameTrim = form.name?.trim();
    const emailTrim = form.email?.trim();
    const messageTrim = form.message?.trim();
    const honeypot = form.company?.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (honeypot) {
      // likely bot
      setStatus('error');
      setErrorMessage('Validation failed');
      return;
    }

    if (!nameTrim || nameTrim.length < 2) {
      setStatus('error');
      setErrorMessage('Nombre muy corto');
      return;
    }

    if (!emailTrim || !emailPattern.test(emailTrim)) {
      setStatus('error');
      setErrorMessage('Correo inválido');
      return;
    }

    if (!messageTrim || messageTrim.length < 10) {
      setStatus('error');
      setErrorMessage('Mensaje muy corto');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus('error');
        setErrorMessage(
          data?.error || data?.message || 'Error sending message'
        );
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', company: '' });
      // small timeout to ensure modal is visible before confetti
      setTimeout(() => runConfetti(), 120);
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error');
    }
  };

  useEffect(() => {
    if (showForm) {
      setIsAnimating(false);
      const t = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(t);
    }
    setIsAnimating(false);
  }, [showForm]);

  return (
    <div className='relative'>
      <section
        className='flex flex-col rounded-sm shadow-lg bg-purple-950 p-6 lg:p-10 gap-10 items-center text-center'
        data-aos='fade-up'
      >
        <div className='flex flex-col gap-5 max-w-md'>
          <H2 text='Contact' />
          <p className='text-neutral-200/70 text-sm'>
            Let's build something great together! Feel free to reach out via
            email or connect with me on LinkedIn.
          </p>

          <div className='flex flex-col gap-4 mt-4'>
            <button
              type='button'
              onClick={() => setShowForm(true)}
              className='flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition'
            >
              <Icon icon='line-md:email' className='size-6' />
              Send me an Email
            </button>

            <a
              href='https://www.linkedin.com/in/jmsilva83'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-center gap-2 border border-purple-600 hover:bg-purple-600 hover:text-white text-purple-300 font-semibold py-2 px-4 rounded-lg transition'
            >
              <Icon icon='line-md:linkedin' className='size-6' />
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <img
          src='contact.png'
          alt='Contact illustration'
          className='w-72 mx-auto lg:block'
        />
      </section>

      {showForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowForm(false)}
            aria-hidden='true'
          />

          <div className='relative w-full max-w-xl mx-auto'>
            <div
              className={`bg-purple-950 rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 ease-out ${
                isAnimating
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95'
              }`}
            >
              <div className='p-6 relative'>
                {/* confetti uses a fullscreen canvas appended to document.body */}

                <div className='flex items-start justify-between'>
                  <div>
                    <H2 text='Contact' />
                    <p className='text-neutral-200/70 text-sm'>
                      Fill the form below to send a message directly from the
                      site.
                    </p>
                  </div>

                  <button
                    aria-label='Close contact form'
                    onClick={() => setShowForm(false)}
                    className='text-neutral-300 hover:text-white'
                  >
                    ✕
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className='grid grid-cols-1 gap-4 mt-4'
                  noValidate
                >
                  <input
                    type='text'
                    name='company'
                    value={form.company}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete='off'
                    style={{ display: 'none' }}
                    aria-hidden='true'
                  />

                  <div className='grid sm:grid-cols-2 gap-4'>
                    <label className='flex flex-col'>
                      <span className='text-sm text-neutral-200'>Name</span>
                      <input
                        required
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        placeholder='Tu nombre completo'
                        aria-label='Nombre'
                        className='mt-1 p-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
                      />
                    </label>

                    <label className='flex flex-col'>
                      <span className='text-sm text-neutral-200'>Email</span>
                      <input
                        required
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        placeholder='tu@ejemplo.com'
                        aria-label='Correo electrónico'
                        className='mt-1 p-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
                      />
                    </label>
                  </div>

                  <label className='flex flex-col'>
                    <span className='text-sm text-neutral-200'>
                      Phone (optional)
                    </span>
                    <input
                      type='tel'
                      name='phone'
                      value={form.phone}
                      onChange={handleChange}
                      placeholder='Opcional — prefijo + código'
                      aria-label='Teléfono (opcional)'
                      className='mt-1 p-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
                    />
                  </label>

                  <label className='flex flex-col'>
                    <span className='text-sm text-neutral-200'>Message</span>
                    <textarea
                      required
                      name='message'
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder='Escribe tu mensaje aquí (mínimo 10 caracteres)'
                      aria-label='Mensaje'
                      className='mt-1 p-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600'
                    />
                  </label>

                  <div className='flex items-center gap-4'>
                    <button
                      type='submit'
                      disabled={status === 'sending'}
                      className='bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-60'
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>

                    <button
                      type='button'
                      onClick={() => setShowForm(false)}
                      className='text-neutral-300 underline'
                    >
                      Cancel
                    </button>

                    {status === 'success' && (
                      <span className='text-green-400'>
                        Message sent. Gracias!
                      </span>
                    )}
                    {status === 'error' && (
                      <span className='text-red-400'>
                        Error: {errorMessage}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
