// Agent Hicham (Contrôle de gestion – Audit et validation des processus/kpi)

import { AgentInterface, Proposal } from '../../AgentInterface';

export class HichamAgent implements AgentInterface {
  id = "hicham";

  analyze(data: any): Proposal[] {
    // Exemple : Audit de processus ou contrôle de cohérence de kpi.
    return [
      {
        title: "Audit des processus métier",
        description: "Certaines étapes du workflow n’ont pas été validées.",
        recommendedAction: async () => {
          alert("Audit terminé – rapport envoyé.");
        }
      }
    ];
  }
  decide(proposals: Proposal[]): Proposal {
    return proposals[0];
  }
}
// Tu peux copier ce code dans ce fichier maintenant !