CREATE TABLE idosos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  cns TEXT,
  ubs TEXT,
  microarea TEXT,
  acs TEXT,
  telefone_acs TEXT,
  nascimento DATE,
  pontuacao INTEGER,
  risco TEXT CHECK (risco IN ('BAIXO','MODERADO','ALTO')),
  dimensoes_alteradas JSONB DEFAULT '[]',
  respostas JSONB DEFAULT '{}',
  data_avaliacao DATE,
  data_retorno DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE idosos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "idosos_allow_all" ON idosos
  FOR ALL USING (true) WITH CHECK (true);
