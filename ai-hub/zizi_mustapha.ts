import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class ZiziMustaphaAgent extends AgentBase {
  constructor() {
    super({
      name: "Zizi & Mustapha",
      description: "Propose des stratégies commerciales et suit la concurrence.",
      category: "Sales",
      avatar: "/img/avatars/zizi_mustapha.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.marketDrop) actions.push("📊 Analyser les tendances du marché.");
    if (context.competitorDiscount) actions.push("🏷️ Proposer une action commerciale.");
    if (context.kpiFalling) actions.push("💡 Ajuster la stratégie pour atteindre les KPIs.");
    return {
      summary: actions.length ? "Actions Commerciales recommandées" : "Marché conforme",
      actions
    };
  }
}
export default ZiziMustaphaAgent;