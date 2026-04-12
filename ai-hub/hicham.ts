// Hicham - Contrôle de Gestion : Audit KPI & validation processus

import { getKpiData, getProcessData } from "../services/controlService";

export async function hicham(context: { action: string; data?: any }): Promise<any> {
  switch (context.action) {
    case "audit_kpi":
      const kpi = await getKpiData();
      const crit = kpi.filter(k => k.value < k.target);
      return {
        message: crit.length
          ? `🔎 ${crit.length} KPI(s) en anomalie`
          : "Tous les KPI atteints",
        details: crit
      };

    case "process_validation":
      const process = await getProcessData();
      return {
        message: process.valid ? "Processus conforme ✅" : "🚩 Écarts à corriger",
        details: process
      };

    default:
      return { message: "Hicham : action inconnue." };
  }
}