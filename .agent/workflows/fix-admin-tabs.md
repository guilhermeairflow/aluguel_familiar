---
description: Fix all broken admin tabs and make the system fully functional
---

// turbo-all

## Contexto
O painel admin do Aluguel Familiar tem 9 itens no menu lateral:
- /admin — Dashboard ✅
- /admin/financeiro — Dashboard Financeiro ✅
- /admin/properties — Imóveis ✅
- /admin/calendar — Disponibilidade ✅
- /admin/pricing — Preços (**sem página — retorna 404**)
- /admin/clients — CRM de Clientes ✅
- /admin/inquiries — Consultas (Leads) ✅
- /admin/reviews — Avaliações (**sem página — retorna 404**)
- /admin/settings — Configurações (**sem página — retorna 404**)

## Objetivo
Criar as 3 páginas ausentes e garantir que todas as existentes compilam sem erro.

## Passos

### 1. Criar /admin/pricing/page.tsx
Página de gestão de preços global com:
- Tabela de todos os imóveis com preço base e taxa de limpeza editáveis inline
- Seção de temporadas globais (feriados/alta temporada com datas e multiplicador de preço)
- Botão salvar por linha

### 2. Criar /admin/reviews/page.tsx
Página de avaliações com:
- Cards de avaliações simuladas (hóspede, imóvel, nota de 1–5 estrelas, comentário, data)
- Filtro por imóvel e nota
- Média geral e por imóvel (4 cards de KPI no topo)
- Botão de resposta que abre caixa de texto inline

### 3. Criar /admin/settings/page.tsx
Página de configurações com:
- Seção: Dados do negócio (nome, WhatsApp de contato, e-mail, endereço para contato)
- Seção: Taxas padrão (taxa de limpeza padrão, política de cancelamento, horários padrão check-in/out)
- Seção: Integrações (link do Instagram, Google Maps placeholder, Airbnb)
- Seção: Segurança (trocar senha do admin)
- Botão salvar por seção

### 4. Verificar páginas existentes
- Checar se /admin/properties/page.tsx importa PROPERTIES corretamente
- Checar se /admin/calendar/page.tsx não tem erros de tipo
- Confirmar que layout.tsx tem os 9 itens de navegação corretos

### 5. Teste visual no browser
- Abrir http://localhost:3000/admin e navegar por todas as abas
- Confirmar que nenhuma retorna 404 ou erro de compilação
- Reportar quais páginas estão funcionando e quais ainda têm problema
