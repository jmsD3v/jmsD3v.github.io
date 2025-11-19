'use client';

type CVButtonProps = {
  className?: string;
  /**
   * When true, forces the button to be visible on mobile.
   * Default: false (hidden on mobile, visible from md and up).
   */
  showOnMobile?: boolean;
};

export default function CVButton({
  className = '',
  showOnMobile = false,
}: CVButtonProps) {
  const displayClass = showOnMobile ? 'inline-flex' : 'hidden md:inline-flex';

  return (
    <a
      href='/resume.pdf'
      target='_blank'
      rel='noopener noreferrer'
      download='resume.pdf'
      aria-label='Download CV'
      className={`group ${displayClass} items-center justify-center h-9 px-3 rounded-sm bg-purple-600 text-neutral-200 text-sm font-medium hover:bg-purple-700 transition-colors duration-200 ${className}`}
    >
      <span className='inline-flex items-center gap-2 leading-none'>
        <span className='leading-none'>Get my CV</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          className='w-4 h-4 transform transition-all duration-200 translate-y-0 opacity-90 group-hover:translate-y-1 align-middle self-center'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 5v14M19 12l-7 7-7-7'
          />
        </svg>
      </span>
    </a>
  );
}
