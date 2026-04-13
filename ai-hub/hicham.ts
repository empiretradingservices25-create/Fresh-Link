import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class HichamAgent extends AgentBase {
  constructor() {
    super({
      name: "Hicham",
      description: "Audit tous les KPIs, propose des actions préventives/process.",
      category: "ManagementControl",
      avatar: "/img/avatars/hicham.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.kpiOutOfBound) actions.push("🧐 Déclencher un audit KPI immédiat.");
    if (context.processDrift) actions.push("🔍 Contrôler le respect des processus.");
    if (context.needProcessUpdate) actions.push("🛠️ Proposer une mise à jour de process.");
    return {
      summary: actions.length ? "Actions Contrôle de Gestion" : "Tous KPIs conformes",
      actions
    };
  }
}
export default HichamAgent;