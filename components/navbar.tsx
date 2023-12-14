"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavElement = {
  label: string;
  url: string;
};

const navElements: NavElement[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "My projects",
    url: "/projects",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row justify-center my-4 gap-10">
      {navElements.map((e, i) => (
        <Link
          className={`${
            pathname === e.url
              ? "text-foreground"
              : "text-foreground/70 hover:text-foreground/90"
          } transition-colors`}
          key={i}
          href={e.url}
        >
          {e.label}
        </Link>
      ))}
    </div>
  );
}
