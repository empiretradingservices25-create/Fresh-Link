// 🔷 Orchestrateur : fait travailler tous les agents ensemble

import { AgentInterface, Proposal } from './AgentInterface';
// Tu importeras chaque agent ici :
import { OuraiAgent } from './agents/ourai/OuraiAgent';
import { AyoubJawadAgent } from './agents/ayoub-jawad/AyoubJawadAgent';
import { AshelSimohammedAgent } from './agents/ashel-simohammed/AshelSimohammedAgent';
import { AzmiAgent } from './agents/azmi/AzmiAgent';
import { ZiziMustaphaAgent } from './agents/zizi-mustapha/ZiziMustaphaAgent';
import { HichamAgent } from './agents/hicham/HichamAgent';

// Liste de tous les agents actifs
export const agents: AgentInterface[] = [
  new OuraiAgent(),
  new AyoubJawadAgent(),
  new AshelSimohammedAgent(),
  new AzmiAgent(),
  new ZiziMustaphaAgent(),
  new HichamAgent(),
];

// Appel : tous les agents proposent des actions
export function getAllProposals(data: any): Proposal[] {
  return agents.flatMap(agent => agent.analyze(data));
}

// Arbitrage/decision
export function arbitrateDecisions(proposals: Proposal[]): Proposal {
  // Version simple : premier de la liste (démo débutant)
  return proposals[0];
}