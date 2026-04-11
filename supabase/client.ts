// Fichier d'initialisation du client Supabase
// Sert à connecter ton front à la base de données Supabase
import { createClient } from '@supabase/supabase-js';

// Mets ici l'URL de ton instance Supabase et la clé publique (anonyme)
export const supabase = createClient(
  'https://nxirypguonnrusegpmke.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aXJ5cGd1b25ucnVzZWdwbWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDQ3OTcsImV4cCI6MjA5MTEyMDc5N30.zrYG0ZnXFgNoV4vRbqjTEn54MCkAie6NSgTKKufRKA4' // à remplacer par la vraie clé depuis ton dashboard Supabase
);
// Tu peux copier ce code dans ce fichier maintenant !