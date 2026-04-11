// Composant Paramétrage des Étapes de Process Métiers (workflow dynamique)
// Permet d’activer/désactiver manuellement chaque étape clé métier (toggle on/off)

import { useState } from "react";

const defaultSteps = [
  { key: "deliveryNoteValidation", label: "Validation des bons de livraison", manual: true },
  { key: "paymentValidation", label: "Validation des paiements", manual: false },
  { key: "inventoryCheck", label: "Contrôle inventaire", manual: true }
  // Tu pourras en ajouter d’autres selon ton métier !
];

export function ProcessSettings() {
  const [steps, setSteps] = useState(defaultSteps);

  function toggleStep(key: string) {
    setSteps((steps) =>
      steps.map((s) =>
        s.key === key ? { ...s, manual: !s.manual } : s
      )
    );
  }

  return (
    <div>
      <h2>Réglage des étapes process métier</h2>
      {steps.map((step) => (
        <div key={step.key}>
          <label>{step.label}</label>
          <input type="checkbox" checked={step.manual} onChange={() => toggleStep(step.key)} />
          <span>{step.manual ? "Manuel" : "Automatique"}</span>
        </div>
      ))}
    </div>
  );
}
// Tu peux copier ce code dans ce fichier maintenant !