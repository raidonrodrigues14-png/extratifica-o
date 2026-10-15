-- Corrige o erro "Could not find the 'condicoes_alto_risco' column of 'hasdm'"
-- Execute no SQL Editor do Supabase

ALTER TABLE hasdm ADD COLUMN IF NOT EXISTS condicoes_alto_risco text[];

-- Garante que as demais colunas de checkbox também existam (caso alguma falte)
ALTER TABLE hasdm ADD COLUMN IF NOT EXISTS estratificadores_risco text[];
ALTER TABLE hasdm ADD COLUMN IF NOT EXISTS dasc text[];
ALTER TABLE hasdm ADD COLUMN IF NOT EXISTS eventos_clinicos text[];
ALTER TABLE hasdm ADD COLUMN IF NOT EXISTS fatores_risco text[];

-- Recarrega o cache de schema do PostgREST
NOTIFY pgrst, 'reload schema';
