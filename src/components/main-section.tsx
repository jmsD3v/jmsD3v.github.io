import Header from './header';
import Social from './icons/social';

export default function MainSection() {
  return (
    <>
      <Header />
      <section
        className='container flex max-md:flex-col justify-center items-center h-screen'
        data-aos='fade-up'
        data-aos-duration='1200'
      >
        <div className='flex justify-center items-center h-screen max-md:h-[50vh]'>
          <img
            src='/perfil.jpg'
            alt='perfil'
            className='w-60 max-md:w-70 mx-auto lg:mr-10 rounded-full aspect-square object-cover border-4 border-purple-500 shadow-lg shadow-purple-500/50'
            data-aos='fade-right'
            data-aos-delay='200'
          />
        </div>
        <div className='flex flex-col justify-center items-center'>
          <div
            className='flex flex-col  max-md:justify-center max-md:items-center gap-6'
            data-aos='fade-up'
            data-aos-delay='400'
          >
            <div className='flex flex-col max-md:justify-center max-md:items-center'>
              <h1
                className='max-md:text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent pb-3'
                data-aos='fade-up'
              >
                Juan Manuel Silva
              </h1>
              <h2
                className='max-md:text-center text-xl md:text-2xl text-neutral-200 pb-3'
                data-aos='fade-up'
                data-aos-delay='200'
              >
                <span className='block'>
                  Full Stack JS/TS & Python Developer
                </span>
                <span className='block'>AI Engineer</span>
                <span className='block'>Cybersecurity Specialist</span>
              </h2>
            </div>
            <Social />
          </div>
        </div>
      </section>
    </>
  );
}
