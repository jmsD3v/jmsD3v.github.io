import Image from 'next/image';
import Social from './icons/social';

export default function AboutMe() {
  return (
    <div
      className='container flex flex-col md:flex-row justify-center items-center'
      data-aos='fade-up'
    >
      <div className='flex flex-col gap-5 items-center md:items-start md:w-1/2'>
        <h2 className='max-sm:text-3xl sm:text-4xl bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 bg-clip-text text-transparent font-bold pb-2'>
          About Me
        </h2>

        <p className='text-justify text-neutral-200/70'>
          Hi, my name is <b>Juan Manuel Silva</b>, I'm a Full Stack Developer
          from Argentina with a strong foundation in web technologies and a
          passion for building secure and scalable applications.
          <br />
          <br />
          I'm currently pursuing a <b>Technical Degree in Cybersecurity</b>,
          expanding my knowledge in ethical hacking, digital forensics, and
          secure system design.
          <br />
          <br />
          I enjoy crafting projects that combine functionality with clean,
          modern design — you can check out some of my work in the projects
          section.
          <br />
          <br />
          I'm always <b>open</b> to new opportunities where I can grow,
          contribute, and collaborate. Feel free to connect with me — you’ll
          find the links in the footer.
          <br />
          <br />
          Outside of tech, I love experimenting with electronics, renewable
          energy systems, and diving into anything that challenges how things
          work under the hood.
        </p>
        <Social />
      </div>
      <div className='w-full md:w-auto mt-5 md:mt-0'>
        <Image
          src='/Boy.png'
          alt='Profile illustration'
          width={420}
          height={420}
          className='w-100 mx-auto lg:block'
        />
      </div>
    </div>
  );
}
