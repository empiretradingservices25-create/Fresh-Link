import React, { useState } from "react";

// Processus disponibles
const PROCESSES = [
  { key: "logistics", label: "Logistique" },
  { key: "procurement", label: "Achats & Sourcing" },
  { key: "sales", label: "Ventes & Stratégie" },
  { key: "finance", label: "Finance & Trésorerie" },
  { key: "hr", label: "Ressources Humaines" },
  { key: "management", label: "Contrôle de gestion" },
];

// Lecture/écriture locale, à remplacer par un store global ou API plus tard
const getDefaults = () =>
  PROCESSES.reduce((acc, p) => {
    acc[p.key] = localStorage.getItem("ai_mode_" + p.key) === "AI";
    return acc;
  }, {} as Record<string, boolean>);

export default function ProcessManagement() {
  const [aiMode, setAiMode] = useState<Record<string, boolean>>(getDefaults());

  function toggle(key: string) {
    const newVal = !aiMode[key];
    setAiMode({ ...aiMode, [key]: newVal });
    localStorage.setItem("ai_mode_" + key, newVal ? "AI" : "Manual");
  }

  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl bg-white shadow border mt-8">
      <h2 className="font-bold text-lg mb-4 text-indigo-700">
        Gestion des processus & agents IA
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Active/Désactive le mode <b>IA autonome</b> ou manuel pour chaque module.
      </p>
      {PROCESSES.map(proc => (
        <div key={proc.key} className="flex items-center justify-between py-2 border-b last:border-b-0">
          <span className="font-semibold">{proc.label}</span>
          <button
            onClick={() => toggle(proc.key)}
            className={`px-4 py-1 rounded-full font-bold text-xs transition ${aiMode[proc.key]
              ? "bg-indigo-600 text-white shadow"
              : "bg-gray-200 text-gray-700"}`}
          >
            {aiMode[proc.key] ? "AI" : "Manuel"}
          </button>
        </div>
      ))}
      <p className="text-xs text-gray-400 mt-6">
        (Ce paramétrage est local pour le moment. À connecter à un store global ou base de données pour tous les utilisateurs si besoin.)
      </p>
    </div>
  );
}