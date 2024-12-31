"use client";

import PlusIcon from "./icons/PlusIcon";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ColumnContainer from "./ui/ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./ui/TaskCard";

export default function Kanban() {
  const [tasks, setTasks] = useState([]);

  const [columns, setColumns] = useState([
    { id: 2231, title: "To-Do" },
    { id: 2938, title: "In Progress" },
    { id: 8282, title: "Completed" },
  ]);

  useEffect(() => {
    const savedColumns = localStorage.getItem("columns");
    const savedTasks = localStorage.getItem("tasks");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns)); // Parse and set the saved columns
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState();

  const [activeTask, setActiveTask] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div
      className="
        flex
        w-full
        overflow-x-auto
        overflow-y-hidden
        px-4 pb-10
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex py-1 gap-4">
          <div className=" flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col, index) => (
                <ColumnContainer
                  key={col.id}
                  deleteColumn={deleteColumn}
                  column={col}
                  index={index}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.colId === col.id)}
                  addTask={createTask}
                  deleteTask={deleteTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => addColumn()}
            className="
            h-[60px]
            w-[310px]
            bg-slate-900
            text-white
            p-4
            ring-rose-500
            hover:ring-2
            cursor-pointer
            transition-all
            flex items-center
            gap-4 stroke-white
            "
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        {activeColumn || activeTask
          ? createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    addTask={createTask}
                    tasks={tasks.filter(
                      (task) => task.colId === activeColumn.id
                    )}
                    deleteTask={deleteTask}
                  />
                )}
                {activeTask && (
                  <TaskCard task={activeTask} deleteTask={deleteTask} />
                )}
              </DragOverlay>,
              document.body
            )
          : null}
      </DndContext>
    </div>
  );

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);

    setTasks(newTasks);
  }

  function createTask(data) {
    const newTask = {
      ...data,
      id: generateId(),
    };

    setTasks([...tasks, newTask]);
    console.log("task added", newTask);
  }

  function updateColumn(id, title) {
    const newColumn = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumn);
  }

  function onDragStart(event) {
    console.log("Drag start event:", event);
    if (event.active.data.current.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      setActiveTask(null);
      return;
    }

    if (event.active.data.current.type === "Task") {
      setActiveTask(event.active.data.current.task);
      setActiveColumn(null);
      return;
    }
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteColumn(id) {
    const filteredColumn = columns.filter((col) => col.id !== id);
    setColumns(filteredColumn);

    const newTasks = tasks.filter((t) => t.colId !== id);
    setTasks(newTasks);
  }

  function addColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Click to Edit`,
    };

    setColumns([...columns, columnToAdd]);
    console.log(columns);
  }

  function onDragEnd(event) {
    const { active, over } = event;
    if (!active) return;

    const activeColumnId = active?.id;
    const overColumnId = over?.id;

    if (!activeColumnId || !overColumnId) return;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].colId = tasks[overIndex].colId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].colId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}
