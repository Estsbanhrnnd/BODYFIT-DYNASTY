/**
 * Base de Datos Oficial de Frases Motivacionales - BodyFit Dynasty ®
 * Colección de citas atléticas, disciplina, mentalidad de hierro y filosofía estoica.
 */

export interface DynastyQuote {
  id: string;
  text: string;
  author: string;
  tag: string;
  category: 'disciplina' | 'fuerza' | 'mentalidad' | 'consistencia';
}

export const DYNASTY_QUOTES: DynastyQuote[] = [
  {
    id: 'dq-1',
    text: 'La fuerza no viene de ganar. Tus luchas desarrollan tus fortalezas. Cuando pasas por dificultades y decides no rendirte, eso es fuerza.',
    author: 'Arnold Schwarzenegger',
    tag: '7x Mr. Olympia',
    category: 'fuerza',
  },
  {
    id: 'dq-2',
    text: 'Disciplínate cuando nadie te esté mirando. El escenario y la gloria solo reflejan lo que construiste en la oscuridad del gimnasio.',
    author: 'Chris Bumstead (CBUM)',
    tag: '5x Classic Physique Olympia',
    category: 'disciplina',
  },
  {
    id: 'dq-3',
    text: '¡Yeah Buddy! Todo el mundo quiere ser culturista, pero nadie quiere levantar peso pesado ni sufrir cada repetición.',
    author: 'Ronnie Coleman',
    tag: '8x Mr. Olympia',
    category: 'fuerza',
  },
  {
    id: 'dq-4',
    text: 'Tu cuerpo es el único templo que habitarás toda la vida. Escúlpelo con devoción, técnica estricta y orgullo dinástico.',
    author: 'Head Coach Esteban',
    tag: 'Fundador BodyFit Dynasty ®',
    category: 'mentalidad',
  },
  {
    id: 'dq-5',
    text: 'Los campeones de verdad se forjan en los días en que no tienes ganas de levantarte ni de tocar una sola barra.',
    author: 'Jay Cutler',
    tag: '4x Mr. Olympia',
    category: 'consistencia',
  },
  {
    id: 'dq-6',
    text: 'Cuando tu mente te diga que ya no puedes más, en ese instante exacto es donde empieza el verdadero crecimiento muscular.',
    author: 'Tom Platz',
    tag: 'The Golden Eagle',
    category: 'fuerza',
  },
  {
    id: 'dq-7',
    text: 'Ningún ciudadano tiene derecho a ser un aficionado en el entrenamiento físico. Qué desgracia envejecer sin ver la belleza y fuerza de la que su cuerpo es capaz.',
    author: 'Sócrates',
    tag: 'Filósofo Griego',
    category: 'mentalidad',
  },
  {
    id: 'dq-8',
    text: 'La constancia vence al talento cuando el talento no entrena con disciplina salvaje día tras día.',
    author: 'BodyFit Dynasty',
    tag: 'Estándar Oficial BFD',
    category: 'consistencia',
  },
  {
    id: 'dq-9',
    text: 'No cuentes los días; haz que cada uno de los días cuente en el conteo de tu legado.',
    author: 'Muhammad Ali',
    tag: 'The Greatest',
    category: 'disciplina',
  },
  {
    id: 'dq-10',
    text: 'El dolor del sacrificio dura minutos o semanas; el dolor del arrepentimiento dura toda la vida.',
    author: 'Head Coach Esteban',
    tag: 'Head Coach & Fundador BFD',
    category: 'mentalidad',
  },
  {
    id: 'dq-11',
    text: 'No tienes poder sobre los eventos externos, pero sí sobre tu propia mente y tus manos en la barra. Encuentra esa fuerza y serás invencible.',
    author: 'Marco Aurelio',
    tag: 'Emperador & Filósofo Estoico',
    category: 'mentalidad',
  },
  {
    id: 'dq-12',
    text: 'No existe el sobreentrenamiento si tu descanso, tu proteína y tu nutrición están al nivel de tus ambiciones.',
    author: 'Dorian Yates',
    tag: '6x Mr. Olympia · The Shadow',
    category: 'disciplina',
  },
  {
    id: 'dq-13',
    text: 'El hierro nunca te miente. Puedes engañar a cualquiera afuera, pero doscientos kilos siempre serán doscientos kilos.',
    author: 'Henry Rollins',
    tag: 'Iron and the Soul',
    category: 'fuerza',
  },
  {
    id: 'dq-14',
    text: 'La motivación enciende el motor, pero solo la disciplina es el combustible que te mantiene rodando a través de la tormenta.',
    author: 'Head Coach Esteban',
    tag: 'Filosofía Dinastía',
    category: 'disciplina',
  },
  {
    id: 'dq-15',
    text: 'Si eres capaz de enviar una última señal del cerebro al músculo cuando está ardiendo, ahí es donde se rompen todos los límites.',
    author: 'Franco Columbu',
    tag: '2x Mr. Olympia',
    category: 'fuerza',
  },
  {
    id: 'dq-16',
    text: 'La excelencia no es un acto aislado, es un hábito repetido hasta que se convierta en tu segunda naturaleza.',
    author: 'Aristóteles',
    tag: 'Pensamiento Clásico',
    category: 'consistencia',
  },
  {
    id: 'dq-17',
    text: 'No busques que el entrenamiento sea fácil. Busca volverte tan fuerte que lo difícil te parezca juego de niños.',
    author: 'Jesús David',
    tag: 'Atleta Élite Dynasty',
    category: 'fuerza',
  },
  {
    id: 'dq-18',
    text: 'Cada serie sin trampear, cada gramo de proteína pesado y cada noche de descanso profundo te alejan de la mediocridad.',
    author: 'Dra. Valeria Solano',
    tag: 'Nutrición Deportiva Dynasty',
    category: 'consistencia',
  },
  {
    id: 'dq-19',
    text: 'El éxito en el gimnasio no se mide solo por los discos en la barra, sino por la persona inquebrantable en la que te transformas.',
    author: 'Head Coach Esteban',
    tag: 'Head Coach BodyFit Dynasty',
    category: 'mentalidad',
  },
  {
    id: 'dq-20',
    text: 'Haz hoy lo que otros no quieren hacer, y mañana vivirás como otros no pueden.',
    author: 'Jerry Rice',
    tag: 'Leyenda del Deporte',
    category: 'disciplina',
  },
  {
    id: 'dq-21',
    text: 'El secreto de la hipertrofia es la paciencia implacable. Las montañas no se forman en un día, se elevan por presión continua.',
    author: 'Coach Carlos Navarro',
    tag: 'Biomecánica & Fuerza Dynasty',
    category: 'consistencia',
  },
  {
    id: 'dq-22',
    text: 'Si te detienes cada vez que sientes fatiga, nunca sabrás de qué está hecho tu verdadero potencial genético.',
    author: 'Dexter Jackson',
    tag: 'The Blade · Mr. Olympia',
    category: 'fuerza',
  },
  {
    id: 'dq-23',
    text: 'La mente es el límite. Mientras la mente pueda imaginar el hecho de que puedes lograrlo, puedes lograrlo al 100%.',
    author: 'Arnold Schwarzenegger',
    tag: '7x Mr. Olympia',
    category: 'mentalidad',
  },
  {
    id: 'dq-24',
    text: 'No necesitas que el camino esté despejado, necesitas la firme convicción de que vas a avanzar sin importar los obstáculos.',
    author: 'Camila Cordero',
    tag: 'Atleta Dynasty',
    category: 'disciplina',
  },
  {
    id: 'dq-25',
    text: 'La tensión mecánica es la ley del crecimiento. Ponle peso a tu palabra y a tus entrenamientos con la misma seriedad.',
    author: 'Head Coach Esteban',
    tag: 'Regla de Oro Dynasty',
    category: 'fuerza',
  },
  {
    id: 'dq-26',
    text: 'Quien tiene un porqué para entrenar puede soportar casi cualquier cómo en el gimnasio.',
    author: 'Friedrich Nietzsche',
    tag: 'Adaptación Dinastía',
    category: 'mentalidad',
  },
  {
    id: 'dq-27',
    text: 'Las repeticiones más valiosas son aquellas en las que tu instinto de supervivencia te pide parar y tú eliges continuar con técnica perfecta.',
    author: 'Tom Platz',
    tag: 'Intensidad Pura',
    category: 'fuerza',
  },
  {
    id: 'dq-28',
    text: 'La constancia silenciosa hace más ruido con los años que cualquier ráfaga de motivación pasajera.',
    author: 'BodyFit Dynasty',
    tag: 'Manifiesto Dynasty',
    category: 'consistencia',
  },
  {
    id: 'dq-29',
    text: 'No cuentes las repeticiones fáciles. Empieza a contar cuando comience el ardor, porque esas son las que construyen músculo.',
    author: 'Muhammad Ali',
    tag: 'Leyenda Mundial',
    category: 'fuerza',
  },
  {
    id: 'dq-30',
    text: 'El respeto no se exige en el gimnasio; se gana en silencio con sudor, humildad y platos cargados en la prensa.',
    author: 'Head Coach Esteban',
    tag: 'Código de Honor BFD',
    category: 'disciplina',
  },
  {
    id: 'dq-31',
    text: 'Si cuidas cada día de tu entrenamiento, tus metas anuales se cuidarán solas con matemática precisión.',
    author: 'Lee Haney',
    tag: '8x Mr. Olympia',
    category: 'consistencia',
  },
  {
    id: 'dq-32',
    text: 'El verdadero poder reside en dominar el ego y priorizar la biomecánica estricta sobre el peso descontrolado.',
    author: 'Coach Carlos Navarro',
    tag: 'Biomecánica Dynasty',
    category: 'disciplina',
  },
  {
    id: 'dq-33',
    text: 'No hay atajos hacia ningún lugar que valga la pena alcanzar. Abraza el esfuerzo diario con una sonrisa.',
    author: 'Phil Heath',
    tag: '7x Mr. Olympia',
    category: 'consistencia',
  },
  {
    id: 'dq-34',
    text: 'Tu mayor rival te mira cada mañana en el espejo. Véncelo con tu primera serie del día y el resto será historia.',
    author: 'Head Coach Esteban',
    tag: 'Mentalidad Dinastía',
    category: 'mentalidad',
  },
  {
    id: 'dq-35',
    text: 'La gloria no se hereda; se forja repetición tras repetición bajo las luces de la sala de pesas.',
    author: 'BodyFit Dynasty',
    tag: 'Sello Imperial BFD',
    category: 'fuerza',
  },
  {
    id: 'dq-36',
    text: 'El dolor muscular de hoy es la armadura indestructible con la que caminarás mañana.',
    author: 'Head Coach Esteban',
    tag: 'Head Coach & Atleta',
    category: 'mentalidad',
  },
];

/**
 * Obtiene la frase correspondiente al día del año de forma determinista.
 * Cambia automáticamente a medianoche sin necesidad de conexión.
 */
export function getDailyDynastyQuote(date: Date = new Date()): DynastyQuote {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs(dayOfYear) % DYNASTY_QUOTES.length;
  return DYNASTY_QUOTES[index];
}

/**
 * Selecciona una frase aleatoria de la base de datos (excluyendo opcionalmente la actual).
 */
export function getRandomDynastyQuote(excludeId?: string): DynastyQuote {
  const filtered = excludeId
    ? DYNASTY_QUOTES.filter((q) => q.id !== excludeId)
    : DYNASTY_QUOTES;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index] || DYNASTY_QUOTES[0];
}
