'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavElement = {
  label: string;
  url: string;
};

const navElements: NavElement[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'My projects',
    url: '/projects',
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row justify-between border-b">
      <p className="px-6 py-4">anatole-dufour</p>
      <a href="mailto:anatole.duf@gmail.com" target="_blank" rel="noreferrer" className="border-l px-6 py-4 transition-colors hover:bg-border">
        _contact-me
      </a>
    </div>
  );
}
