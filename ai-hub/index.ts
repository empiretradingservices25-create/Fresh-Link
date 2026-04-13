import OuraiAgent from './Ourai';
import JawadAyoubAgent from './jawad_ayoub';
import AshelSimohammedAgent from './ashel_simohammed';
import AzmiAgent from './azmi';
import ZiziMustaphaAgent from './zizi_mustapha';
import HichamAgent from './hicham';

export const agents = [
  new OuraiAgent(),
  new JawadAyoubAgent(),
  new AshelSimohammedAgent(),
  new AzmiAgent(),
  new ZiziMustaphaAgent(),
  new HichamAgent(),
];

export function getAgentByCategory(category: string) {
  return agents.filter(agent => agent.category === category);
}