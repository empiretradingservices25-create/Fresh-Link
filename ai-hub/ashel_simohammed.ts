import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class AshelSimohammedAgent extends AgentBase {
  constructor() {
    super({
      name: "Ashel & Simohammed",
      description: "Analyse les fournisseurs et optimise les achats.",
      category: "Procurement",
      avatar: "/img/avatars/ashel_simohammed.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.supplierOutOfStock) actions.push("🏷️ Proposer un fournisseur alternatif.");
    if (context.pricesTrends) actions.push("💰 Optimiser les volumes d’achat via l'analyse prix.");
    if (context.automateSourcing) actions.push("🤖 Automatiser le sourcing pour ce produit.");
    return {
      summary: actions.length ? "Actions Achats recommandées" : "Approvisionnement optimal",
      actions
    };
  }
}
export default AshelSimohammedAgent;