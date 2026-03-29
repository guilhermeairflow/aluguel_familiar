/**
 * PROPERTIES DATA
 * 
 * OTIMIZAÇÃO DE PERFORMANCE:
 * - Cards na home page usam apenas coverImage + slice(0, 5) das imagens
 * - Página do imóvel carrega as 10 primeiras na DOM e as demais sob demanda
 * - Todas as imagens têm loading="lazy" exceto a primeira de cada propriedade
 */

export const PROPERTIES = [
  {
    id: '1',
    slug: 'perola-da-montanha',
    title: 'Casa em Campos | 5min Capivari + Vista Morro do Elefante',
    city: 'Campos do Jordão',
    state: 'SP',
    mapLocation: 'Vila Inglesa Campos do Jordão, proximo da rua luiz carlos ribeiro, Brasil',
    basePricePerNight: 3200,
    cleaningFee: 500,
    maxGuests: 30,
    bedrooms: 7,
    beds: 15,
    bathrooms: 8,
    coverImage: '/IMG_1092.JPG.jpeg',
    // Primeiras 6 para cards e hero; demais carregadas na página do imóvel
    images: [
      '/IMG_1092.JPG.jpeg',
      '/IMG_1088.JPG.jpeg',
      '/IMG_1093.JPG.jpeg',
      '/IMG_1094.JPG.jpeg',
      '/IMG_1100.JPG.jpeg',
      '/IMG_1170.JPG.jpeg',
    ],
    features: ['SPA (Sauna Seca e Úmida)', '3 Lareiras + Fireplace', 'Redário e Casinha da Árvore', 'Mini Futsal', 'Garagem (8 carros)', '5 min do Capivari', 'Wi-Fi'],
    description: `Casa PÉROLA DA MONTANHA à 5 minutos do centrinho turístico Capivari.

VISTA DE PONTOS TURÍSTICOS PRIVILEGIADA,  do Morro do Elefante, Bendito Cacau.

🌄 Nascer do Sol belíssimo.
🌅 Por do Sol maravilhoso.

👥 Casa Principal 
Acomoda 20 pessoas!
🚽 6 banheiros
🛌 4 quartos 

🧖‍♂️ SPA com sauna úmida e sauna seca

🔥 3 lareiras + Fireplace para 14 pessoas

🏠 Casinha da árvore · REDÁRIO para 12 pessoas

📲 WiFi · ⚽ Mini futsal · 🚘 Garagem 6 carros

👥 Casa DE HÓSPEDES
Acomoda 10 pessoas! 🛌 3 quartos · 🚽 2 banheiros
🚘 Garagem 8 carros`
  },
  {
    id: '2',
    slug: 'ilhabela-santa-tereza',
    title: 'Casa em Ilhabela 40 Pessoas Piscina + Praia a Pé',
    city: 'Ilhabela',
    state: 'SP',
    mapLocation: 'R. Francisco Gomes da Silva Prado - Centro, Ilhabela, SP, Brasil',
    basePricePerNight: 4500,
    cleaningFee: 600,
    maxGuests: 40,
    bedrooms: 7,
    beds: 20,
    bathrooms: 8,
    coverImage: '/ilhabela (2).jpeg',
    images: [
      '/ilhabela (2).jpeg',
      '/ilhabela (3).jpeg',
      '/ilhabela (4).jpeg',
      '/ilhabela (5).jpeg',
      '/ilhabela (6).jpeg',
      '/ilhabela (7).jpeg',
      '/ilhabela (8).jpeg',
      '/ilhabela (9).jpeg',
      '/ilhabela (10).jpeg',
      '/ilhabela (11).jpeg',
      '/ilhabela (12).jpeg',
      '/ilhabela (13).jpeg',
      '/ilhabela (14).jpeg',
      '/ilhabela (15).jpeg',
      '/ilhabela (16).jpeg',
      '/ilhabela (17).jpeg',
      '/ilhabela (18).jpeg',
      '/ilhabela (19).jpeg',
      '/ilhabela (20).jpeg',
      '/ilhabela (21).jpeg',
      '/ilhabela (22).jpeg',
    ],
    features: ['4 min da Praia', '7 min do Centrinho', 'Piscina Privativa e Churrasqueira', 'Varanda com Vista para Natureza', 'Estacionamento (5 vagas)', 'Opcional: Cozinheira (Gisa)'],
    description: `CASA GRANDE – ILHABELA (SANTA TEREZA)
A 4 minutos da Praia de Santa Tereza e 7 min do centrinho da Rua do Meio.

👥 Acomoda até 40 pessoas!
🛌 7 dormitórios · 🚽 8 banheiros

🏠 Estrutura:
5 suítes com ar-condicionado + ventilador de teto
🏊 Piscina privativa · 🔥 Churrasqueira · 🍳 Cozinha completa
📲 Wi-Fi · 🚘 Estacionamento (3 vagas internas + 2 externas)
🌿 Varanda com mesas e vista para a natureza

👩‍🍳 Diferencial: Serviço opcional de cozinheira (Gisa)
☕ Café da manhã e almoço sob contratação`
  },
  {
    id: '3',
    slug: 'casa-campo-itu',
    title: 'Casa de Campo em Itu 40 Pessoas + Lazer Completo',
    city: 'Itu',
    state: 'SP',
    mapLocation: 'Estrada do Varejão, Itu, SP, Brasil',
    basePricePerNight: 4800,
    cleaningFee: 800,
    maxGuests: 40,
    bedrooms: 10,
    beds: 30,
    bathrooms: 10,
    coverImage: '/itu (2).jpeg',
    images: [
      '/itu (2).jpeg',
      '/itu (3).jpeg',
      '/itu (4).jpeg',
      '/itu (5).jpeg',
      '/itu (6).jpeg',
      '/itu (7).jpeg',
      '/itu (8).jpeg',
      '/itu (9).jpeg',
      '/itu (10).jpeg',
      '/itu (11).jpeg',
      '/itu (12).jpeg',
      '/itu (13).jpeg',
      '/itu (14).jpeg',
      '/itu (15).jpeg',
      '/itu (16).jpeg',
      '/itu (17).jpeg',
      '/itu (18).jpeg',
      '/itu (19).jpeg',
      '/itu (20).jpeg',
      '/itu (21).jpeg',
      '/itu (22).jpeg',
      '/itu (23).jpeg',
      '/itu (24).jpeg',
      '/itu (25).jpeg',
      '/itu (26).jpeg',
      '/itu (27).jpeg',
    ],
    features: ['Piscina e Lareira', 'Forno de Pizza e Churrasqueira', 'Campo de Futebol', 'Quadra de Basquete', 'Wi-Fi', 'Casa de Boneca'],
    description: `CASA DE CAMPO – ITU (CONDOMÍNIO HARMONIA)
10 min do Parque Maeda e 10 min do Cacau Park.

👥 Acomoda até 40 pessoas!
🛌 10 quartos · 🚽 10 banheiros

🏊 Piscina · 🔥 Lareira · 🔥 Churrasqueira · 🍕 Forno de pizza
📲 Wi-Fi · ⚽ Campo de futebol · 🏀 Mini quadra de basquete
🏚️ Casa de boneca · 🏡 Condomínio fechado com segurança`
  },
  {
    id: '4',
    slug: 'ilhabela-pereque',
    title: 'Casa em Ilhabela 100m da Praia Piscina + Ar',
    city: 'Ilhabela',
    state: 'SP',
    mapLocation: 'Praia do Perequê, Ilhabela, SP, Brasil',
    basePricePerNight: 1800,
    cleaningFee: 400,
    maxGuests: 12,
    bedrooms: 5,
    beds: 8,
    bathrooms: 5,
    coverImage: '/pereque (2).jpeg',
    images: [
      '/pereque (2).jpeg',
      '/pereque (3).jpeg',
      '/pereque (4).jpeg',
      '/pereque (5).jpeg',
      '/pereque (6).jpeg',
      '/pereque (7).jpeg',
      '/pereque (8).jpeg',
      '/pereque (9).jpeg',
      '/pereque (10).jpeg',
      '/pereque (11).jpeg',
      '/pereque (12).jpeg',
      '/pereque (13).jpeg',
      '/pereque (14).jpeg',
      '/pereque (15).jpeg',
      '/pereque (16).jpeg',
      '/pereque (17).jpeg',
      '/pereque (18).jpeg',
      '/pereque (19).jpeg',
      '/pereque (20).jpeg',
      '/pereque (21).jpeg',
      '/pereque (22).jpeg',
      '/pereque (23).jpeg',
    ],
    features: ['100m da Praia do Perequê', 'Piscina Privativa', 'Ar Condicionado Total', 'Estacionamento (5 vagas)', 'Alarme e Câmeras 24h', 'Wi-Fi'],
    description: `CASA – ILHABELA (PRAIA DO PEREQUÊ)
A apenas 100 metros do mar. Faça tudo a pé!

👥 Acomoda até 12 pessoas!
🛌 5 quartos · 🚽 5 banheiros

❄️ Ar-condicionado em todos os ambientes
🏊 Piscina privativa · 📲 Wi-Fi
🔐 Sistema de alarme e câmeras 24h
🚘 Estacionamento (5 vagas internas)

⚠️ Pets não permitidos · Roupas não inclusas (sob contratação)`
  },
  {
    id: '5',
    slug: 'juquehy',
    title: 'Casa em Juquehy 10 Pessoas Piscina + Praia a Pé',
    city: 'São Sebastião',
    state: 'SP',
    mapLocation: 'Condomínio Vila Victoria, rua dona eufrasina, Juquehy, São Sebastião, Brasil',
    basePricePerNight: 1200,
    cleaningFee: 350,
    maxGuests: 10,
    bedrooms: 3,
    beds: 6,
    bathrooms: 4,
    coverImage: '/juquehy (1).jpeg',
    images: [
      '/juquehy (1).jpeg',
      '/juquehy (2).jpeg',
      '/juquehy (3).jpeg',
      '/juquehy (4).jpeg',
      '/juquehy (5).jpeg',
      '/juquehy (6).jpeg',
      '/juquehy (7).jpeg',
      '/juquehy (8).jpeg',
      '/juquehy (9).jpeg',
      '/juquehy (10).jpeg',
      '/juquehy (11).jpeg',
      '/juquehy (12).jpeg',
      '/juquehy (13).jpeg',
      '/juquehy (14).jpeg',
      '/juquehy (15).jpeg',
      '/juquehy (16).jpeg',
      '/juquehy (17).jpeg',
      '/juquehy (18).jpeg',
      '/juquehy (19).jpeg',
      '/juquehy (20).jpeg',
      '/juquehy (21).jpeg',
      '/juquehy (22).jpeg',
      '/juquehy (23).jpeg',
      '/juquehy (24).jpeg',
      '/juquehy (25).jpeg',
      '/juquehy (26).jpeg',
      '/juquehy (27).jpeg',
      '/juquehy (28).jpeg',
    ],
    features: ['10min a pé da Praia', 'Piscina Privativa', 'Serviço de Praia do Condomínio', '2 Sacos de Gelo Diários', 'Zelador para Piscina', 'Ar Condicionado e Wi-Fi', 'Segurança 24h'],
    description: `CASA – JUQUEHY (CONDOMÍNIO VILA VICTORIA)
10 min a pé da Praia de Juquehy.

👥 Acomoda até 10 pessoas!
🛌 3 suítes · 🚽 3 banheiros + 1 lavabo

❄️ Ar-condicionado nos quartos e sala
🏊 Piscina privativa · 🔥 Churrasqueira · 📲 Wi-Fi
🚘 Estacionamento (2 vagas)

🏖️ Condomínio: segurança 24h
⛱️ Serviço de praia (guarda-sol + cadeiras)
🧊 2 sacos de gelo/dia · 🍕 Forno de pizza no salão

📍 400m do mercado · 800m do centrinho
⚠️ Pets não permitidos`
  },
  {
    id: '6',
    slug: 'riviera-modulo7',
    title: 'Cobertura Riviera 12 Pessoas Piscina + 100m Praia',
    city: 'Bertioga',
    state: 'SP',
    mapLocation: 'Passeio dos Jequitibás 595, Riviera de São Lourenço, Bertioga, Brasil',
    basePricePerNight: 2800,
    cleaningFee: 450,
    maxGuests: 12,
    bedrooms: 5,
    beds: 8,
    bathrooms: 4,
    coverImage: '/rivieira (1).jpeg',
    images: [
      '/rivieira (1).jpeg',
      '/rivieira (2).jpeg',
      '/rivieira (3).jpeg',
      '/rivieira (4).jpeg',
      '/rivieira (5).jpeg',
      '/rivieira (6).jpeg',
      '/rivieira (7).jpeg',
      '/rivieira (8).jpeg',
      '/rivieira (9).jpeg',
      '/rivieira (10).jpeg',
      '/rivieira (11).jpeg',
      '/rivieira (12).jpeg',
      '/rivieira (13).jpeg',
      '/rivieira (14).jpeg',
      '/rivieira (15).jpeg',
      '/rivieira (16).jpeg',
      '/rivieira (17).jpeg',
      '/rivieira (18).jpeg',
      '/rivieira (19).jpeg',
      '/rivieira (20).jpeg',
      '/rivieira (21).jpeg',
      '/rivieira (22).jpeg',
      '/rivieira (23).jpeg',
      '/rivieira (24).jpeg',
      '/rivieira (25).jpeg',
    ],
    features: ['100 metros da praia', 'Piscina Privativa', 'Churrasqueira', 'Wi-Fi', 'Serviço de praia (6 cad / 2 gs)', 'Piscina Aquecida no Prédio', 'Academia e Sauna', 'Estacionamento (3 vagas)'],
    description: `COBERTURA – RIVIERA DE SÃO LOURENÇO (MÓDULO 7)
A apenas 100 metros da praia. Região nobre e bem estruturada.

👥 Acomoda até 12 pessoas!
🛌 5 quartos (3 suítes com ar-condicionado) · 🚽 4 banheiros

🏊 Piscina privativa · 🔥 Churrasqueira · 🍳 Cozinha completa
📲 Wi-Fi · 🚘 Estacionamento (3 vagas)

🏢 Condomínio:
⛱️ Serviço de praia (6 cadeiras + 2 guarda-sóis)
🌊 Piscina aquecida · 🏋️ Academia · 🧖 Sauna
🎉 Salão de festas · 🎮 Sala de jogos`
  },
  {
    id: '7',
    slug: 'guaruja-enseada',
    title: 'Mansão Pé na Areia Guarujá 18 Pessoas + Piscina',
    city: 'Guarujá',
    state: 'SP',
    basePricePerNight: 5800,
    cleaningFee: 700,
    maxGuests: 18,
    bedrooms: 5,
    beds: 8,
    bathrooms: 6,
    coverImage: '/guaruja (2).jpeg',
    images: [
      '/guaruja (2).jpeg',
      '/guaruja (3).jpeg',
      '/guaruja (4).jpeg',
      '/guaruja (5).jpeg',
      '/guaruja (6).jpeg',
      '/guaruja (7).jpeg',
      '/guaruja (8).jpeg',
      '/guaruja (9).jpeg',
      '/guaruja (10).jpeg',
      '/guaruja (11).jpeg',
      '/guaruja (12).jpeg',
      '/guaruja (13).jpeg',
      '/guaruja (14).jpeg',
      '/guaruja (15).jpeg',
      '/guaruja (16).jpeg',
      '/guaruja (17).jpeg',
      '/guaruja (18).jpeg',
      '/guaruja (19).jpeg',
      '/guaruja (20).jpeg',
      '/guaruja (21).jpeg',
      '/guaruja (22).jpeg',
      '/guaruja (23).jpeg',
      '/guaruja (24).jpeg',
      '/guaruja (25).jpeg',
      '/guaruja (26).jpeg',
      '/guaruja (27).jpeg',
    ],
    features: ['Pé na Areia Muro Baixo', 'Vista Ilimitada do Mar', 'Caseira Inclusa', 'Roupas de Cama e Banho', 'Ar-condicionado', 'Piscina Privativa', 'Estacionamento (4 vagas)', 'Possibilidade de Lancha'],
    description: `MANSÃO PÉ NA AREIA – GUARUJÁ (PRAIA DA ENSEADA)
Localização exclusiva frente ao mar. Estrutura completa de alto padrão.

👥 Acomoda até 18 pessoas!
🛌 5 suítes · 🚽 5 banheiros + 1 lavabo

🌊 Pé na areia – vista direta para o mar
🏊 Piscina privativa · 🔥 Churrasqueira · 🍳 Cozinha completa
❄️ Ar-condicionado · 📲 Wi-Fi · 🚘 Estacionamento (4 vagas)
🛏️ Roupas de cama inclusas · 🛁 Toalhas de banho inclusas

👩‍🍳 Caseira inclusa · Cozinheira disponível sob contratação
🪑 4 cadeiras de praia · ⛵ Possibilidade de aluguel de lancha`
  },
  {
    id: '8',
    slug: 'casa-barra-do-sahy',
    title: 'Casa Barra do Sahy 9 Pessoas + 300m da Praia',
    city: 'Barra do Sahy, São Sebastião',
    state: 'SP',
    mapLocation: 'Condomínio Pernichudo, Barra do Sahy, São Sebastião, Brasil',
    basePricePerNight: 2000,
    cleaningFee: 300,
    maxGuests: 9,
    bedrooms: 5,
    beds: 9,
    bathrooms: 6,
    coverImage: '/barra_do_sahy (1).jpeg',
    images: [
      '/barra_do_sahy (1).jpeg',
      '/barra_do_sahy (2).jpeg',
      '/barra_do_sahy (3).jpeg',
      '/barra_do_sahy (4).jpeg',
      '/barra_do_sahy (5).jpeg',
      '/barra_do_sahy (6).jpeg',
      '/barra_do_sahy (7).jpeg',
      '/barra_do_sahy (8).jpeg',
      '/barra_do_sahy (9).jpeg',
      '/barra_do_sahy (10).jpeg',
      '/barra_do_sahy (11).jpeg',
      '/barra_do_sahy (12).jpeg',
      '/barra_do_sahy (13).jpeg',
      '/barra_do_sahy (14).jpeg',
      '/barra_do_sahy (15).jpeg',
      '/barra_do_sahy (16).jpeg',
      '/barra_do_sahy (17).jpeg',
      '/barra_do_sahy (18).jpeg',
      '/barra_do_sahy (19).jpeg',
      '/barra_do_sahy (20).jpeg',
      '/barra_do_sahy (21).jpeg',
      '/barra_do_sahy (22).jpeg',
      '/barra_do_sahy (23).jpeg',
      '/barra_do_sahy (24).jpeg'
    ],
    features: ['300m da praia', 'Condomínio Fechado Plena Segurança', 'Piscina e Campo no Condomínio', 'Ar-condicionado e Wi-Fi', 'Área Gourmet', 'Churrasqueira e Forno de Pizza'],
    description: `CASA – BARRA DO SAHY (CONDOMÍNIO FECHADO)

Aproveite a Barra do Sahy com conforto e exclusividade! Casa em condomínio fechado a apenas 300 metros da praia, acomoda até 9 pessoas com 4 suítes + suíte de apoio, ambientes climatizados, Wi-Fi e área gourmet com churrasqueira e forno de pizza à lenha. Condomínio com piscina e campo. Ideal para famílias que buscam segurança, praticidade e lazer próximo ao mar!

👥 Acomoda até 9 pessoas
🛌 5 dormitórios (4 suítes + 1 suíte de apoio)
🚿 6 banheiros

📍 Localização: Barra do Sahy, São Sebastião (aprox. 300m da praia, fácil acesso a restaurantes e comércio).

🏠 Estrutura
❄️ Ar-condicionado nos quartos
📲 Wi-Fi
🪵 Forno de pizza à lenha
🥩 Churrasqueira

🛡️ Condomínio e diferencias
- Condomínio fechado com segurança
- 🏊 Piscina no condomínio
- ⚽ Campo no condomínio
- Ideal para grupos familiares
- Localização privilegiada perto da praia e seguro

⚠️ Regras 
- Pets não são permitidos nesta propriedade.
- Endereço e acesso completos serão informados na conclusão da reserva.`
  }
];
