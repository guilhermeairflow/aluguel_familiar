/**
 * REVIEWS DATA
 * Persistência via localStorage — alterações feitas no admin são salvas no navegador.
 */

export type Review = {
  id: string;
  propertySlug: string;
  guest: string;
  rating: number; // 1-5
  date: string;   // ex: "Mar 2026"
  comment: string;
};

const STORAGE_KEY = 'aluguel_familiar_reviews';

export const INITIAL_REVIEWS: Review[] = [
  // Pérola da Montanha
  { id: 'r1', propertySlug: 'perola-da-montanha', guest: 'Marcos S.', rating: 5, date: 'Mar 2026', comment: 'Espetacular! A vista é incrível, o SPA uma maravilha. Com certeza voltaremos nas próximas férias.' },
  { id: 'r2', propertySlug: 'perola-da-montanha', guest: 'Fernanda L.', rating: 5, date: 'Fev 2026', comment: 'Casa enorme e muito bem cuidada. A lareira foi o toque especial para as noites frias de Campos. Nota 10!' },
  { id: 'r3', propertySlug: 'perola-da-montanha', guest: 'Ricardo M.', rating: 5, date: 'Jan 2026', comment: 'Reunião de família perfeita. A casinha da árvore encantou as crianças e o SPA os adultos. Voltamos em julho!' },

  // Ilhabela Santa Tereza
  { id: 'r4', propertySlug: 'ilhabela-santa-tereza', guest: 'Tatiana G.', rating: 5, date: 'Fev 2026', comment: 'Estrutura impecável para 40 pessoas. A cozinheira Gisa foi um diferencial incrível! Recomendo muito.' },
  { id: 'r5', propertySlug: 'ilhabela-santa-tereza', guest: 'Bruno A.', rating: 5, date: 'Jan 2026', comment: 'Piscina maravilhosa, praia a poucos minutos a pé. Perfeito para grandes grupos. Voltaremos no carnaval!' },
  { id: 'r6', propertySlug: 'ilhabela-santa-tereza', guest: 'Camila R.', rating: 5, date: 'Dez 2025', comment: 'Casa linda em Ilhabela! Suficientemente grande para toda a família. Atendimento excelente.' },

  // Casa Campo Itu
  { id: 'r7', propertySlug: 'casa-campo-itu', guest: 'Roberto A.', rating: 5, date: 'Jan 2026', comment: 'Espaço perfeito para grupos grandes. Piscina, campo de futebol e churrasqueira: diversão garantida!' },
  { id: 'r8', propertySlug: 'casa-campo-itu', guest: 'Patricia N.', rating: 5, date: 'Dez 2025', comment: 'Condomínio seguro e bem estruturado. A casa de boneca encantou as crianças. Voltaremos com certeza!' },
  { id: 'r9', propertySlug: 'casa-campo-itu', guest: 'Eduardo K.', rating: 5, date: 'Nov 2025', comment: 'Forno de pizza foi hit da viagem! Casa espaçosa, 10 quartos para acomodar toda a turma confortavelmente.' },

  // Ilhabela Perequê
  { id: 'r10', propertySlug: 'ilhabela-pereque', guest: 'Juliana F.', rating: 5, date: 'Mar 2026', comment: '100 metros da praia é demais! Piscina privativa, ar-condicionado em tudo. Casa perfeita!' },
  { id: 'r11', propertySlug: 'ilhabela-pereque', guest: 'André P.', rating: 5, date: 'Fev 2026', comment: 'Localização privilegiada. Fomos a pé para tudo. A segurança 24h deu tranquilidade total para a família.' },
  { id: 'r12', propertySlug: 'ilhabela-pereque', guest: 'Renata C.', rating: 5, date: 'Jan 2026', comment: 'Casa impecável, muito bem equipada. As 5 vagas de estacionamento foram essenciais para o grupo!' },

  // Juquehy
  { id: 'r13', propertySlug: 'juquehy', guest: 'Mariana V.', rating: 5, date: 'Mar 2026', comment: 'Casa linda no condomínio Vila Victoria! Piscina e churrasqueira incríveis. Serviço de praia do condomínio foi um luxo.' },
  { id: 'r14', propertySlug: 'juquehy', guest: 'Daniel C.', rating: 5, date: 'Fev 2026', comment: 'Juquehy é maravilhosa e a casa superou as expectativas. Voltaremos no próximo verão!' },
  { id: 'r15', propertySlug: 'juquehy', guest: 'Larissa M.', rating: 5, date: 'Jan 2026', comment: 'Tudo impecável! O zelador da piscina mantinha tudo perfeito. Os 2 sacos de gelo diários foram um ótimo mimo.' },

  // Riviera Módulo 7
  { id: 'r16', propertySlug: 'riviera-modulo7', guest: 'Carla D.', rating: 5, date: 'Jan 2026', comment: 'Cobertura incrível! 100 metros da praia, serviço de praia incluso, academia e sauna no condomínio. Perfeito!' },
  { id: 'r17', propertySlug: 'riviera-modulo7', guest: 'Felipe S.', rating: 5, date: 'Dez 2025', comment: 'Riviera é linda e a cobertura é um espetáculo. Vista privilegiada, piscina privativa e 3 vagas. Amamos!' },
  { id: 'r18', propertySlug: 'riviera-modulo7', guest: 'Vanessa O.', rating: 5, date: 'Nov 2025', comment: 'O salão de festas e a sala de jogos foram um diferencial no fim de semana com os amigos. Recomendo!' },

  // Guarujá Enseada
  { id: 'r19', propertySlug: 'guaruja-enseada', guest: 'Alessandra B.', rating: 5, date: 'Mar 2026', comment: 'Mansão pé na areia é literalmente isso: acordamos e o mar estava ali! A caseira foi incrível, atenção total.' },
  { id: 'r20', propertySlug: 'guaruja-enseada', guest: 'Gustavo H.', rating: 5, date: 'Fev 2026', comment: 'Vista para o mar de todos os quartos. Piscina privativa, roupas de cama inclusas. Experiência cinco estrelas!' },
  { id: 'r21', propertySlug: 'guaruja-enseada', guest: 'Simone T.', rating: 5, date: 'Jan 2026', comment: 'Comemoramos aniversário de 15 anos aqui. Perfeito em tudo! A possibilidade de alugar lancha foi incrível.' },
];

// ── Carrega reviews do localStorage (ou usa os iniciais) ──────────────────────
export function loadReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Review[];
  } catch {/* ignore */}
  return INITIAL_REVIEWS;
}

// ── Salva todos os reviews no localStorage ────────────────────────────────────
export function saveReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ── Filtra reviews de um imóvel específico ────────────────────────────────────
export function getReviewsBySlug(reviews: Review[], slug: string): Review[] {
  return reviews.filter(r => r.propertySlug === slug);
}

// ── Calcula nota média ─────────────────────────────────────────────────────────
export function getAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
}

// ── Gera ID único ─────────────────────────────────────────────────────────────
export function generateId(): string {
  return 'r' + Date.now() + Math.random().toString(36).slice(2, 7);
}
