'use client';

import SnakeGame, { ActiveArrows } from './snake-game';

export default function SnakeCard() {
  return (
    <div className="flex flex-row rounded-lg border border-[#0C1616] bg-gradient-to-br from-[#175553] to-[#43d9ac33] p-6 shadow-[inset_0px_2px_0px_0px_#ffffff3f] backdrop-blur-3xl">
      <SnakeGame />

      <div className="absolute -top-52 right-0 -z-10">{shadow1}</div>
      <div className="absolute -right-60 top-0 -z-10">{shadow2}</div>
    </div>
  );
}

const shadow1 = (
  <svg width="864" height="784" viewBox="0 0 864 784" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4" filter="url(#filter0_f_64_1236)">
      <path
        d="M673.469 258.482L689.984 477.861L655.759 582.726L485.295 609.598L413.003 448.57L297.588 487.343L184.059 311.368L174 177.746L452.567 174.828L523.099 285.846L673.469 258.482Z"
        fill="#43D9AD"
      />
    </g>
    <defs>
      <filter id="filter0_f_64_1236" x="0" y="0.827728" width="863.983" height="782.77" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="87" result="effect1_foregroundBlur_64_1236" />
      </filter>
    </defs>
  </svg>
);

const shadow2 = (
  <svg width="868" height="831" viewBox="0 0 868 831" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4" filter="url(#filter0_f_64_1235)">
      <path
        d="M477.946 656.519L264.032 605.132L174.663 540.469L201.226 369.957L376.649 350.391L375.041 228.647L577.309 174.392L707.602 205.691L625.165 471.797L497.892 504.987L477.946 656.519Z"
        fill="#4D5BCE"
      />
    </g>
    <defs>
      <filter id="filter0_f_64_1235" x="0.663574" y="0.391769" width="880.938" height="830.128" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="87" result="effect1_foregroundBlur_64_1235" />
      </filter>
    </defs>
  </svg>
);

export const Arrows = function (state: ActiveArrows) {
  return (
    <div className="mx-auto mt-4 grid grid-cols-3 grid-rows-2 justify-center justify-items-center gap-1">
      <div className="col-start-2">
        <svg width="51" height="30" viewBox="0 0 51 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.46094" y="1.46356" width="48.0787" height="27.6912" rx="7.5" fill={state.upArrowActive ? '#3C9D93' : '#010C15'} stroke="#1E2D3D" />
          <path d="M25.5 12.3091L29.75 18.3091H21.25L25.5 12.3091Z" fill="white" />
        </svg>
      </div>
      <div className="col-start-1 row-start-2">
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="49.0786"
            y="28.6547"
            width="48.0787"
            height="27.6912"
            rx="7.5"
            transform="rotate(-180 49.0786 28.6547)"
            fill={state.leftArrowActive ? '#3C9D93' : '#010C15'}
            stroke="#1E2D3D"
          />
          <path d="M22.0391 14.8091L28.0391 10.5591L28.0391 19.0592L22.0391 14.8091Z" fill="white" />
        </svg>
      </div>
      <div className="col-start-2 row-start-2">
        <svg width="51" height="30" viewBox="0 0 51 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="49.5391"
            y="28.6547"
            width="48.0787"
            height="27.6912"
            rx="7.5"
            transform="rotate(-180 49.5391 28.6547)"
            fill={state.downArrowActive ? '#3C9D93' : '#010C15'}
            stroke="#1E2D3D"
          />
          <path d="M25.5 17.8091L21.25 11.8091L29.75 11.8091L25.5 17.8091Z" fill="white" />
        </svg>
      </div>
      <div className="row-start-2">
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="49"
            y="28.6547"
            width="48.0787"
            height="27.6912"
            rx="7.5"
            transform="rotate(-180 49 28.6547)"
            fill={state.rightArrowActive ? '#3C9D93' : '#010C15'}
            stroke="#1E2D3D"
          />
          <path d="M27.9604 14.8091L21.9604 19.0592L21.9604 10.5591L27.9604 14.8091Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};
