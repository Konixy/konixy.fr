import SnakeGame from '@/components/snake-card';
import React from 'react';

export default function Page() {
  return (
    <div className="absolute top-1/2 flex w-full -translate-y-1/2 flex-row items-center justify-center gap-32">
      <div className="flex flex-col gap-20">
        <div className="flex flex-col gap-1">
          <p className="text-lg text-white">Hello, I am</p>
          <p className="text-6xl text-white">Anatole Dufour</p>
          <p className="text-3xl text-[#4D5BCE]">{'>'} Student in IT</p>
        </div>
        <div>
          <p>{'// complete the game to continue'}</p>
          <p>{'// you can also see it on my Github page:'}</p>
          <p>
            <span className="text-[#4D5BCE]">const</span> <span className="text-[#43D9AD]">githubLink</span> <span className="text-white">=</span>{' '}
            <span className="text-[#E99287]">
              &quot;
              <a href="https://github.com/Konixy/konixy.fr" target="_blank" rel="noreferrer" className="hover:underline">
                https://github.com/Konixy/konixy.fr
              </a>
              &quot;
            </span>
          </p>
        </div>
      </div>
      <SnakeGame />
    </div>
  );
}
