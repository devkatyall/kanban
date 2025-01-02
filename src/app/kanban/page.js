import Kanban from "@/components/Kanban";
import Image from "next/image";

export default function Index() {
  return (
    <div className="">
      <h1 className=" px-4 font-normal text-gray-700 py-4">Dashboard / <span className=" text-white px-1"> Kanban Board</span></h1>
      <Kanban />
    </div>
  );
}