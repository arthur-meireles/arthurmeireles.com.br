# Levantamento funcional — proposta de sistema

## Leitura da conversa

Este documento é uma **transcrição interpretativa para levantamento de requisitos**, não uma ata literal. Ele cruza a fala com as telas mostradas no vídeo e separa:

- **Confirmado:** dito claramente na chamada ou visível nas telas.
- **A validar:** necessidade provável, mas sem decisão final de escopo, regra ou integração.
- **Backlog:** desejável, porém citado como posterior ou opcional para a primeira versão.

### Síntese executiva

O sistema proposto deve substituir a operação hoje fragmentada entre quadros, planilhas e comunicação avulsa por uma plataforma única. A unidade central é o **caso/projeto**: a partir dela devem se conectar cliente, proposta, atividades, responsáveis, arquivos, aprovações, faturamento, pagamentos de freelancers, histórico e indicadores.

O objetivo não é apenas reproduzir um kanban. É evitar cópias manuais e automações frágeis entre comercial, projetos, financeiro e administrativo, mantendo cada área com a visão e as permissões adequadas.

## Linha da conversa

| Trecho aproximado | Tema levantado |
|---|---|
| 00:37–04:29 | Fluxo de casos, visão consolidada, funil comercial e ligação entre projeto, tarefas e financeiro. |
| 05:03–15:30 | Planilhas, migração/importação, dados financeiros, perfis de acesso, freelancers, portal de cliente e dashboards. |
| 15:35–23:51 | Capacidade do time, automações de pagamento, proposta aprovada para faturamento, registro central e arquivamento. |
| 24:00–31:15 | Indicadores, sprint/backlog, calendário editorial, aprovação de conteúdo e integrações sociais. |
| 31:15–53:49 | Priorização do MVP, portal mínimo do cliente, agenda/reuniões, carga de trabalho, segurança, armazenamento e hospedagem. |

## Modelo operacional-alvo

```text
Cliente + contatos
        │
        └── Caso / Projeto (registro central)
              ├── Proposta e etapa comercial
              ├── Tarefas, cronograma, responsáveis e capacidade
              ├── Arquivos, versões, comentários e histórico
              ├── Aprovação do cliente
              ├── Faturamento, NF, recebimento e contas a pagar
              ├── Freelancer e pagamento vinculado
              └── Indicadores e relatórios
```

## Funcionalidades levantadas

| Módulo | Funcionalidades | Evidência | Prioridade sugerida |
|---|---|---|---|
| Cadastro de clientes | Cliente, CNPJ, múltiplos responsáveis/contatos, usuários vinculados, histórico de projetos e documentos financeiros. | Confirmado | MVP |
| Caso/projeto central | Criar um registro único com dados, status, proposta, responsáveis, arquivos, comentários, histórico e referências financeiras. | Confirmado | MVP |
| Comercial e propostas | Funil de possíveis casos, propostas e vendas; prazo e subtarefas para preparar proposta; visualização da etapa e próximos passos. | Confirmado | MVP |
| Conversão comercial | Ao aprovar a proposta, avançar o caso para vendas/projeto e iniciar ou alimentar faturamento sem recadastro manual. | Confirmado | MVP |
| Execução do projeto | Fluxo: entrada do caso → roteiro → ajustes de roteiro → cliente → design → ajustes de design → validação do cliente → concluído. | Confirmado como fluxo atual | MVP |
| Kanban, listas e tarefas | Quadros configuráveis, colunas/status, subtarefas, prioridades, prazos, pessoas, filtros e visão individual de trabalho. | Confirmado | MVP |
| Planejamento e capacidade | Cronograma, sprint/backlog, distribuição de tarefas, visão por pessoa/freelancer, disponibilidade e acompanhamento de atrasos. | Confirmado | MVP |
| Arquivos e colaboração | Anexos, documentos, identidade visual/manual, versões, comentários, conversa vinculada ao projeto e histórico de movimentações. | Confirmado | MVP |
| Portal do cliente | Acesso apenas aos próprios projetos; consulta de documentos, comentários/chat, histórico, métricas e, conforme permissão, financeiro. | Confirmado como desejável | MVP condicionado |
| Área do freelancer | Acesso restrito aos projetos e materiais atribuídos; tarefas, prazos, alertas, comentários e comunicação, sem financeiro ou dados sensíveis. | Confirmado | MVP |
| Faturamento e recebimentos | Valor, imposto, proposta, emissão de NF, previsão de recebimento, entradas mensais e contas a receber ligados ao projeto. | Confirmado | MVP |
| Contas a pagar / freelancers | Cadastro de prestador e dados de pagamento; valores a pagar, status, observações e totais. | Confirmado | MVP |
| Automação de freelancer | Encerramento do projeto solicita NF/dados; resposta alimenta fila de pagamento; sistema confere valor acordado x informado. | Confirmado | MVP |
| Regra de pagamento | Freelancer é pago no dia 20 de cada mês, contado a partir do encerramento do caso. | Confirmado visualmente | MVP |
| Administrativo | Blocos conectados de vendas, faturamento, projetos e administrativo, sem duplicação entre quadros. | Confirmado | MVP |
| Dashboard e relatórios | Painel inicial com comercial, financeiro, marketing, projetos e atividade do time; filtros, exportação e métricas por área/função. | Confirmado | MVP básico |
| Governança operacional | Indicadores de envio/aprovação da proposta, tempo de conclusão, estimativas, gargalos, produtividade e carga por pessoa. | Confirmado | MVP básico / evolução |
| Importação, exportação e migração | Importar dados atuais de planilha/Monday; exportar dados para clientes ou operação que ainda usa planilhas. | Confirmado | MVP |
| Agenda e reuniões | Agenda/cronograma; possível integração com Google Calendar e Meet para registrar reunião, duração, participantes e custo. | A validar | Backlog |
| Marketing/editorial | Calendário por semana/lista/calendário, cards por canal e formato, planejamento antecipado e aprovação de conteúdos. | Confirmado, mas fora/baixa prioridade para V1 | Backlog |
| Redes sociais | Indicadores automáticos de Instagram/Meta Business; LinkedIn sujeito à viabilidade da API ou carga manual. | A validar | Backlog |

## Dados principais

| Entidade | Dados/relacionamentos levantados |
|---|---|
| Cliente | Nome/razão social, CNPJ, contatos/responsáveis, acessos, projetos, documentos e permissões financeiras. |
| Caso/projeto | ID, cliente, datas de entrada e conclusão, tamanho/tipo, status, proposta, briefing, cronograma, responsáveis, arquivos, histórico e indicadores. |
| Proposta | Caso/cliente, valor, prazo, status, data de envio/aprovação, próximos passos e vínculo com faturamento. |
| Atividade | Projeto, área, responsável, prioridade, prazo, status, subtarefas, comentários, arquivos e esforço/capacidade. |
| Financeiro | Valor total, imposto, NF, previsão de pagamento, recebimento, contas a pagar, categoria e vínculo ao projeto. |
| Freelancer | Dados de contato/pagamento, atribuições, materiais liberados, valores acordados, NF/dados enviados e pagamento. |
| Conteúdo editorial | Tema, título, data/hora, canal, formato, material, conversa, aprovador e status — se o módulo entrar no escopo. |

## Perfis e permissões

| Perfil | Escopo esperado |
|---|---|
| Administrador/gestão | Visão ampla, configuração, indicadores, pessoas, projetos e financeiro. |
| Comercial | Funil, propostas, clientes, conversão e leitura contextual do projeto/faturamento. |
| Operação interna | Tarefas, cronograma, materiais e atualização da etapa sob sua responsabilidade. |
| Financeiro | Faturamento, recebimentos, NF, contas a pagar, conferências e relatórios financeiros. |
| Freelancer | Somente casos/tarefas atribuídos, materiais liberados, prazos, comentários e comunicação. Sem financeiro, backlog de marketing ou dados sensíveis. |
| Cliente/aprovador | Somente seus projetos, documentos, comunicação, histórico e métricas autorizadas; financeiro configurável por cliente/usuário. |

## Regras de negócio e automações

1. O projeto deve ser a fonte única de informação. Proposta, tarefas, financeiro e histórico referenciam a mesma entidade, em vez de criar cópias em quadros distintos.
2. A aprovação de uma proposta deve criar/avançar o caso e disponibilizar seus dados no faturamento.
3. A conclusão do projeto deve poder disparar solicitação de NF/dados ao freelancer e criar a pendência de pagamento.
4. O sistema deve conferir o valor informado pelo freelancer contra o valor acordado no projeto; divergências devem ficar visíveis para conferência.
5. Projetos concluídos devem ser arquivados sem perder arquivos, documentos, comentários e histórico.
6. Toda movimentação, arquivo e comentário relevante deve compor a trilha do projeto. A retenção e o nível de auditoria ainda precisam ser definidos.
7. Aprovações devem respeitar alçadas/perfis. Para “pedir ajuste” ou “negar”, registrar comentário/motivo é recomendado; confirmar se será obrigatório.
8. O financeiro exibido no portal do cliente deve ser controlado por permissão granular.
9. A regra atual observada para freelancer é pagamento no dia 20 posterior ao encerramento do caso. Confirmar exceções, feriados, aprovação de NF e casos parciais.

## Escopo recomendado

### MVP

- Autenticação, usuários, clientes, contatos e matriz de permissões.
- Registro central de caso/projeto.
- Funil comercial, proposta e conversão para projeto/faturamento.
- Kanban/listas, tarefas, subtarefas, responsáveis, prazos, prioridade e visão pessoal.
- Fluxo operacional de roteiro, design, ajustes, validação e conclusão.
- Arquivos, comentários, histórico e documentos por projeto.
- Faturamento, recebimentos, contas a pagar e controle básico de freelancers.
- Área restrita de freelancer com alertas e materiais liberados.
- Dashboard inicial e relatórios/exportação básicos.
- Importação/migração inicial de Monday e planilhas prioritárias.
- Portal mínimo do cliente, se for confirmado como requisito do lançamento.

### Evolução / backlog

- Calendário editorial completo e aprovações multicanal.
- Integração Meta Business/Instagram e solução viável para LinkedIn.
- Integração Google Calendar/Meet e contabilização de reunião/custo.
- Dashboards avançados de metas, capacidade, gargalos e produtividade.
- Automação mais ampla de e-mails, cobranças, NF e pagamentos.
- Portal de cliente expandido, com mais autosserviço e métricas.

## Integrações e restrições técnicas

- **Migração:** Monday/ClickUp e planilhas atuais devem ser mapeados antes do desenvolvimento. Definir entidades, campos, anexos e histórico que serão importados.
- **Planilhas:** manter importação/exportação controlada (por exemplo, CSV/XLSX) para transição e atendimento a clientes que ainda usam esse formato.
- **Google:** Calendar e Meet foram citados como integração desejável, não fechada.
- **Social:** Instagram/Meta Business é desejado; LinkedIn depende de viabilidade e permissões de API.
- **Arquivos:** o volume de documentos é o principal fator de armazenamento e custo recorrente. Definir tipos, limites, retenção e política de versões.
- **Não funcionais confirmados:** uso simples, estabilidade, segurança e escalabilidade; a conversa indicou cerca de 20 usuários simultâneos como referência inicial.
- **Hospedagem:** custo recorrente deve ser estimado separadamente do desenvolvimento.

## Perguntas que precisam ser fechadas antes da estimativa

1. O portal do cliente mínimo entra obrigatoriamente no MVP? Quais ações serão permitidas além de consultar e comentar?
2. Quais são as etapas oficiais de comercial e de execução, e quem pode mover um caso entre elas?
3. Quais campos são obrigatórios no cliente, proposta, projeto, tarefa, faturamento e pagamento?
4. Qual sistema emite NF e como será feita a integração, se houver?
5. Quais são todas as condições de pagamento de freelancer, além da regra atual do dia 20?
6. Que dados financeiros cada perfil pode ver, editar, aprovar ou exportar?
7. O marketing/editorial fica integralmente fora da V1 ou entra uma versão mínima de aprovação de conteúdo?
8. Quais relatórios têm decisão operacional e precisam de dados históricos migrados?
9. Quais arquivos exigem versionamento, aprovação formal e prazo de retenção?
10. Qual é o escopo exato de importação da base atual: clientes, projetos, propostas, tarefas, financeiro, anexos e comentários?

## Material de apoio

- Transcrição automática bruta com marcações de tempo: `G:\arthur\.codex-transcription\call-draw-tiny.json`.
- A transcrição automática contém ruído em alguns nomes e trechos. Este levantamento corrigiu apenas os pontos apoiados pela tela e pelo contexto claro da conversa; decisões não explícitas foram mantidas como validação.
