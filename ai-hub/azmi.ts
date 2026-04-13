import { getFinancialData } from "../services/financeService";

export async function azmiAgent(context: { action: string; data?: any }): Promise<any> {
  switch (context.action) {
    case "analyze_financials":
      const financial = await getFinancialData();
      const lowMargin = financial.margins.filter((m: any) => m < 0.1);
      return {
        message: lowMargin.length
          ? "⚠️ Marges faibles détectées"
          : "Marges dans la normale",
        details: lowMargin
      };
    case "cash_flow_alert":
      const f = await getFinancialData();
      return {
        message: f.cashFlow < 10000 ? "🚨 Trésorerie faible !" : "Cashflow OK"
      };
    default:
      return { message: "Azmi : action inconnue." };
  }
}
