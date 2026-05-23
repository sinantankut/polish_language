import type {CefrLevel, PolishCase} from '../platform/schema';

export type CurriculumUnit = {
  id: string;
  level: CefrLevel;
  title: string;
  focus: string;
  cases: PolishCase[];
  status: 'available' | 'planned' | 'locked';
  minutes: number;
};

export const curriculumLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const curriculumUnits: CurriculumUnit[] = [
  {
    id: 'a1-sound-and-gender',
    level: 'A1',
    title: 'Sound, gender, and sentence basics',
    focus: 'Pronunciation, noun gender, and present-tense identity patterns',
    cases: ['nominative'],
    status: 'planned',
    minutes: 25,
  },
  {
    id: 'a2-identity-instrumental',
    level: 'A2',
    title: 'Identity and professions',
    focus: 'Instrumental case after identity and role expressions',
    cases: ['instrumental'],
    status: 'available',
    minutes: 35,
  },
  {
    id: 'a2-quantity-genitive',
    level: 'A2',
    title: 'Quantity, absence, and possession',
    focus: 'Genitive after numbers, negation, and possession patterns',
    cases: ['genitive'],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'b1-motion-accusative-locative',
    level: 'B1',
    title: 'Motion and location',
    focus: 'Accusative for direction and locative for static location',
    cases: ['accusative', 'locative'],
    status: 'available',
    minutes: 45,
  },
  {
    id: 'b1-recipients-and-address',
    level: 'B1',
    title: 'Recipients and direct address',
    focus: 'Dative recipients plus vocative names and forms of address',
    cases: ['dative', 'vocative'],
    status: 'available',
    minutes: 40,
  },
  {
    id: 'b2-style-register',
    level: 'B2',
    title: 'Register and precision',
    focus: 'Advanced syntax, aspect choices, and formal register',
    cases: [],
    status: 'planned',
    minutes: 50,
  },
  {
    id: 'c1-argumentation',
    level: 'C1',
    title: 'Argumentation and nuance',
    focus: 'Academic and professional Polish with precise stance-taking',
    cases: [],
    status: 'planned',
    minutes: 55,
  },
];
