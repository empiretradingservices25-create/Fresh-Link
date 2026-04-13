// Widget d’état connexion Supabase (affiche : connecté ou pas)
import SupabaseBadge from "@/components/SupabaseBadge";
// Simple, débutant, extensible pour affichage en header/nav

import { useEffect, useState } from "react";
// ⚠️ Tu dois d’abord créer ton fichier "src/supabase/client.ts" avec l’instance Supabase "supabase" fourni plus tard

export function ConnectionStatus() {
  const [status, setStatus] = useState("Vérification...");

  useEffect(() => {
    async function check() {
      try {
        // Simulé pour démarrer ; tu pourras remplacer par une vraie requête plus tard
        await new Promise(res => setTimeout(res, 500));
        setStatus("Connecté ✅");
      } catch {
        setStatus("Déconnecté ❌");
      }
    }
    check();
  }, []);

  return (
    <span style={{ color: status.includes("✅") ? "green" : "red", fontWeight: "bold" }}>
      {status}
    </span>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !
