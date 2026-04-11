// 🔷 Interface générique pour tous les agents (débutant friendly)
export interface Proposal {
  title: string;
  description: string;
  recommendedAction: () => Promise<void>;
}

export interface AgentInterface {
  id: string; // identifiant unique de l'agent
  analyze(data: any): Proposal[]; // l’agent analyse les données et propose des actions
  decide(proposals: Proposal[]): Proposal; // l’agent décide quelle proposition exécuter
}