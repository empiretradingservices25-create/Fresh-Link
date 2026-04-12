// Azmi - DAF : Suivi financier, marge, trésorerie

import { getFinancialData } from "../services/financeService";

export async function azmi(context: { action: string; data?: any }): Promise<any> {
  switch (context.action) {
    case "analyze_financials":
      const financial = await getFinancialData();
      const lowMargin = financial.margins.filter(m => m < 0.1);
      return {
        message: lowMargin.length
          ? "⚠️ Marges faibles détectées"
          : "Marges dans la normale",
        details: lowMargin
      };

    case "cash_flow_alert":
      return {
        message: financial.cashFlow < 10000
          ? "🚨 Trésorerie faible ! Vérifier les rentrées/sorties"
          : "Cashflow OK"
      };

    default:
      return { message: "Azmi : action inconnue." };
  }
}