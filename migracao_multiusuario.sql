-- ============================================================
-- MIGRAÇÃO: separar os pacientes por enfermeiro(a) logado(a)
-- Rode este script INTEIRO no SQL Editor do Supabase, DEPOIS
-- de criar as contas dos enfermeiros em Authentication > Users.
-- ============================================================

-- 1) Adiciona a coluna de "dono" em cada tabela
ALTER TABLE gestantes   ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE extratifica ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE idosos      ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE saudebucal  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE hasdm       ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2) A partir de agora, todo registro novo é automaticamente
--    marcado com o dono certo (quem estiver logado ao salvar)
ALTER TABLE gestantes   ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE extratifica ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE idosos      ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE saudebucal  ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE hasdm       ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 3) Atribui os registros já existentes (sem dono) à Ionara Raquel
--    IMPORTANTE: crie a conta dela primeiro (login "Ionara Raquel"
--    vira o e-mail abaixo automaticamente). Se usar outro usuário
--    de login para ela, ajuste o e-mail nesta seção.
UPDATE gestantes   SET user_id = (SELECT id FROM auth.users WHERE email = 'ionararaquel@sistemaaps.local') WHERE user_id IS NULL;
UPDATE extratifica SET user_id = (SELECT id FROM auth.users WHERE email = 'ionararaquel@sistemaaps.local') WHERE user_id IS NULL;
UPDATE idosos      SET user_id = (SELECT id FROM auth.users WHERE email = 'ionararaquel@sistemaaps.local') WHERE user_id IS NULL;
UPDATE saudebucal  SET user_id = (SELECT id FROM auth.users WHERE email = 'ionararaquel@sistemaaps.local') WHERE user_id IS NULL;
UPDATE hasdm       SET user_id = (SELECT id FROM auth.users WHERE email = 'ionararaquel@sistemaaps.local') WHERE user_id IS NULL;

-- 4) Remove as políticas antigas (que liberavam os dados pra todo mundo)
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname, tablename FROM pg_policies
    WHERE tablename IN ('gestantes','extratifica','idosos','saudebucal','hasdm')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 5) Garante que a segurança por linha (RLS) está ativa em todas
ALTER TABLE gestantes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE extratifica ENABLE ROW LEVEL SECURITY;
ALTER TABLE idosos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE saudebucal  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hasdm       ENABLE ROW LEVEL SECURITY;

-- 6) Cria as novas políticas: cada enfermeiro(a) só vê e edita
--    os próprios pacientes, mesmo que tente pelo console do navegador
CREATE POLICY "somente_dono" ON gestantes   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "somente_dono" ON extratifica FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "somente_dono" ON idosos      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "somente_dono" ON saudebucal  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "somente_dono" ON hasdm       FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
