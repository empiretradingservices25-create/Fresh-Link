// Agent Jawad & Ayoub : Logistique / Supply Chain, optimisation des flux, alertes et transport
import { AgentInterface, Proposal } from '../../AgentInterface';

export class JawadAyoubAgent implements AgentInterface {
  id = "jawad-ayoub";

  analyze(data: any): Proposal[] {
    // À surperformer : gestion flux, prévision, optimisation tournée, etc.
    return [
      {
        title: "Alerte sur stock critique",
        description: "Un ou plusieurs articles sont en stock très bas. Proposer une commande fournisseur.",
        recommendedAction: async () => {
          alert("Mail fournisseur envoyé !");
        }
      }
    ];
  }

  decide(proposals: Proposal[]): Proposal {
    return proposals[0];
  }
}