interface User {
  plafond?: number
  delaiRecouvrement?: string
  actif: boolean // <-- remove the "?"
  secteur?: string
  zone?: string
  objectifJournalierCA?: number
  objectifHebdomadaireCA?: number
  objectifMensuelCA?: number
  objectifJournalierClients?: number
  objectifMensuelClients?: number
  name: string
  nom: string
  role: import("@/lib/store").UserRole
  id: string
}
