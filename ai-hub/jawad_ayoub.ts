// Jawad & Ayoub - Agents Logistique : Optimisation des flux, alertes stock critiques

import { getStockLevels, getLogisticsData } from "../services/logisticsService";

export async function jawadAyoubAgent(context: { action: string; data?: any }): Promise<any> {
  switch (context.action) {
    case "check_stock":
      const stocks = await getStockLevels();
      const critical = stocks.filter(s => s.qty < s.min);
      return {
        message: critical.length
          ? `⚠️ ${critical.length} article(s) sous le seuil critique`
          : "✅ Stock OK",
        details: critical
      };

    case "optimize_flow":
      const logistics = await getLogisticsData();
      // Exemple : Suggestion simple
      return {
        message: "Optimisation des itinéraires conseillée",
        suggestion: logistics.routes ? "Rerouter via dépôt central" : "Flux normal"
      };

    default:
      return { message: "Jawad & Ayoub : action inconnue." };
  }
}