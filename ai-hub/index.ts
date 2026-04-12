export { ouraiAgent } from "./ourai";
export { jawadAyoubAgent } from "./jawad_ayoub";
export { ashelSimohammedAgent } from "./ashel_simohammed";
export { azmiAgent } from "./azmi";
export { ziziMustaphaAgent } from "./zizi_mustapha";
export { hichamAgent } from "./hicham";

// Pour routage générique :
export const agentRegistry = {
  ourai: require("./ourai").ourai,
  jawad_ayoub: require("./jawad_ayoub").jawadayoub,
  ashel_simohammed: require("./ashel_simohammed").ashelsimohammed,
  azmi: require("./azmi").azmi,
  zizi_mustapha: require("./zizi_mustapha").zizimustapha,
  hicham: require("./hicham").hicham
};