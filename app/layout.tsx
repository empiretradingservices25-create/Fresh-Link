import "./globals.css";
import SupabaseBadge from "@/components/SupabaseBadge";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            borderBottom: "1px solid #eee",
            background: "#fff",
            gap: "16px"
          }}
        >
          {/* Mets ici les éléments que tu veux afficher dans la barre du haut */}
          {/* Exemples : <SupabaseBadge /> */}
        </header>
        {children}
      </body>
    </html>
    );
  }