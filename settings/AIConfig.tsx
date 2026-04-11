// Composant de gestion des clés API IA (IAConfig).
// Permet de saisir/sauver une clé API IA (OpenAI, etc.) dans le localStorage du navigateur.

import { useState } from "react";

export function AIConfig() {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("ai_api_key") ?? ""
  );

  function saveKey() {
    localStorage.setItem("ai_api_key", apiKey);
    alert("Clé API sauvegardée localement !");
  }

  return (
    <div>
      <h2>Configuration API IA</h2>
      <label>Votre clé API OpenAI ou autre :</label>
      <input
        type="password"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="sk-...etc"
      />
      <button onClick={saveKey}>Sauver</button>
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !