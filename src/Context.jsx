"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
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

  return (
    <AppContext.Provider value={{ tasks, columns, setTasks, setColumns }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context is missing!");
  }

  return context;
};
