import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class JawadAyoubAgent extends AgentBase {
  constructor() {
    super({
      name: "Jawad & Ayoub",
      description: "Optimise les flux logistiques, détecte les ruptures et propose des itinéraires.",
      category: "Logistics",
      avatar: "/img/avatars/jawad_ayoub.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.criticalStock < 5) actions.push("🚨 Stock critique : déclencher un réapprovisionnement !");
    if (context.deliveryDelay) actions.push("🚐 Optimiser le planning des tournées.");
    if (context.routeChange) actions.push("🗺️ Proposition de nouvel itinéraire.");
    return {
      summary: actions.length ? "Actions logistiques recommandées" : "Flux optimal",
      actions
    };
  }
}
export default JawadAyoubAgent;