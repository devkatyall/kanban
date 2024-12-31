"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { format } from "date-fns";
import { CSS } from "@dnd-kit/utilities";
import React, { useMemo, useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import { Input } from "./input";
import { Label } from "./label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Button } from "./button";
import CalendarIcon from "../icons/CalendarIcon";
import { cn } from "@/lib/utils";

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  addTask,
  tasks,
  deleteTask,
  index,
}) {
  const [editMode, setEditMode] = useState(false);

  const [open, setOpen] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    priority: "",
    description: "",
    due: null,
    createdOn: null,
    createdBy: "Admin",
    colId: column.id,
  });

  function validation(taskData) {
    const { title, priority, description, due } = taskData;
    return title && priority && description && due;
  }

  function addingTask() {
    const fieldNotEmpty = validation(taskData);

    if (!fieldNotEmpty) return;

    if (fieldNotEmpty) {
      const task = { ...taskData, createdOn: new Date() };
      addTask(task);
      setOpen(false);
      console.log("task added");
      setTaskData({
        title: "",
        priority: "",
        description: "",
        due: null,
        createdOn: null,
        createdBy: "Admin",
        colId: column.id,
      });
    }
  }

  const taskId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" opacity-65 border-4 border-dashed border-spacing-4 border-rose-900 bg-slate-900 w-[310px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px] bg-slate-900 border-black">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add all the details required for your team to know. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 py-2 items-center">
          <div className="w-[70%] flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Title
            </Label>
            <Input
              required
              value={taskData.title}
              onChange={(e) =>
                setTaskData((prev) => ({ ...prev, title: e.target.value }))
              }
              id="name"
              autoComplete="off"
              className=" bg-black"
            />
          </div>
          <div className="w-[30%] flex flex-col gap-4">
            <Label htmlFor="priority" className="text-left">
              Priority
            </Label>
            <Select
              id="priority"
              className="bg-black"
              value={taskData.priority}
              onValueChange={(value) =>
                setTaskData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="bg-black">
                <SelectValue placeholder="Select.." />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectGroup>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Label htmlFor="username" className="text-left">
            Description
          </Label>
          <textarea
            id="username"
            className=" bg-black w-full min-h-[100px] max-h-[200px] p-3"
            value={taskData.description}
            onChange={(e) =>
              setTaskData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <Label htmlFor="calendar">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal flex items-center gap-2",
                  !taskData?.due && "text-muted-foreground"
                )}
              >
                <CalendarIcon />{" "}
                {taskData.due ? (
                  format(taskData.due, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                selected={taskData.due}
                onSelect={(date) =>
                  setTaskData((prev) => ({ ...prev, due: date }))
                }
                id="calendar"
                mode="single"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <button
            onClick={() => addingTask()}
            disabled={
              !(
                taskData.title &&
                taskData.description &&
                taskData.due &&
                taskData.priority
              )
            }
            className=" disabled:text-slate-600 disabled:stroke-slate-600 disabled:hover:fill-red-800 disabled:cursor-not-allowed stroke-white transition-all cursor-pointer flex items-center gap-2 border-slate-900 border-4 rounded-md px-4 py-3 hover:bg-black hover:text-green-500 active:bg-slate-800 hover:stroke-green-500"
            type="submit"
          >
            <PlusIcon />
            Add Task
          </button>
        </DialogFooter>
      </DialogContent>

      <div
        ref={setNodeRef}
        style={style}
        className={`bg-gray-900 w-[310px] h-[500px] max-h-[500px]
        `}
      >
        <div
          {...attributes}
          {...listeners}
          onClick={() => setEditMode(true)}
          className="

        h-[60px]
        text-md
        cursor-grab
        rounded-md
        rounded-b-none
        p-3 font-bold border-slate-900 border-4
        flex items-center justify-between
        "
        >
          <div className="flex gap-2 items-center transition-all text-md font-semibold">
            {!editMode && column.title}
            {editMode && (
              <input
                className="bg-slate-900 px-2 py-1 outline-none focus:border focus:border-rose-600 rounded"
                autoFocus
                onBlur={() => setEditMode(false)}
                value={column.title}
                onChange={(e) => updateColumn(column.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              />
            )}
            <div className=" flex justify-center items-center px-2 py-1 text-sm rounded-md text-gray-500">
              {tasks.length}
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-default">
            <button
              onClick={() => setOpen(true)}
              className=" stroke-green-600 transition-all cursor-pointer flex items-center gap-2 hover:text-rose-900 active:bg-slate-800 hover:stroke-green-500 py-3"
            >
              <PlusIcon />
            </button>
            <button
              onClick={() => deleteColumn(column.id)}
              className=" stroke-rose-900 hover:stroke-rose-500  rounded py-3"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>

        <SortableContext items={taskId}>
          <div className="flex flex-grow flex-col gap-3 px-2 py-3 overflow-x-hidden overflow-y-auto">
            {tasks.map((task) => (
              <TaskCard deleteTask={deleteTask} key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {/* column footer */}
      </div>
    </Dialog>
  );
}
