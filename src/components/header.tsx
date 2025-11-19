'use client';

import Image from 'next/image';
import Li from './li';
import { useEffect, useState } from 'react';
import SheetItem from './sheet-item';
import CVButton from './CVButton';

export default function Header() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  return (
    <div
      className={`fixed w-full z-53 duration-500 ${
        visible ? 'bg-black/90' : 'bg-black/30'
      }`}
    >
      <div className='container flex items-center justify-between w-full md:w-auto duration-300 h-16'>
        <div className='flex items-center justify-between w-full md:w-auto'>
          <button
            type='button'
            onClick={() => window.location.reload()}
            className='flex items-center size-7 mr-2 hover:cursor-pointer hover:scale-110 hover:opacity-80 transition-transform duration-200'
          >
            <Image
              src='/logo.png'
              alt='Logo'
              width={36}
              height={36}
              className='object-contain'
            />
          </button>
          <h1 className='max-md:hidden text-3xl md:text-2xl xl:text-2xl font-bold text-neutral-200'>
            <span className='bg-gradient-to-r from-purple-300 via-purple-600 to-purple-800 bg-clip-text text-transparent'>
              jmsDev
            </span>
          </h1>
          <div className='md:hidden'>
            <SheetItem />
          </div>
        </div>
        <ul className='flex gap-10 max-md:hidden'>
          <Li />
        </ul>
        <CVButton className='hidden md:inline-block' />
      </div>
    </div>
  );
}
