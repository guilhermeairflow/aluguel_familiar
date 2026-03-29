---
description: Auditoria completa e correção de todos os erros do sistema Aluguel Familiar
---

# Workflow: Fix All — Auditoria e Correção do Sistema

## Problemas identificados e passos de correção

### 1. Verificar se middleware.ts foi removido
Ele bloqueia o build estático. Se existir, deletar o arquivo `src/middleware.ts`.

### 2. Verificar e corrigir build
// turbo
```
npm run build
```
Se houver erros, corrigi-los antes de prosseguir.

### 3. Corrigir cards da home — imagens com muitas fotos carregando em memória
- Limitar array de imagens exibidas nos cards da home a no máximo 5 fotos (para não carregar todas as 27 em memória)
- Manter `loading="lazy"` em todas exceto a primeira

### 4. Corrigir galeria da página do imóvel — responsividade mobile
- Galeria usa `grid` com colunas fixas que quebra no celular
- Adicionar `@media (max-width: 768px)` com layout de coluna única

### 5. Corrigir layout da info dos imóveis no mobile
- O grid `templateColumns: 'minmax(0,1fr) 380px'` fica muito pequeno no celular
- No mobile: empilhar as colunas com flex-direction column

### 6. Admin — verificar se todas as abas têm generateStaticParams onde necessário
- `/admin/properties/[id]` precisa ter generateStaticParams no layout

### 7. Confirmar número do WhatsApp correto
- Verificar que todos os links usam `5511945747572`

### 8. Fazer build final limpo
// turbo
```
npm run build
```

### 9. Deploy no Netlify
Arrastar a pasta `out/` gerada para https://app.netlify.com/drop
OU executar:
```
npx netlify-cli deploy --prod --dir out --site SEU_SITE_ID
```
