// Composant React « Import Média Universel »
// Permet à l’utilisateur de sélectionner/drag-&-drop un ou plusieurs fichiers (CSV, image…)
// Affiche la liste des fichiers sélectionnés (nom, taille). Extensible pour upload plus tard.

import { useState } from "react";

export function MediaImport() {
  const [files, setFiles] = useState<FileList | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
  }

  return (
    <div>
      <h2>Importer un ou plusieurs fichiers</h2>
      <input
        type="file"
        multiple
        onChange={handleChange}
        style={{ marginBottom: 8 }}
      />
      {files && (
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>
              {file.name} ({Math.round(file.size / 1024)} Ko)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !
