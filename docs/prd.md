# PRD — Mentalidade

Documento de requisitos do produto.

## 1. Contexto e problema

Pessoas consomem vídeos inspiradores (Facebook, YouTube, Instagram, TikTok) sobre mentalidade, controle emocional e boas escolhas, mas:

- Os links se perdem no meio de conversas, salvos e histórico.
- Não há organização por tema nem curadoria.
- Falta um caminho prático que transforme o conteúdo consumido em **mudança real de comportamento**.

## 2. Objetivo do produto

Ser uma ferramenta pública e coletiva onde as pessoas **salvam, organizam, compartilham e importam** listas de vídeos por tema, apoiadas por ferramentas de desenvolvimento pessoal (metas, hábitos, diário e gamificação) que incentivam a ação contínua.

## 3. Público-alvo e personas

- **Curador** — gosta de descobrir e organizar conteúdo; cria trilhas de valor.
- **Estudante** — busca evoluir; importa trilhas prontas, segue pessoas e mantém hábitos.
- **Comunidade** — valida e ranqueia o conteúdo (curtidas, comentários, imports).

## 4. Proposta de valor

- **Organização por tema** — nada de links perdidos.
- **Curadoria coletiva** — as melhores listas sobem (Top Lists).
- **Importar e personalizar** — começar do trabalho de outro e adaptar ao seu.
- **Conteúdo → comportamento** — trilhas conectadas a metas e hábitos.

## 5. Escopo por fases

### MVP (v1)

**Autenticação e perfis**
- Cadastro/login com e-mail e senha (JWT + bcrypt).
- Perfil público em `@username` com bio e avatar.

**Vídeos / Links**
- Salvar link com título, tema, tags e nota pessoal.
- Detecção automática da plataforma e dos metadados (oEmbed quando disponível).
- Player embutido quando a plataforma permitir.

**Listas / Trilhas**
- Criar lista com título, descrição e tema.
- Adicionar, remover e reordenar itens.
- Visibilidade: privada, pública ou não-listada.

**Coletivo**
- Ver o perfil público de outros usuários e suas listas.
- **Importar lista** (fork) → cópia independente e editável.
- **Top Lists** por imports, curtidas e visualizações.
- Curtir e comentar listas.

**Descoberta**
- Busca e filtros por tema, tag e plataforma.

### Fase 2

- **Hábitos**: vincular hábito a um tema/trilha, check-in diário, streak e heatmap.
- **Metas**: objetivo, prazo, progresso e marcos.
- **Diário/Reflexões**: entradas vinculadas a vídeo/tema, com humor e visibilidade.
- **Gamificação**: XP, badges, nível e ranking de contribuição.
- **Feed social**: seguir usuários e acompanhar atividades.

### Fase 3

- Recomendações personalizadas, notificações, PWA, exportação (JSON/CSV) e moderação avançada.

## 6. Regras de negócio

- Uma lista importada é uma **cópia independente**: alterações no original não afetam a cópia.
- `importCount`, `likeCount` e `viewCount` só incrementam em listas **públicas**.
- Listas **privadas** não aparecem em perfis públicos, busca ou Top Lists.
- Um usuário só pode curtir uma mesma lista **uma vez**.
- Itens de lista guardam o **link cru + metadados** (sem transcrição).
- Apenas o dono edita/exclui sua lista, itens e comentários próprios.

## 7. Fluxos principais

**Salvar vídeo** → colar link → sistema detecta plataforma/metadados → escolhe tema/tags → salva.

**Criar lista** → nova lista → nome/tema/visibilidade → adicionar itens → ordenar → publicar.

**Importar lista** → abrir lista pública → "Importar" → gera cópia no perfil → personalizar.

**Check-in de hábito** → hoje → marcar feito → atualiza streak → pontua (+XP).

## 8. Requisitos não-funcionais

- Responsivo e acessível; animações com framer-motion.
- Acesso à API sempre via **hook** no frontend.
- Tipagem estrita (sem `any`); nomes em camelCase; comentários em pt-BR.
- Configurações sensíveis em `.env`.
- Documentação Swagger em `/api-docs`.

## 9. Métricas de sucesso

- Listas criadas e taxa de **import/fork** por lista.
- DAU/MAU e retenção.
- Streak médio de hábitos e metas concluídas.
- Contribuição por usuário (curtidas, imports, listas criadas).

## 10. Privacidade, moderação e LGPD

- Termos de uso e política de privacidade.
- Denúncia de conteúdo e ferramentas de moderação.
- Controle do usuário sobre visibilidade dos dados.
- Conformidade com a LGPD.

## 11. Riscos e Mitigações

| Risco | Mitigação |
| --- | --- |
| Conteúdo impróprio em ambiente público | Denúncia + moderação + termos |
| Links quebrados/plataformas que bloqueiam embed | Exibir link externo como fallback |
| Baixa retenção | Gamificação e hábitos vinculados ao conteúdo |
| Escopo grande | Entregas incrementais por fase (MVP primeiro) |
