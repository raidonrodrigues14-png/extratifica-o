# 🩺 Portal APS — Estratificação de Risco na Atenção Primária

Plataforma web para **estratificação de risco, acompanhamento e gestão** de programas da Atenção Primária à Saúde (APS). Feita para enfermeiros, médicos e agentes de saúde das UBS, com painéis separados para o **gestor** da Secretaria de Saúde e para o **administrador** do sistema.

Desenvolvida em Alto Alegre do Maranhão (MA) e usada por equipes de saúde da família.

![HTML5](https://img.shields.io/badge/HTML5-JavaScript-E34F26?logo=html5&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

---

## 📋 Sumário

- [O que o sistema faz](#-o-que-o-sistema-faz)
- [Módulos clínicos](#-módulos-clínicos)
- [Painel do Gestor](#-painel-do-gestor)
- [Painel Admin](#-painel-admin-logins-e-cobrança)
- [Multiusuário, grupos e UBS](#-multiusuário-grupos-e-ubs)
- [Tecnologias](#-tecnologias)
- [Como instalar](#-como-instalar)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Segurança e LGPD](#-segurança-e-lgpd)
- [Próximos passos](#-próximos-passos)
- [Autor](#-autor)

---

## 🎯 O que o sistema faz

- Classifica cada paciente por **grau de risco**, de forma automática, a partir dos critérios de cada programa.
- Mostra **quem precisa de atenção agora**: retornos atrasados, consultas por vencer e pacientes de maior risco.
- Gera **mensagens de WhatsApp** prontas para convocar o paciente.
- Exporta listas em **Excel** e fichas em **PDF**, pela impressão do navegador.
- Entrega ao gestor um **painel de indicadores** por UBS, equipe, agente de saúde (ACS) e microárea.

## 🧩 Módulos clínicos

| Módulo | Para que serve |
|---|---|
| 🤰 **Gestantes** | Estratificação de risco gestacional, acompanhamento do pré-natal e do puerpério. |
| 🧒 **Crianças** | Estratificação de risco e acompanhamento do crescimento e da puericultura. |
| ❤️ **HAS / DM** | Hipertensos e diabéticos: risco cardiovascular, controle e retornos. |
| 👴 **Idosos** | Avaliação multidimensional e acompanhamento da pessoa idosa. |
| 🦷 **Saúde Bucal** | Classificação de risco e controle de retornos. |
| 🕊️ **Cuidados Paliativos** | Elegibilidade simplificada, escala SPICT-BR e abordagem paliativa completa, com folha de registro para impressão. |
| 📅 **Agenda** | Agenda de atendimentos por usuário, com importação e visão mensal. |

## 📊 Painel do Gestor

Página separada (`/gestor`), com **login próprio e somente leitura**. Só quem o administrador autorizou como gestor consegue ver os dados, e isso é garantido no banco de dados (RLS), não apenas na tela.

- Indicadores-chave, metas e leitura rápida dos pontos de atenção
- Evolução no tempo, risco por programa e retornos em atraso
- Filtros por **programa, UBS, equipe, ACS e microárea**, com detalhamento ao clicar
- Mapa de calor, ranking por equipe e relatório de qualidade dos dados
- Tabelas alternativas aos gráficos, tema claro/escuro, impressão e exportação para Excel

## 🛠️ Painel Admin (logins e cobrança)

Página separada (`/admin`), exclusiva do administrador do sistema:

- Lista de todos os logins com grupo, UBS, vencimento e situação
- **💰 Pago:** soma dias ao vencimento e registra o pagamento no histórico
- **⛔ Bloquear:** o login passa a ver a tela de pagamento
- Edição de grupo, UBS, equipes ESF e vencimento, sem precisar de SQL
- Resumo de quem está em dia, vencendo em 7 dias, vencido ou sem grupo

## 👥 Multiusuário, grupos e UBS

- **Cada profissional tem seu login.** O e-mail é interno, no formato `usuario@sistemaaps.local`.
- **Grupos:** logins do mesmo grupo (por exemplo, enfermeira e médica da mesma equipe) compartilham os mesmos pacientes. Logins de grupos diferentes não veem os dados uns dos outros.
- **Cobrança individual:** cada login tem o próprio vencimento. Se um paga e o outro não, só o que não pagou é bloqueado. Login sem data de vencimento usa o sistema normalmente.
- **UBS por grupo:** cada grupo é ligado a uma UBS do município e às equipes ESF dela. O nome da UBS e a lista de equipes aparecem certos em todos os módulos.

## 🧰 Tecnologias

- **Front-end:** HTML, CSS e JavaScript puro, em arquivos únicos (sem framework e sem etapa de build)
- **Back-end:** [Supabase](https://supabase.com/) (autenticação e PostgreSQL), com **Row Level Security** e funções `SECURITY DEFINER`
- **API serverless:** funções Node.js na [Vercel](https://vercel.com/) para os relatórios
- **Gráficos do painel:** SVG escrito à mão, sem bibliotecas
- **Exportação:** [SheetJS](https://sheetjs.com/) para Excel e impressão do navegador para PDF

## 🚀 Como instalar

**Pré-requisitos:** uma conta no Supabase e uma na Vercel (ou outra hospedagem de arquivos estáticos).

1. **Supabase:** crie um projeto e, no *SQL Editor*, rode os arquivos `.sql` desta pasta **nesta ordem**:
   1. Tabelas dos módulos e do multiusuário (`migracao_multiusuario.sql`, `assinaturas.sql` e os SQLs de cada módulo)
   2. `grupos_setup.sql`
   3. `novo_login.sql`
   4. `assinatura_individual.sql`
   5. `ubs_setup.sql`
   6. `gestor_setup.sql`
   7. `admin_setup.sql`
2. **Chaves:** no início do script de `index.html`, `gestor.html` e `admin.html`, informe a URL do projeto e a chave pública (*publishable/anon key*) do Supabase. **Nunca** coloque a chave de serviço (*service role*) no código.
3. **Administrador:** em *Authentication → Users*, crie o seu login (marque *Auto Confirm User*) e torne-o administrador:
   ```sql
   insert into public.admins(user_id)
   select id from auth.users where email = 'seu_usuario@sistemaaps.local';
   ```
4. **Publicação:** envie o repositório à Vercel. O `vercel.json` já define as rotas:

   | Endereço | Página |
   |---|---|
   | `/` | Sistema das equipes (`index.html`) |
   | `/gestor` | Painel do Gestor |
   | `/admin` | Painel Admin |

5. **Novo cliente:** crie o login no Supabase, abra `/admin`, clique em **Atualizar** e depois em **Editar** para definir grupo, UBS, equipes e vencimento.

## 📁 Estrutura do projeto

```
.
├── index.html          # Sistema das equipes (módulos clínicos e agenda)
├── gestor.html         # Painel do Gestor (somente leitura)
├── admin.html          # Painel Admin (logins e cobrança)
├── api.js              # API serverless
├── apicrianca.js       # Relatórios de crianças
├── apigestante.js      # Relatórios de gestantes
├── apireports.js       # Relatórios gerais
├── vercel.json         # Rotas e build
└── *.sql               # Scripts do banco (rodar no Supabase, na ordem acima)
```

## 🔒 Segurança e LGPD

Dados de saúde são **dados pessoais sensíveis**. O sistema foi desenhado com isso em mente:

- Isolamento por usuário e por grupo no próprio banco (RLS): o front-end não decide quem vê o quê.
- Painel do gestor somente leitura, com login separado do sistema das equipes.
- Bloqueio por assinatura verificado também no banco, não só na tela.
- Logout automático por inatividade nos painéis do gestor e do admin.

Para uso em produção, recomenda-se ainda: backups automáticos, registro de auditoria (quem criou, alterou ou apagou cada ficha), política de retenção de dados e contrato com a secretaria de saúde que defina as responsabilidades pelo tratamento.

> ⚠️ **Nunca** publique dados reais de pacientes neste repositório, em capturas de tela ou em demonstrações.

## 🗺️ Próximos passos

- [ ] Registro de auditoria e backup automático
- [ ] Equipe ESF obrigatória no cadastro e validação de CNS/CPF
- [ ] Cadastro de ACS por UBS
- [ ] Importação de pacientes por planilha
- [ ] Aplicativo instalável no celular (PWA)
- [ ] Aviso de vencimento da assinatura dentro do sistema

## 👤 Autor

Desenvolvido por **Raidon Rodrigues**, em Alto Alegre do Maranhão (MA).

[![GitHub](https://img.shields.io/badge/GitHub-raidonrodrigues14--png-181717?logo=github)](https://github.com/raidonrodrigues14-png)

---

<sub>Portal APS é um sistema de apoio à gestão do cuidado. Não substitui o julgamento clínico do profissional de saúde.</sub>
