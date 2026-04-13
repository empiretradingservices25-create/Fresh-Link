// Composant React « MediaListSupabase »
import SupabaseBadge from "@/components/SupabaseBadge";
// Liste les fichiers dans le bucket "medias" de Supabase Storage
// Affiche un lien de téléchargement pour chaque fichier, et une mini-prévisualisation si c’est une image

import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

type FileItem = { name: string; url: string };

export function MediaListSupabase() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      // Liste tous les fichiers dans le dossier "medias" du bucket
      const { data, error } = await supabase.storage.from("medias").list("", { limit: 100 });
      if (error || !data) {
        setFiles([]);
        setLoading(false);
        return;
      }

      // Pour chaque objet, obtenir l’URL publique
      const urls: FileItem[] = await Promise.all(
        data.map(async (f) => {
          const { data: urlData } = supabase.storage.from("medias").getPublicUrl(f.name);
          return { name: f.name, url: urlData.publicUrl };
        })
      );
      setFiles(urls);
      setLoading(false);
    }
    loadFiles();
  }, []);

  function isImage(filename: string) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  }

  return (
    <div>
      <h2>Liste des fichiers médias Supabase</h2>
      {loading && <p>Chargement...</p>}
      {!loading && files.length === 0 && <p>Aucun fichier</p>}
      <ul>
        {files.map((file) => (
          <li key={file.name} style={{ marginBottom: 18 }}>
            <a href={file.url} target="_blank" rel="noopener noreferrer" download>
              {file.name}
            </a>
            {isImage(file.name) && (
              <div>
                <img
                  src={file.url}
                  alt={file.name}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", marginTop: 4, border: "1px solid #ddd" }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !
