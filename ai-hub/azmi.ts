import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class AzmiAgent extends AgentBase {
  constructor() {
    super({
      name: "Azmi",
      description: "Veille trésorerie, contrôle santé financière, surveille marges.",
      category: "Finance",
      avatar: "/img/avatars/azmi.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.cashFlowCritical) actions.push("⚠️ Alerte : trésorerie critique !");
    if (context.marginLow) actions.push("📉 Proposer un contrôle des marges.");
    if (context.paymentLate) actions.push("🚩 Suivre les clients en retard de paiement.");
    return {
      summary: actions.length ? "Actions Finance recommandées" : "Situation saine",
      actions
    };
  }
}
export default AzmiAgent;