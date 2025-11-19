'use client';
import AboutMe from '@/components/about-me';
import Contact from '@/components/contact';
import MainSection from '@/components/main-section';
import Projects from '@/components/projects/projects';
import ScrollToTop from '@/components/scroll-to-top';
import Skills from '@/components/skills';
import { social } from '@/data/social';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);
  const linkWhatsapp = social.find((item) => item.name === 'Whatsapp');

  return (
    <>
      <ScrollToTop />
      {linkWhatsapp && (
        <Link
          href={linkWhatsapp.href}
          target='_blank'
          rel='noopener noreferrer'
        >
          <button
            type='button'
            aria-label='Abrir WhatsApp'
            title='Abrir WhatsApp'
            className='flex justify-center items-center bg-[#59D264] rounded-full fixed bottom-5 right-5 hover:cursor-pointer hover:bg-[#4ead55] duration-200 z-50 w-12 h-12'
          >
            <Icon icon='logos:whatsapp-icon' className='size-7' />
          </button>
        </Link>
      )}

      <section className='flex flex-col h-screen bg-radial from-purple-800 via-purple-900 via-10% to-black'>
        <MainSection />
      </section>
      <section
        id='aboutMe'
        className='flex flex-col gap-6 py-30 bg-radial from-[#242424] via-[#1c1c1c] to-[#161616] lg:justify-center lg:items-center'
      >
        <AboutMe />
      </section>
      <section
        id='skills'
        className="flex flex-col gap-6 justify-center items-center py-30 h-full bg-[url('/background.png')] bg-cover bg-center w-full"
      >
        <Skills />
      </section>
      <section
        id='projects'
        className='flex flex-col gap-6 justify-center items-center py-30 bg-radial from-[#242424] via-[#1c1c1c] to-[#161616]'
      >
        <Projects />
      </section>

      <section
        id='contact'
        className="flex flex-col justify-center items-center py-30 h-screen bg-[url('/background.png')] bg-cover bg-center w-full"
      >
        <Contact />
      </section>
    </>
  );
}
