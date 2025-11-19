import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  projectName: string;
  projectImage: string;
  linkDeploy: string | null;
  linkGitHub: string | null;
  projectTechnologies: any | null;
  projectDescription: string | null;
  projectType: string;
};

export default function Modal({
  children,
  projectName,
  projectImage,
  linkDeploy,
  linkGitHub,
  projectTechnologies,
  projectDescription,
  projectType,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className='overflow-y-auto max-h-[95vh] lg:min-w-2xl z-54 hide-scrollbar'
        data-aos='fade-up'
      >
        <DialogHeader>
          <DialogTitle className='text-3xl bg-gradient-to-r from-purple-300 via-purple-500 to-purple-800 bg-clip-text text-transparent font-bold pb-1'>
            {projectName}
          </DialogTitle>
          <DialogDescription asChild>
            <section className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <img
                  src={projectImage}
                  alt='project image'
                  className='rounded-sm shadow-lg min-sm:w-100 lg:w-150'
                />
              </div>
              {projectType !== 'design' && (
                <>
                  {projectTechnologies && projectTechnologies.length > 0 && (
                    <div className='flex flex-col gap-2'>
                      <p className='text-neutral-200 font-bold self-start'>
                        Used technologies:
                      </p>
                      <div className='flex gap-1'>{projectTechnologies}</div>
                    </div>
                  )}

                  {projectDescription && (
                    <div className='flex flex-col gap-2'>
                      <p className='text-neutral-200 font-bold self-start'>
                        Project description:
                      </p>
                      <p className='text-neutral-200/70 text-justify'>
                        {projectDescription}
                      </p>
                    </div>
                  )}

                  {(linkDeploy || linkGitHub) && (
                    <div className='grid grid-cols-4 justify-center items-center'>
                      {linkDeploy && (
                        <Link
                          href={linkDeploy}
                          className='col-span-3 text-neutral-200 hover:cursor-pointer'
                          target='_blank'
                        >
                          <button className='p-3 rounded-sm bg-purple-600 w-full'>
                            View project
                          </button>
                        </Link>
                      )}
                      {linkGitHub && (
                        <Link
                          href={linkGitHub}
                          className='col-span-1 text-white/70 hover:cursor-pointer hover:text-purple-600 duration-200'
                          target='_blank'
                        >
                          <Icon
                            icon='simple-icons:github'
                            className='size-8 w-full'
                          />
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
