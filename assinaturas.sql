-- ============================================================
-- ASSINATURAS: acesso pago de 30 em 30 dias (R$100) por enfermeiro
-- Rode este script INTEIRO no SQL Editor do Supabase.
-- ============================================================

-- 1) Tabela de controle de vencimento por usuário
CREATE TABLE IF NOT EXISTS assinaturas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  vencimento DATE NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

-- Cada enfermeiro só pode LER o próprio vencimento (não pode alterar,
-- só você consegue mudar isso, pelo SQL Editor, que roda como admin)
DROP POLICY IF EXISTS "ve_somente_propria_assinatura" ON assinaturas;
CREATE POLICY "ve_somente_propria_assinatura" ON assinaturas
  FOR SELECT USING (auth.uid() = user_id);

-- 2) Sempre que uma conta nova for criada (painel ou SQL), gera
--    automaticamente 30 dias de acesso a partir de hoje
CREATE OR REPLACE FUNCTION criar_assinatura_novo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.assinaturas (user_id, vencimento)
  VALUES (NEW.id, (now() + interval '30 days')::date)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_assinatura ON auth.users;
CREATE TRIGGER on_auth_user_created_assinatura
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION criar_assinatura_novo_usuario();

-- 3) Cria os 30 dias iniciais para as contas que já existem hoje
--    (as que você já criou, incluindo a Ionara)
INSERT INTO assinaturas (user_id, vencimento)
SELECT id, (now() + interval '30 days')::date FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- Depois de confirmar o pagamento de um enfermeiro (PIX de R$100),
-- rode este comando trocando o e-mail, para liberar mais 30 dias:
--
-- UPDATE assinaturas
-- SET vencimento = (GREATEST(vencimento, CURRENT_DATE) + interval '30 days')::date
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'nomedeusuario@sistemaaps.local');
-- ============================================================
