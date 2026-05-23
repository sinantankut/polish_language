import type {CefrLevel, PolishCase} from '../platform/schema';

export type QuestionSkill = 'communication' | 'vocabulary' | 'grammar';

export type LessonFlowStep = {
  title: string;
  body: string;
};

export type PracticeQuestion = {
  id: string;
  skill: QuestionSkill;
  prompt: string;
  selfCheck: string;
};

type CurriculumUnitSeed = {
  id: string;
  level: CefrLevel;
  lesson: string;
  title: string;
  source: string;
  focus: string;
  communication: string[];
  vocabulary: string[];
  grammar: string[];
  cases: PolishCase[];
  status: 'available' | 'planned' | 'locked';
  minutes: number;
};

export type CurriculumUnit = CurriculumUnitSeed & {
  objectives: string[];
  lessonFlow: LessonFlowStep[];
  practiceQuestions: PracticeQuestion[];
};

const TEXTBOOK_SOURCE = 'Polski krok po kroku 2';

export const curriculumLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const textbookQuestionPrompts: Record<string, Record<QuestionSkill, string>> = {
  'kpk2-lesson-01': {
    communication:
      'Write three sentences introducing yourself and another person. Include one profession and one interest.',
    vocabulary:
      'Create six labels for a profile card: two for appearance, two for character, and two for marital or family status.',
    grammar:
      'Transform these identity notes into instrumental forms: student, sociologist, patient person.',
  },
  'kpk2-lesson-02': {
    communication:
      'Write a four-sentence news update about difficult weather and how people reacted.',
    vocabulary:
      'Group eight disaster or biography words into two clusters: event words and life-story words.',
    grammar:
      'Rewrite three positive sentences as negations that trigger the genitive case.',
  },
  'kpk2-lesson-03': {
    communication:
      'Plan a cinema evening with a friend and compare two film options in five lines.',
    vocabulary:
      'Choose five film words and use each in a short recommendation sentence.',
    grammar:
      'Write six place phrases: three for where something is happening and three for where someone is going.',
  },
  'kpk2-lesson-04': {
    communication:
      'Define three people by nationality, profession, or team role without naming them directly.',
    vocabulary:
      'Make a mini sports report using team, player, result, win, and draw.',
    grammar:
      'Change five singular people or objects into nominative plural groups, including one masculine-personal group.',
  },
  'kpk2-lesson-05': {
    communication:
      'Describe two people you like and one difficult person, giving a reason for each opinion.',
    vocabulary:
      'Sort eight personality adjectives into strengths, weaknesses, and context-dependent traits.',
    grammar:
      'Write three definitions using kto/człowiek patterns and one adjective used as a noun.',
  },
  'kpk2-lesson-06': {
    communication:
      'Explain your education path and one technology habit in a short paragraph.',
    vocabulary:
      'List five computer or Internet nouns and connect each to a classroom action.',
    grammar:
      'Turn five verbs connected with studying into verbal nouns and use two in sentences.',
  },
  'kpk2-lesson-07': {
    communication:
      'Prepare a short answer to an interview question about your experience and responsibilities.',
    vocabulary:
      'Build a job-posting word bank with six terms: two for skills, two for documents, and two for company structure.',
    grammar:
      'Review a short work email and mark one case form, one verb form, and one formal phrase to check.',
  },
  'kpk2-lesson-08': {
    communication:
      'Draft five interview questions about origin, family background, studies, and plans.',
    vocabulary:
      'Write six family or origin words and add one useful collocation for each.',
    grammar:
      'Complete three sentences with swój/swoja/swoje and explain who owns the object.',
  },
  'kpk2-lesson-09': {
    communication:
      'Give a traveler eight short instructions for preparing documents and luggage.',
    vocabulary:
      'Choose seven travel items and mark them as essential, optional, or risky to forget.',
    grammar:
      'Rewrite five polite requests as imperative instructions, then soften two with warto or trzeba.',
  },
  'kpk2-lesson-10': {
    communication:
      'Write a short message asking for information about a Polish tourist attraction.',
    vocabulary:
      'Prepare a message word bank for letters, emails, and SMS: greeting, request, attachment, closing.',
    grammar:
      'Address four people directly using vocative forms, then add two locative phrases about where they are.',
  },
  'kpk2-lesson-11': {
    communication:
      'Narrate a short route through a city using at least five motion verbs.',
    vocabulary:
      'Pair six movement verbs with a place or obstacle where the movement happens.',
    grammar:
      'Contrast three imperfective motion verbs with their perfective partners in short examples.',
  },
  'kpk2-lesson-12': {
    communication:
      'Write a complaint about a bad trip that includes one direction problem and one transport problem.',
    vocabulary:
      'Create a road-sign glossary with six terms and one plain-language explanation for each.',
    grammar:
      'Use motion verbs to write three sentences for arrival, departure, and detour.',
  },
  'kpk2-lesson-13': {
    communication:
      'Give help or advice to three people using dative recipients.',
    vocabulary:
      'Make a support map with five people or institutions and the problems they can help with.',
    grammar:
      'Change five recipient phrases from nominative into dative, including one plural form.',
  },
  'kpk2-lesson-14': {
    communication:
      'Tell a short story about a tradition, moving from event to memory to reflection.',
    vocabulary:
      'Build two vocabulary clusters: cemetery/tradition words and history/society words.',
    grammar:
      'Write four sentences using się/siebie or personal pronouns, then name the referent in each.',
  },
  'kpk2-lesson-15': {
    communication:
      'Explain one holiday tradition and one recipe step to someone visiting Poland.',
    vocabulary:
      'List six holiday words and classify them as date, ritual, food, or public-life vocabulary.',
    grammar:
      'Write five impersonal instructions for preparing a holiday dish or organizing a visit.',
  },
  'kpk2-lesson-16': {
    communication:
      'Describe a travel mishap using before, after, when, and finally.',
    vocabulary:
      'Choose six adventure words and arrange them from calm beginning to dramatic ending.',
    grammar:
      'Join five short sentence pairs with a suitable conjunction and explain the relation.',
  },
  'kpk2-lesson-17': {
    communication:
      'Summarize a historical event in six sentences: background, action, consequence.',
    vocabulary:
      'Create a politics-and-society glossary with five words and learner-safe definitions.',
    grammar:
      'Choose imperfective or perfective aspect in five past-event sentences and justify each choice.',
  },
  'kpk2-lesson-18': {
    communication:
      'Talk about future plans involving animals, care, or responsibility.',
    vocabulary:
      'Sort eight animal words into home, farm, wild, and idiomatic uses.',
    grammar:
      'Write four quantity phrases with animals and dates, checking numeral government.',
  },
  'kpk2-lesson-19': {
    communication:
      'Respond to an environmental problem with outrage, then propose a conditional solution.',
    vocabulary:
      'Make an ecology word bank with causes, effects, and actions.',
    grammar:
      'Write five jeżeli..., to... sentences, including two in the conditional mood.',
  },
  'kpk2-lesson-20': {
    communication:
      'Compare two shopping habits and state which one you prefer and why.',
    vocabulary:
      'List six shopping or household-equipment words and add one complaint phrase for each.',
    grammar:
      'Write four subordinate clauses with byle, żeby, ponieważ, or chociaż.',
  },
  'kpk2-lesson-21': {
    communication:
      'Discuss a film or theatre problem and express one emotion clearly.',
    vocabulary:
      'Create two columns of art words: production words and audience-reaction words.',
    grammar:
      'Turn four active sentences about art or piracy into passive constructions.',
  },
  'kpk2-lesson-22': {
    communication:
      'Give one admiring and one critical opinion about an exhibition or photograph.',
    vocabulary:
      'Choose seven art words and use them to describe a single image or gallery visit.',
    grammar:
      'Use four -um nouns in context and mark which forms stay unchanged.',
  },
  'kpk2-lesson-23': {
    communication:
      'Explain an exam task to a classmate and give one piece of encouraging feedback.',
    vocabulary:
      'Make a mini assessment glossary with accuracy, fluency, command, praise, and complaint.',
    grammar:
      'Review three earlier grammar topics and write one self-check sentence for each.',
  },
};

const customObjectives: Record<string, string[]> = {
  'kpk2-lesson-01': [
    'Use instrumental forms to introduce roles, professions, and identity.',
    'Describe people through appearance, character, interests, and family status.',
    'Move from profile notes to a short spoken self-presentation.',
  ],
  'kpk2-lesson-13': [
    'Use dative forms for recipients, beneficiaries, and people affected by events.',
    'Talk about life problems and social support without flattening the situation.',
    'Connect volunteering vocabulary to short advice and help-giving tasks.',
  ],
};

function naturalJoin(values: string[]) {
  if (values.length <= 1) {
    return values[0] ?? 'the lesson topic';
  }

  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
}

function buildLessonFlow(unit: CurriculumUnitSeed): LessonFlowStep[] {
  return [
    {
      title: 'Notice',
      body: `Start from ${naturalJoin(unit.communication)} and identify the forms that carry the meaning.`,
    },
    {
      title: 'Build',
      body: `Use the ${naturalJoin(unit.vocabulary)} vocabulary set to create controlled examples before free production.`,
    },
    {
      title: 'Use',
      body: `Finish with a short speaking or writing task focused on ${naturalJoin(unit.grammar)}.`,
    },
  ];
}

function buildPracticeQuestions(unit: CurriculumUnitSeed): PracticeQuestion[] {
  const prompts =
    textbookQuestionPrompts[unit.id] ?? {
      communication: `Create a short communicative task for ${naturalJoin(unit.communication)}.`,
      vocabulary: `Build a word bank for ${naturalJoin(unit.vocabulary)}.`,
      grammar: `Write three examples focused on ${naturalJoin(unit.grammar)}.`,
    };

  return (['communication', 'vocabulary', 'grammar'] as const).map((skill) => ({
    id: `${unit.id}-${skill}`,
    skill,
    prompt: prompts[skill],
    selfCheck:
      skill === 'grammar'
        ? 'Check forms, agreement, and the trigger that makes this grammar necessary.'
        : 'Check that the answer is original, clear, and useful in a real learner situation.',
  }));
}

function addLessonContent(unit: CurriculumUnitSeed): CurriculumUnit {
  return {
    ...unit,
    objectives:
      customObjectives[unit.id] ??
      [
        `Communicate through ${naturalJoin(unit.communication)} with short, reusable language.`,
        `Build an active vocabulary set around ${naturalJoin(unit.vocabulary)}.`,
        `Practice ${naturalJoin(unit.grammar)} in original sentences and short tasks.`,
      ],
    lessonFlow: buildLessonFlow(unit),
    practiceQuestions: buildPracticeQuestions(unit),
  };
}

const curriculumUnitSeeds: CurriculumUnitSeed[] = [
  {
    id: 'a1-foundation',
    level: 'A1',
    lesson: 'Foundation',
    title: 'Alphabet, greetings, and first sentences',
    source: 'A1 platform scaffold',
    focus: 'Foundation content is scaffolded for later population.',
    communication: ['greetings', 'basic identity phrases'],
    vocabulary: ['alphabet', 'numbers', 'core phrases'],
    grammar: ['pronunciation', 'noun gender', 'present tense basics'],
    cases: ['nominative'],
    status: 'planned',
    minutes: 25,
  },
  {
    id: 'kpk2-lesson-01',
    level: 'A2',
    lesson: 'Lekcja 01',
    title: 'Proszę się przedstawić / Przedstawmy się',
    source: TEXTBOOK_SOURCE,
    focus: 'Self-presentation, personal description, preferences, and identity roles.',
    communication: ['introducing self and others', 'expressing preferences'],
    vocabulary: ['appearance and character', 'interests and marital status'],
    grammar: ['instrumental case'],
    cases: ['instrumental'],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'kpk2-lesson-02',
    level: 'A2',
    lesson: 'Lekcja 02',
    title: 'Nie lubię poniedziałku! / Dopełniacz jest wszędzie',
    source: TEXTBOOK_SOURCE,
    focus: 'Reporting events and talking about family through genitive-heavy patterns.',
    communication: ['reporting events', 'telling family stories'],
    vocabulary: ['natural disasters', 'biography'],
    grammar: ['genitive case'],
    cases: ['genitive'],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'kpk2-lesson-03',
    level: 'A2',
    lesson: 'Lekcja 03',
    title: 'Do kina czy na film? / Teatr żywych fotografii',
    source: TEXTBOOK_SOURCE,
    focus: 'Cinema plans, comparison, and prepositions for places and direction.',
    communication: ['buying cinema tickets', 'comparing options'],
    vocabulary: ['cinema and film', 'plot summaries'],
    grammar: ['static and dynamic prepositions', 'purpose clauses'],
    cases: ['locative', 'accusative', 'genitive'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-04',
    level: 'A2',
    lesson: 'Lekcja 04',
    title: 'Dwaj, trzej, czterej / Mistrzowie świata',
    source: TEXTBOOK_SOURCE,
    focus: 'Definitions, nationalities, professions, sports, and nominative plural control.',
    communication: ['building definitions', 'describing people and teams'],
    vocabulary: ['nationalities', 'professions', 'sport'],
    grammar: [
      'non-masculine-personal nominative plural',
      'masculine-personal nominative plural',
      'dwaj/trzej numerals',
    ],
    cases: ['nominative'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-05',
    level: 'A2',
    lesson: 'Lekcja 05',
    title: 'Ktoś, kogo lubię / Jacy oni są straszni!',
    source: TEXTBOOK_SOURCE,
    focus: 'Character description, definitions, and opinions about people.',
    communication: ['defining people', 'expressing opinions'],
    vocabulary: ['personality adjectives', 'character evaluation'],
    grammar: [
      'masculine-personal adjective plural',
      'ktoś, kto / człowiek, który',
      'adjectives used as nouns',
    ],
    cases: ['nominative'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-06',
    level: 'A2',
    lesson: 'Lekcja 06',
    title: 'Z komputerem za pan brat / Edukacja',
    source: TEXTBOOK_SOURCE,
    focus: 'Technology, Internet use, education, and study paths.',
    communication: ['talking about education', 'talking about qualifications'],
    vocabulary: ['computers and Internet', 'education'],
    grammar: ['verbal nouns'],
    cases: [],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'kpk2-lesson-07',
    level: 'A2',
    lesson: 'Lekcja 07',
    title: 'Szukanie pracy / Praca',
    source: TEXTBOOK_SOURCE,
    focus: 'Job search, workplace problems, CVs, cover letters, and email writing.',
    communication: ['job interviews', 'workplace problem talk', 'writing emails'],
    vocabulary: ['employment', 'types of companies', 'CV and cover letter'],
    grammar: ['review of previous material'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-08',
    level: 'A2',
    lesson: 'Lekcja 08',
    title: 'Proszę o kilka słów / Ja swoje wiem!',
    source: TEXTBOOK_SOURCE,
    focus: 'Interviews, origins, family background, and the pronoun swój.',
    communication: ['conducting interviews', 'telling personal background'],
    vocabulary: ['origin', 'family', 'self-information'],
    grammar: ['accusative case', 'pronoun swój'],
    cases: ['accusative'],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'kpk2-lesson-09',
    level: 'A2',
    lesson: 'Lekcja 09',
    title: 'Walizka czy plecak? / Nie zapomnij paszportu!',
    source: TEXTBOOK_SOURCE,
    focus: 'Orders, bans, travel preparation, packing, and airport situations.',
    communication: ['giving orders and bans', 'giving instructions'],
    vocabulary: ['travel and packing', 'camping equipment', 'airport'],
    grammar: [
      'imperative mood',
      'trzeba/można/warto/należy/powinno się',
    ],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-10',
    level: 'A2',
    lesson: 'Lekcja 10',
    title: 'Co jest w kartonach? / Kocham Cię Polsko!',
    source: TEXTBOOK_SOURCE,
    focus: 'Requests for information, messages, Polish tourist attractions, and address forms.',
    communication: ['asking for information', 'sending letters, emails, and SMS messages'],
    vocabulary: ['Polish tourist attractions', 'messages and correspondence'],
    grammar: ['locative review', 'vocative singular and plural'],
    cases: ['locative', 'vocative'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-11',
    level: 'A2',
    lesson: 'Lekcja 11',
    title: 'Wchodzisz czy wychodzisz? / Wejść czy wyjść?',
    source: TEXTBOOK_SOURCE,
    focus: 'Movement verbs for travel, tourism, and action reporting.',
    communication: ['reporting movement', 'narrating tourist situations'],
    vocabulary: ['movement', 'tourism', 'movement-based idioms'],
    grammar: ['motion verbs'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-12',
    level: 'A2',
    lesson: 'Lekcja 12',
    title: 'Jak tam dojechać? / Wjazd czy wyjazd?',
    source: TEXTBOOK_SOURCE,
    focus: 'Directions, road travel, dissatisfaction, discouraging, and complaints.',
    communication: ['asking for directions', 'expressing dissatisfaction', 'making complaints'],
    vocabulary: ['road traffic', 'transport', 'petrol station'],
    grammar: ['motion verbs'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-13',
    level: 'B1',
    lesson: 'Lekcja 13',
    title: 'Życie to nie bajka / Komu bije dzwon?',
    source: TEXTBOOK_SOURCE,
    focus: 'Life problems, relationships, volunteering, and dative forms.',
    communication: ['talking about life problems', 'describing social support'],
    vocabulary: ['life events', 'relationships', 'volunteering'],
    grammar: ['dative singular and plural'],
    cases: ['dative'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-14',
    level: 'B1',
    lesson: 'Lekcja 14',
    title: 'Zaduszki',
    source: TEXTBOOK_SOURCE,
    focus: 'Polish traditions, historical facts, and pronoun/preposition review.',
    communication: ['reporting events', 'describing traditions and historical facts'],
    vocabulary: ['Zaduszki', 'postwar history', 'knowledge of Poland'],
    grammar: ['się/siebie pronouns', 'personal pronoun review', 'preposition review'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-15',
    level: 'B1',
    lesson: 'Lekcja 15',
    title: 'Wolne od pracy / Wesołych Świąt!',
    source: TEXTBOOK_SOURCE,
    focus: 'Holiday traditions, history, dates, recipes, and impersonal forms.',
    communication: ['describing holiday traditions', 'telling historical context'],
    vocabulary: ['Polish holidays', 'holiday traditions'],
    grammar: ['date review', 'imperative review', 'impersonal forms'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-16',
    level: 'B1',
    lesson: 'Lekcja 16',
    title: 'Wszystko dobre, co się dobrze kończy / Przygody, przeżycia, wspomnienia',
    source: TEXTBOOK_SOURCE,
    focus: 'Adventures, memories, time relations, and conjunctions.',
    communication: ['describing situations', 'expressing time relations'],
    vocabulary: ['adventures', 'experiences', 'time expressions'],
    grammar: ['conjunction review'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-17',
    level: 'B1',
    lesson: 'Lekcja 17',
    title: 'Stan wojenny / Trochę historii',
    source: TEXTBOOK_SOURCE,
    focus: 'Past events, Polish history, politics, society, and aspect control.',
    communication: ['telling past events', 'reporting historical events'],
    vocabulary: ['Polish history', 'politics and society'],
    grammar: ['aspect review', 'aspect in the imperative'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-18',
    level: 'B1',
    lesson: 'Lekcja 18',
    title: 'Domowe / Królestwo zwierząt',
    source: TEXTBOOK_SOURCE,
    focus: 'Future talk, animals, idioms, numerals, and animal-type noun declension.',
    communication: ['talking about the future', 'describing animals'],
    vocabulary: ['animal names', 'idioms'],
    grammar: ['zwierzę-type noun declension', 'numeral government', 'date review'],
    cases: ['genitive'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-19',
    level: 'B1',
    lesson: 'Lekcja 19',
    title: 'Agro- / Zielono mi!',
    source: TEXTBOOK_SOURCE,
    focus: 'Agrotourism, ecology, environmental protection, and conditional hypotheses.',
    communication: ['expressing outrage', 'forming hypotheses and assumptions'],
    vocabulary: ['agrotourism', 'ecology', 'environmental protection'],
    grammar: ['jeżeli..., to...', 'conditional mood', 'conditional clauses'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-20',
    level: 'B1',
    lesson: 'Lekcja 20',
    title: 'Zakupy, zakupy / Rysopis Polaka konsumenta',
    source: TEXTBOOK_SOURCE,
    focus: 'Shopping, complaints, opinions, household goods, and complex clauses.',
    communication: ['comparing', 'asking for and expressing opinions'],
    vocabulary: ['shopping and complaints', 'household equipment', 'shops'],
    grammar: ['subordinate clauses', 'particle byle'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-21',
    level: 'B1',
    lesson: 'Lekcja 21',
    title: 'Strona bierna / Sztuka a piractwo',
    source: TEXTBOOK_SOURCE,
    focus: 'Film, theatre, emotions, online piracy, passive participles, and passive voice.',
    communication: ['talking about film and theatre', 'expressing emotions', 'discussing issues'],
    vocabulary: ['film and theatre', 'emotions', 'online piracy'],
    grammar: ['passive adjectival participle', 'passive voice'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-22',
    level: 'B1',
    lesson: 'Lekcja 22',
    title: 'Muzeum / Muzeum? Dlaczego nie!',
    source: TEXTBOOK_SOURCE,
    focus: 'Art discussion, admiration, critique, photography, exhibitions, and -um nouns.',
    communication: ['expressing admiration', 'expressing critical opinion', 'discussing art'],
    vocabulary: ['painting', 'photography', 'exhibitions and openings'],
    grammar: ['nouns ending in -um'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'kpk2-lesson-23',
    level: 'B1',
    lesson: 'Lekcja 23',
    title: 'Nauczycielka / Czas na egzamin',
    source: TEXTBOOK_SOURCE,
    focus: 'Final review and certification-exam orientation.',
    communication: ['reviewing exam tasks', 'understanding assessment language'],
    vocabulary: ['accuracy', 'fluency', 'assessment', 'praise and complaints'],
    grammar: ['certification exam review'],
    cases: [],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'b2-style-register',
    level: 'B2',
    lesson: 'Future track',
    title: 'Register and precision',
    source: 'Platform scaffold',
    focus: 'Advanced syntax, aspect choices, and formal register.',
    communication: ['formal discussion', 'argumentation'],
    vocabulary: ['formal register', 'advanced connectors'],
    grammar: ['advanced syntax', 'aspect refinement'],
    cases: [],
    status: 'planned',
    minutes: 50,
  },
  {
    id: 'c1-argumentation',
    level: 'C1',
    lesson: 'Future track',
    title: 'Argumentation and nuance',
    source: 'Platform scaffold',
    focus: 'Academic and professional Polish with precise stance-taking.',
    communication: ['academic argumentation', 'professional discussion'],
    vocabulary: ['stance-taking', 'disciplinary vocabulary'],
    grammar: ['complex discourse structures'],
    cases: [],
    status: 'planned',
    minutes: 55,
  },
];

export const curriculumUnits: CurriculumUnit[] =
  curriculumUnitSeeds.map(addLessonContent);
