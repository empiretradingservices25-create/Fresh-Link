import { AgentBase, AgentContext, AgentDecision } from "./AgentBase";

export class OuraiAgent extends AgentBase {
  constructor() {
    super({
      name: "Ouraï",
      description: "Gère la paie, la conformit�� RH et la génération de bulletins PDF.",
      category: "HR",
      avatar: "/img/avatars/ourai.png"
    });
  }
  async analyzeAndDecide(context: AgentContext): Promise<AgentDecision> {
    let actions: string[] = [];
    if (context.lateSalary) actions.push("🔔 Alerte : retard de paie détecté !");
    if (context.checkLegal && !context.complianceOk) actions.push("⚖️ Vérifier la conformité légale RH.");
    if (context.pdfRequest) actions.push("📄 Générer un bulletin PDF.");
    return {
      summary: actions.length ? "Actions RH recommandées" : "Tout est conforme",
      actions,
      details: { analyseDate: context.date ?? new Date().toISOString() }
    };
  }
}
export default OuraiAgent;