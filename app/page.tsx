import Navbar from "@/components/navbar";
import React from "react";

export default function Page() {
  return (
    <div>
      {/* <Navbar /> */}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
        <i className="fas fa-person-digging" /> This site is being built
      </div>
    </div>
  );
}
