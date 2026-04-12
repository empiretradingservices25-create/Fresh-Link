// Exemple de dashboard ERP affichant tous tes modules principaux
import { ConnectionStatus } from "./ui/components/ConnectionStatus";
import { AIConfig } from "./settings/AIConfig";
import { ProcessSettings } from "./components/settings/ProcessManagement";
import { MediaImport } from "./ui/components/MediaImport";
import { MediaUploadSupabase } from "./ui/components/MediaUploadSupabase";
import { MediaListSupabase } from "./ui/components/MediaListSupabase";

export default function App() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h1>Fresh-Link ERP - Demo Dashboard</h1>
      <ConnectionStatus />
      <AIConfig />
      <ProcessSettings />
      <MediaImport />
      <MediaUploadSupabase />
      <MediaListSupabase />
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !