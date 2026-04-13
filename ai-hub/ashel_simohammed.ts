import { getSuppliers, getPurchaseHistory } from "../services/procurementService";

export async function ashelSimohammedAgent(context: { action: string; data?: any }): Promise<any> {
  switch (context.action) {
    case "analyze_suppliers":
      const suppliers = await getSuppliers();
      const top = suppliers.sort((a: any, b: any) => b.score - a.score)[0];
      return {
        message: "Top fournisseur recommandé",
        supplier: top
      };

    case "auto_source":
      const history = await getPurchaseHistory();
      const candidates = history.filter((h: any) => h.price < 100);
      return {
        message: `Suggestion : ${candidates.length} opportunités à saisir`,
        details: candidates
      };

    default:
      return { message: "Ashel & Simohammed : action inconnue." };
  }
}
