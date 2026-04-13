import { useState } from "react";

const MODULES = [
  { key: "", label: "Général (par défaut)" },
  { key: "logistics", label: "Logistique" },
  { key: "achat", label: "Achats" },
  { key: "sales", label: "Commercial" },
  { key: "finance", label: "Finance" },
  { key: "rh", label: "Ressources Humaines" },
  { key: "management", label: "Management/Contrôle" },
];

const LOCAL_KEY = "ai_keys";

type AIKey = {
  id: number;
  name: string;
  type: string;
  key: string;
  active: boolean;
  module: string;
};

function getKeys(): AIKey[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return [] }
}

export default function AIKeysManagement() {
  const [keys, setKeys] = useState<AIKey[]>(() => getKeys());
  const [form, setForm] = useState<Omit<AIKey, "id">>({
    name: "",
    type: "OpenAI",
    key: "",
    active: true,
    module: "",
  });

  function saveKeys(arr: AIKey[]) {
    setKeys(arr);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
  }

  function addKey() {
    if (!form.name || !form.key) return alert("Remplis tous les champs !");
    saveKeys([...keys, { ...form, id: Date.now() }]);
    setForm({ name: "", type: "OpenAI", key: "", active: true, module: "" });
  }
  function delKey(id: number) { saveKeys(keys.filter((k: AIKey) => k.id !== id)); }
  function toggleKey(id: number) {
    saveKeys(keys.map((k: AIKey) => k.id === id ? { ...k, active: !k.active } : k));
  }
  function setModForKey(id: number, module: string) {
    saveKeys(keys.map((k: AIKey) => k.id === id ? { ...k, module } : k));
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-2xl mt-8">
      <h2 className="font-bold text-lg mb-5 text-indigo-700">Gestion des clés IA & spécialités</h2>
      <table className="w-full text-sm mb-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Clé API</th>
            <th>Active</th>
            <th>Module</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k: AIKey) => (
            <tr key={k.id}>
              <td>{k.name}</td>
              <td>{k.type}</td>
              <td>
                <span style={{ letterSpacing: "1px" }}>
                  {k.key.slice(0,4)+"..."+k.key.slice(-4)}
                </span>
              </td>
              <td>
                <input type="checkbox" checked={k.active} onChange={() => toggleKey(k.id)} />
              </td>
              <td>
                <select
                  className="border rounded"
                  value={k.module}
                  onChange={e => setModForKey(k.id, e.target.value)}
                  style={{ minWidth: 90 }}
                >
                  {MODULES.map(mod => (
                    <option value={mod.key} key={mod.key}>{mod.label}</option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => delKey(k.id)} className="text-red-500 font-bold">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <input className="border p-2 rounded" placeholder="Nom (ex: GPT Achats, Gemini Logistique)"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <select className="border p-2 rounded" value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option>OpenAI</option>
          <option>Gemini</option>
          <option>Claude</option>
          <option>Azure</option>
          <option>Other</option>
        </select>
        <input className="border p-2 rounded" placeholder="Clé API (sk-... ou autre)"
          type="text" value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} />
        <div className="flex gap-2 items-center">
          <select
            className="border rounded"
            value={form.module}
            onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
            style={{ minWidth: 90, flex: 1 }}
          >
            {MODULES.map(mod => (
              <option value={mod.key} key={mod.key}>{mod.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 flex-1">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
            Active
          </label>
        </div>
        <button className="bg-indigo-600 text-white rounded px-4 py-2 mt-2" onClick={addKey}>
          Ajouter la clé IA
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Si une IA tombe en panne, le système basculera automatiquement sur une clé active du même module, ou par défaut.<br />
        Affecte un module pour spécialiser chaque IA (achat, logistique, etc) : maximum flexibilité et sécurité !
      </div>
    </div>
  );
}