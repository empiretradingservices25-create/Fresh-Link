// lib/useBestAIKey.ts
type AIKey = {
  id: number;
  name: string;
  type: string;
  key: string;
  active: boolean;
  module?: string;
};

export function getBestAIKey(module: string = ""): AIKey | null {
  let raw = [];
  try { raw = JSON.parse(localStorage.getItem("ai_keys") || "[]"); } catch {}
  const all: AIKey[] = Array.isArray(raw) ? raw : [];
  // 1. cherches la clé active et assignée au module
  let match = all.find(k => k.active && k.module === module);
  // 2. sinon, trouve une générale active
  if (!match) match = all.find(k => k.active && (!k.module || k.module === ""));
  // 3. sinon, prends la première active
  if (!match) match = all.find(k => k.active);
  // 4. sinon, null
  return match || null;
}

// BONUS : failover automatique, donne une liste d'ordre de secours
export function getFailoverAIKeys(module: string = ""): AIKey[] {
  let raw = [];
  try { raw = JSON.parse(localStorage.getItem("ai_keys") || "[]"); } catch {}
  const all: AIKey[] = Array.isArray(raw) ? raw : [];
  // Priorité : module, puis général, puis autres
  return [
    ...all.filter(k => k.active && k.module === module),
    ...all.filter(k => k.active && (!k.module || k.module === "")),
    ...all.filter(k => k.active && k.module && k.module !== module)
  ];
}