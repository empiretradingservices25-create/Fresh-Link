"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SupabaseBadge() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("fl_users")
          .select("id")
          .limit(1);
        if (!cancelled) setIsConnected(!error);
      } catch {
        if (!cancelled) setIsConnected(false);
      }
    }
    check();
    const interval = setInterval(check, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <span
      style={{
        background: isConnected ? "#dcfce7" : "#fee2e2",
        color: isConnected ? "#16a34a" : "#b91c1c",
        fontWeight: 700,
        fontSize: "14px",
        borderRadius: "18px",
        padding: "4px 16px",
        border: 0,
        marginRight: 8,
        display: "inline-block",
      }}
      title={isConnected ? "Connecté à Supabase" : "Déconnecté de Supabase"}
    >
      ● {isConnected ? "En ligne" : "DB offline"}
    </span>
  );
}
