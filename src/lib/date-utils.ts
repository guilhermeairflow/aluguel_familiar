/**
 * Calcula a data da Páscoa para um determinado ano (Algoritmo de Meeus/Jones/Butcher)
 */
function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Retorna os feriados nacionais brasileiros para um ano específico
 */
export function getBrazilianHolidays(year: number): Record<string, string> {
  const easter = getEaster(year);
  
  // Feriados Móveis
  const carnival = new Date(easter.getTime());
  carnival.setUTCDate(easter.getUTCDate() - 47);
  
  const goodFriday = new Date(easter.getTime());
  goodFriday.setUTCDate(easter.getUTCDate() - 2);
  
  const corpusChristi = new Date(easter.getTime());
  corpusChristi.setUTCDate(easter.getUTCDate() + 60);

  const fmt = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

  const holidays: Record<string, string> = {
    [`${year}-01-01`]: 'Ano Novo',
    [`${year}-04-21`]: 'Dia de Tiradentes',
    [`${year}-05-01`]: 'Dia do Trabalho',
    [`${year}-07-09`]: 'Revolução Constitucionalista (SP)',
    [`${year}-09-07`]: 'Independência do Brasil',
    [`${year}-10-12`]: 'Nossa Senhora Aparecida',
    [`${year}-11-02`]: 'Finados',
    [`${year}-11-15`]: 'Proclamação da República',
    [`${year}-11-20`]: 'Consciência Negra',
    [`${year}-12-25`]: 'Natal',
    [fmt(carnival)]: 'Carnaval',
    [fmt(goodFriday)]: 'Sexta-feira Santa',
    [fmt(corpusChristi)]: 'Corpus Christi',
  };

  return holidays;
}

/**
 * Retorna o nome do feriado se a data for um feriado, null caso contrário
 */
export function getHolidayName(dateStr: string): string | null {
  const date = new Date(dateStr);
  const year = date.getUTCFullYear();
  const holidays = getBrazilianHolidays(year);
  return holidays[dateStr] || null;
}

/**
 * Determina a categoria de temporada (Alta, Média, Baixa) p/ um intervalo de datas e localização
 */
export function getSeasonality(checkin: string, checkout: string, city: string): { category: string, holidaysFound: string[] } {
  const start = new Date(checkin);
  const end = new Date(checkout);
  const holidaysFound = new Set<string>();
  
  const isMountain = city.toLowerCase().includes('campos do jordão');
  
  let current = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const terminal = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  
  let highDays = 0;
  let mediumDays = 0;
  let totalDays = 0;

  while (current <= terminal) {
    totalDays++;
    const month = current.getUTCMonth() + 1; // 1-indexed
    const day = current.getUTCDate();
    const iso = `${current.getUTCFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const holiday = getHolidayName(iso);
    if (holiday) holidaysFound.add(holiday);
    
    // Identifica Férias Escolares
    if (month === 7) holidaysFound.add('Férias Escolares (Julho)');
    if (month === 1) holidaysFound.add('Férias Escolares (Janeiro)');

    // Regras de Temporada
    let isHigh = false;
    let isMedium = false;

    if (holiday) {
      isHigh = true;
    } else {
      if (isMountain) {
        // Campos do Jordão: Inverno (Jun/Jul) + Verão (Dez/Jan)
        if ([6, 7, 12, 1].includes(month)) isHigh = true;
        else if ([5, 8].includes(month)) isMedium = true;
      } else {
        // Praia/Campo: Verão (Dez/Jan/Fev) + Julho
        if ([12, 1, 2, 7].includes(month)) isHigh = true;
        // Média: Março, Junho, Novembro
        else if ([3, 6, 11].includes(month)) isMedium = true;
      }
    }

    if (isHigh) highDays++;
    else if (isMedium) mediumDays++;

    current.setUTCDate(current.getUTCDate() + 1);
  }

  let finalCategory = 'Baixa';
  if (highDays > 0) finalCategory = 'Alta';
  else if (mediumDays > 0) finalCategory = 'Média';

  return {
    category: finalCategory,
    holidaysFound: Array.from(holidaysFound)
  };
}