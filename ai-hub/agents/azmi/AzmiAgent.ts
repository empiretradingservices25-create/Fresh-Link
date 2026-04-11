// Agent Azmi : Directeur financier, analyse santé financière, marge, trésorerie
import { AgentInterface, Proposal } from '../../AgentInterface';

export class AzmiAgent implements AgentInterface {
  id = "azmi";

  analyze(data: any): Proposal[] {
    // Ici tu ajoutes la logique : analyse marge, cash-flow, alertes budgétaires
    return [
      {
        title: "Prévision de trésorerie",
        description: "Le solde de trésorerie risque d’être négatif dans 30 jours.",
        recommendedAction: async () => {
          alert("Rapport de prévision envoyé à la direction !");
        }
      }
    ];
  }

  decide(proposals: Proposal[]): Proposal {
    return proposals[0];
  }
}