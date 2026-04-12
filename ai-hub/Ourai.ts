// Ouraï - The HR/Payroll Agent

import { getHRData, getPayrollData, generatePayrollPDF } from "../services/hrService";

export async function ouraiAgent(context: { action: string; data?: any }): Promise<any> {
  switch(context.action) {
    case "analyze_payroll":
      const payrollData = await getPayrollData();
      // Analyze for compliance, errors, and recommend actions
      const anomalies = payrollData.filter(item => item.salary < 2000); // Example rule
      return {
        message: anomalies.length > 0
          ? `Attention: ${anomalies.length} payroll anomaly(ies) detected.`
          : "Payroll is compliant.",
        details: anomalies
      };

    case "generate_payroll_pdf":
      if (!context.data) throw new Error("Payroll details required.");
      const pdfPath = await generatePayrollPDF(context.data);
      return { message: "Payroll PDF generated.", path: pdfPath };

    // Add more actions: legal_audit, leave_analysis, etc.

    default:
      return { message: "Ouraï: Unknown action." };
  }
}