export { ouraiAgent } from "./ourai";
export { jawadAyoubAgent } from "./jawad_ayoub";
export { ashelSimohammedAgent } from "./ashel_simohammed";
export { azmiAgent } from "./azmi";
export { ziziMustaphaAgent } from "./zizi_mustapha";
export { hichamAgent } from "./hicham";

// Pour un registre global si besoin :
export const agentRegistry = {
  ourai: require("./ourai").ouraiAgent,
  jawad_ayoub: require("./jawad_ayoub").jawadAyoubAgent,
  ashel_simohammed: require("./ashel_simohammed").ashelSimohammedAgent,
  azmi: require("./azmi").azmiAgent,
  zizi_mustapha: require("./zizi_mustapha").ziziMustaphaAgent,
  hicham: require("./hicham").hichamAgent
};
