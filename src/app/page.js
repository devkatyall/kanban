import Kanban from "@/components/Kanban";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" h-[80vh] flex justify-center items-center">
      <Button>
        <Link href='/kanban' >
          Kanban
        </Link>
      </Button>
    </div>
  );
}
