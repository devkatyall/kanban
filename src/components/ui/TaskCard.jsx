"use client";

import React, { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { Badge } from "./badge";
import { differenceInDays, format } from "date-fns";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, deleteTask }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isFocus, setFocused] = useState(false);
  const daysLeft = differenceInDays(new Date(task.due), new Date());
  const dueClassName =
    daysLeft > 7
      ? "text-green-800 border-green-800" // More than a week left
      : daysLeft > 3
      ? "text-blue-800 border-blue-800" // 4 to 7 days left
      : daysLeft > 0
      ? "text-red-800 border-red-800" // 1 to 3 days left
      : "text-gray-800 border-gray-800";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" opacity-60 relative transition-all bg-black px-2.5 py-4 min-h-[120px] text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-600 cursor-grab"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      className=" z-30 relative transition-all bg-black px-2.5 py-4 min-h-[120px] text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-600 cursor-grab"
    >
      <div className=" pr-12 pl-2">
        <div className=" flex flex-col ">
          <h2 className="text-md text-white">{task.title}</h2>
          <p className="text-sm text-gray-700">{task.description}</p>
        </div>
        <div className="py-2 flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`${
              task.priority === "medium" && "text-blue-800 border-blue-800"
            } ${task.priority === "low" && "text-green-800 border-green-800"} ${
              task.priority === "high" && "text-red-800 border-red-800"
            } text-xs font-semibold capitalize rounded-md`}
          >
            {task.priority}
          </Badge>
          <Badge
            variant="outline"
            className={`${dueClassName} text-xs font-semibold capitalize rounded-md`}
          >
            {format(task.due, "PPP")}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-semibold capitalize rounded-md border-slate-300 text-slate-300"
          >
            {task.createdBy}
          </Badge>
        </div>
      </div>
      {isFocus && (
        <button
          onClick={() => deleteTask(task.id)}
          className="opacity-65 hover:opacity-100 right-4 absolute top-1/2 -translate-y-1/2 stroke-rose-900 hover:stroke-rose-500 hover:bg-slate-900 rounded px-2 py-2"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
