-- Schéma de base ERP pour Supabase/PostgreSQL

-- Table des employés (ressources humaines)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  lastname TEXT NOT NULL,
  firstname TEXT NOT NULL,
  role TEXT,
  contract_type TEXT,
  salary NUMERIC,
  hire_date DATE,
  legal_documents JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Table stock (exemple gestion inventaire)
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_name TEXT,
  sku TEXT,
  quantity NUMERIC,
  price NUMERIC,
  supplier_id INTEGER,
  updated_at TIMESTAMP DEFAULT now()
);

-- Table ventes/opportunités commerciales
CREATE TABLE sales_opportunities (
  id SERIAL PRIMARY KEY,
  lead_name TEXT,
  opportunity_value NUMERIC,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);
-- Tu peux copier ce code dans ce fichier maintenant !