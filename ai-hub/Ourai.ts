// Ouraï - Agent RH/Paie

import { getHRData, getPayrollData, generatePayrollPDF } from "../services/hrService";

export async function ouraiAgent(context: { action: string; data?: any }): Promise<any> {
  switch(context.action) {
    case "analyze_payroll":
      const payrollData = await getPayrollData();
      const anomalies = payrollData.filter((item: any) => item.salary < 2000); // Typage "any" pour debug débutant
      return {
        message: anomalies.length > 0
          ? `Attention: ${anomalies.length} anomalie(s) sur la paie.`
          : "Paie conforme.",
        details: anomalies
      };
    case "generate_payroll_pdf":
      if (!context.data) throw new Error("Détails obligatoires.");
      const pdfPath = await generatePayrollPDF(context.data);
      return { message: "PDF paie généré.", path: pdfPath };
    default:
      return { message: "Ouraï : action inconnue." };
  }
}
