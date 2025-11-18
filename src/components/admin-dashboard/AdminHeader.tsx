import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const AdminHeader = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [adminName] = useState("Administrador");
  const [date] = useState(new Date().toLocaleDateString("es-MX", { weekday: "long", month: "long", day: "numeric" }));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-[var(--color-card)] p-4 rounded-xl shadow-md">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Bienvenido, {adminName}</h1>
        <p className="text-sm text-gray-500 capitalize">{date}</p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
        >
          {theme === "light" ? (
            <MoonIcon className="w-6 h-6 text-primary" />
          ) : (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          )}
        </button>
      </div>
    </header>
  );
};
