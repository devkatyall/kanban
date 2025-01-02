import Image from "next/image";
import React from "react";
import logo from "../../../public/vercel.svg";
import { Button } from "./button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-between items-center px-10 py-5 z-10 ring-1 ring-gray-700">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image alt="company logo" src={logo} width={20} height={20} />
          <span>WorkSpace</span>
        </div>
      </Link>

      <Button variant="outline">Log in</Button>
    </div>
  );
}
