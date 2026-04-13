export interface AgentContext {
  userId?: string;
  date?: string;
  [key: string]: any;
}
export interface AgentDecision {
  summary: string;
  actions: string[];
  details?: any;
}
export abstract class AgentBase {
  name: string;
  description: string;
  avatar?: string;
  category: string;
  abstract analyzeAndDecide(context: AgentContext): Promise<AgentDecision>;
  constructor(config: { name: string; description: string; category: string; avatar?: string }) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.avatar = config.avatar;
  }
}