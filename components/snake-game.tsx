'use client';

import React, { useState, useEffect } from 'react';
import { Arrows } from './snake-card';

export type ActiveArrows = { upArrowActive?: boolean; downArrowActive?: boolean; leftArrowActive?: boolean; rightArrowActive?: boolean };

export default function SnakeGame() {
  const [activeArrows, setActiveArrows] = useState<ActiveArrows>({
    downArrowActive: false,
    leftArrowActive: false,
    rightArrowActive: false,
    upArrowActive: false,
  });
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('up');

  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'z':
          setActiveArrows((prev) => ({ ...prev, upArrowActive: true }));
          setDirection('up');
          break;
        case 'ArrowDown':
        case 's':
          setActiveArrows((prev) => ({ ...prev, downArrowActive: true }));
          setDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'q':
          setActiveArrows((prev) => ({ ...prev, leftArrowActive: true }));
          setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
          setActiveArrows((prev) => ({ ...prev, rightArrowActive: true }));
          setDirection('right');
          break;
      }
    }

    function keyUpHandler(e: globalThis.KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'z':
          setActiveArrows((prev) => ({ ...prev, upArrowActive: false }));
          break;
        case 'ArrowDown':
        case 's':
          setActiveArrows((prev) => ({ ...prev, downArrowActive: false }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'q':
          setActiveArrows((prev) => ({ ...prev, leftArrowActive: false }));
          break;
        case 'ArrowRight':
        case 'd':
          setActiveArrows((prev) => ({ ...prev, rightArrowActive: false }));
          break;
      }
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return (
    <>
      <div>{direction}</div>

      <div className="flex flex-col">
        <div className="rounded-lg bg-[#0114232f] p-3 text-white">
          <p>{'// use keyboard'}</p>
          <p>{'// arrows to play'}</p>
          <Arrows {...activeArrows} />
        </div>
      </div>
    </>
  );
}
