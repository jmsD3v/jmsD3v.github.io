'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/data/project';
import Description from './description';
import { Icon } from '@iconify/react/dist/iconify.js';
import { technologies } from '@/data/technologies';
import Modal from '../modal';
import H2 from '../h2';

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = Project.filter((item) =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <div className='container'>
      <div className='flex flex-col justify-center items-center'>
        <H2 text='Projects' />
        <ul className='flex gap-5 text-neutral-200' data-aos='fade-up'>
          {[
            { key: 'all', small: 'All', large: 'All' },
            { key: 'web', small: 'Web', large: 'Web Applications' },
            { key: 'mobile', small: 'Mobile', large: 'Mobile Applications' },
            { key: 'api', small: 'API', large: 'APIs / Backends' },
          ].map((f) => (
            <li
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`cursor-pointer ${
                filter === f.key ? 'text-purple-600' : ''
              }`}
            >
              <span className='sm:hidden'>{f.small}</span>
              <span className='max-sm:hidden'>{f.large}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className='grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 p-10'
        data-aos='fade-up'
      >
        {filteredProjects
          .slice()
          .reverse()
          .map((item) => {
            const normalize = (s?: string | null) =>
              (s || '')
                .toString()
                .replace(/[^a-z0-9]/gi, '')
                .toLowerCase();

            const findTechFor = (pt?: string | null) =>
              technologies.find(
                (tec) =>
                  normalize(pt) === normalize(tec.name) ||
                  (tec.aliases || []).some(
                    (a: string) => normalize(a) === normalize(pt)
                  )
              );

            const techNodesForModal = (item.project_technologies || []).map(
              (pt, i) => {
                const found = findTechFor(pt);
                if (found) {
                  return (
                    <Icon
                      key={pt + '-' + i}
                      icon={found.icon}
                      className='size-10 border border-purple-600 text-purple-600 p-2 rounded-sm'
                    />
                  );
                }

                return (
                  <span
                    key={pt + '-' + i}
                    className='text-xs text-neutral-300 px-2 py-1 rounded-sm border border-neutral-700'
                  >
                    {pt}
                  </span>
                );
              }
            );

            const techNodesForCard = (item.project_technologies || []).map(
              (pt, i) => {
                const found = findTechFor(pt);
                if (found) {
                  return (
                    <Icon
                      key={pt + '-card-' + i}
                      icon={found.icon}
                      className='size-10 border border-purple-600 text-white p-2 rounded-sm'
                    />
                  );
                }

                return (
                  <span
                    key={pt + '-card-' + i}
                    className='text-xs text-neutral-300 px-2 py-1 rounded-sm border border-neutral-700'
                  >
                    {pt}
                  </span>
                );
              }
            );

            return (
              <Modal
                key={item.id}
                projectName={item.name}
                projectImage={item.image}
                linkDeploy={item.deploy}
                linkGitHub={item.github}
                projectType={item.type}
                projectTechnologies={techNodesForModal}
                projectDescription={item.description}
              >
                <div
                  className='h-full flex flex-col border border-purple-600 rounded-sm bg-[#353535] shadow-lg transition-transform duration-200 transform hover:-translate-y-1 hover:cursor-pointer overflow-hidden'
                  data-aos='fade-up'
                >
                  {item.type === 'design' ? (
                    <div className='relative w-full h-full'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-contain'
                      />
                    </div>
                  ) : (
                    <div className='w-full aspect-[16/9] overflow-hidden rounded-t-sm relative'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}

                  {item.type !== 'design' && (
                    <div className='flex flex-col p-3 gap-2 w-full flex-1 justify-between'>
                      {item.type === 'web' && (
                        <Description>Web Application</Description>
                      )}
                      {item.type === 'mobile' && (
                        <Description>Mobile Application</Description>
                      )}
                      <p className='text-neutral-200 self-start'>{item.name}</p>

                      <div className='flex flex-wrap gap-1'>
                        {techNodesForCard}
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            );
          })}

        {filteredProjects.length === 0 && (
          <p className='text-white'>No project found.</p>
        )}
      </div>
    </div>
  );
}
