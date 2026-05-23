import type {PolishCase} from '../platform/schema';

export type DeclensionRow = {
  caseId: PolishCase;
  polishName: string;
  questions: string[];
  coreUses: string[];
  nounHints: string[];
};

export const declensionRows: DeclensionRow[] = [
  {
    caseId: 'nominative',
    polishName: 'mianownik',
    questions: ['kto?', 'co?'],
    coreUses: ['subject', 'dictionary form'],
    nounHints: ['baseline form before case changes'],
  },
  {
    caseId: 'genitive',
    polishName: 'dopełniacz',
    questions: ['kogo?', 'czego?'],
    coreUses: ['absence', 'quantity', 'possession', 'negation'],
    nounHints: ['watch masculine animacy and plural endings'],
  },
  {
    caseId: 'dative',
    polishName: 'celownik',
    questions: ['komu?', 'czemu?'],
    coreUses: ['recipient', 'beneficiary', 'experiencer'],
    nounHints: ['common after giving, helping, and feeling patterns'],
  },
  {
    caseId: 'accusative',
    polishName: 'biernik',
    questions: ['kogo?', 'co?'],
    coreUses: ['direct object', 'direction after movement'],
    nounHints: ['masculine animate often matches genitive'],
  },
  {
    caseId: 'instrumental',
    polishName: 'narzędnik',
    questions: ['kim?', 'czym?'],
    coreUses: ['tool', 'role', 'identity', 'with someone'],
    nounHints: ['often follows forms of być for professions and roles'],
  },
  {
    caseId: 'locative',
    polishName: 'miejscownik',
    questions: ['o kim?', 'o czym?'],
    coreUses: ['location', 'topic after selected prepositions'],
    nounHints: ['always prepositional in modern Polish'],
  },
  {
    caseId: 'vocative',
    polishName: 'wołacz',
    questions: ['o!'],
    coreUses: ['direct address'],
    nounHints: ['visible in names, titles, and formal address'],
  },
];
