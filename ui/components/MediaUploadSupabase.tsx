// Composant React « Upload média Supabase »
// Permet de sélectionner et envoyer un ou plusieurs fichiers dans le bucket "medias" de Supabase Storage
// Nécessite que src/supabase/client.ts exporte bien "supabase" (cf. étapes précédentes)

import { useState } from "react";
import { supabase } from "../../supabase/client";

export function MediaUploadSupabase() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string[]>([]);

  async function handleUpload() {
    if (!files) return;
    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Donne un nom unique : dossier medias/ + timestamp + nom originel
      const filePath = `medias/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("medias").upload(filePath, file);
      if (error) {
        results.push(`❌ ${file.name} : ${error.message}`);
      } else {
        results.push(`✅ ${file.name} : uploadé avec succès !`);
      }
    }
    setStatus(results);
  }

  return (
    <div>
      <h2>Uploader des fichiers médias sur Supabase</h2>
      <input
        type="file"
        multiple
        onChange={e => setFiles(e.target.files)}
        style={{ marginBottom: 8 }}
      />
      <button onClick={handleUpload} disabled={!files}>Uploader</button>
      {status.length > 0 && (
        <ul>
          {status.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !