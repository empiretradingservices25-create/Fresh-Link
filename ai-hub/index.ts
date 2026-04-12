export { ourai } from "./ourai";
export { jawadayoub } from "./jawad_ayoub";
export { ashelsimohammed } from "./ashel_simohammed";
export { azmi } from "./azmi";
export { zizimustapha } from "./zizi_mustapha";
export { hicham } from "./hicham";

// Pour routage générique :
export const agentRegistry = {
  ourai: require("./ourai").ourai,
  jawad_ayoub: require("./jawad_ayoub").jawadayoub,
  ashel_simohammed: require("./ashel_simohammed").ashelsimohammed,
  azmi: require("./azmi").azmi,
  zizi_mustapha: require("./zizi_mustapha").zizimustapha,
  hicham: require("./hicham").hicham
};