import {useState} from 'react';
import {CheckCircle2, Clock3, LockKeyhole} from 'lucide-react';
import {curriculumLevels, curriculumUnits} from '../data/curriculumSeed';
import type {CurriculumUnit} from '../data/curriculumSeed';

const statusStyles = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  planned: 'border-amber-200 bg-amber-50 text-amber-800',
  locked: 'border-stone-200 bg-stone-50 text-stone-500',
};

function UnitDetail({
  label,
  values,
}: {
  label: string;
  values: CurriculumUnit['communication'];
}) {
  return (
    <div className="min-w-0 rounded-md bg-stone-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-stone-700">{values.join(', ')}</p>
    </div>
  );
}

function LessonWorkspace({unit}: {unit: CurriculumUnit}) {
  return (
    <section
      aria-label="Lesson workspace"
      className="border-y border-stone-200 bg-white px-4 py-5 shadow-sm sm:rounded-lg sm:border"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-800">
              {unit.lesson}
            </span>
            <span className="text-xs font-medium text-stone-500">{unit.source}</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-stone-950">
            {unit.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{unit.focus}</p>
        </div>
        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[unit.status]}`}
        >
          {unit.status}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1fr]">
        <div className="space-y-4">
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-normal text-stone-500">
              Objectives
            </h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">
              {unit.objectives.map((objective) => (
                <li key={objective} className="border-l-2 border-red-200 pl-3">
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-sm font-semibold uppercase tracking-normal text-stone-500">
              Lesson Flow
            </h4>
            <div className="mt-2 grid gap-2">
              {unit.lessonFlow.map((step) => (
                <div key={step.title} className="rounded-md bg-stone-50 px-3 py-2">
                  <p className="text-sm font-semibold text-stone-950">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-normal text-stone-500">
            Original Questions
          </h4>
          <div className="mt-2 grid gap-2">
            {unit.practiceQuestions.map((question) => (
              <article
                key={question.id}
                className="rounded-md border border-stone-200 px-3 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-semibold capitalize text-stone-700">
                    {question.skill}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-800">
                  {question.prompt}
                </p>
                <details className="mt-2 text-sm text-stone-600">
                  <summary className="cursor-pointer font-medium text-red-800">
                    Self-check
                  </summary>
                  <p className="mt-1 leading-6">{question.selfCheck}</p>
                </details>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export function LearnMap() {
  const firstAvailableUnit =
    curriculumUnits.find((unit) => unit.status === 'available') ??
    curriculumUnits[0];
  const [selectedUnitId, setSelectedUnitId] = useState(firstAvailableUnit.id);
  const selectedUnit =
    curriculumUnits.find((unit) => unit.id === selectedUnitId) ??
    firstAvailableUnit;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-stone-950">Learn</h2>
        <p className="text-sm text-stone-600">
          A1-C1 structure, with A2-B1 populated from the textbook chapter sequence.
        </p>
      </div>

      <LessonWorkspace unit={selectedUnit} />

      <div className="grid gap-4">
        {curriculumLevels.map((level) => {
          const units = curriculumUnits.filter((unit) => unit.level === level);

          return (
            <section key={level} className="grid gap-3 border-t border-stone-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-stone-950">{level}</h3>
                <span className="text-sm text-stone-500">{units.length} units</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {units.map((unit) => (
                  <article
                    key={unit.id}
                    className={`rounded-lg border bg-white p-4 shadow-sm ${
                      selectedUnit.id === unit.id
                        ? 'border-red-300'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-800">
                            {unit.lesson}
                          </span>
                          <span className="text-xs font-medium text-stone-500">
                            {unit.source}
                          </span>
                        </div>
                        <h4 className="font-semibold text-stone-950">{unit.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {unit.focus}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[unit.status]}`}
                      >
                        {unit.status === 'available' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : unit.status === 'planned' ? (
                          <Clock3 className="h-3.5 w-3.5" />
                        ) : (
                          <LockKeyhole className="h-3.5 w-3.5" />
                        )}
                        {unit.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 xl:grid-cols-3">
                      <UnitDetail label="Communication" values={unit.communication} />
                      <UnitDetail label="Vocabulary" values={unit.vocabulary} />
                      <UnitDetail label="Grammar" values={unit.grammar} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {unit.cases.length > 0 ? (
                        unit.cases.map((caseId) => (
                          <span
                            key={caseId}
                            className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-700"
                          >
                            {caseId}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-500">
                          advanced structure
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedUnitId(unit.id)}
                      className="mt-4 inline-flex items-center justify-center rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-red-700 hover:text-red-700"
                    >
                      Open lesson {unit.lesson}: {unit.title}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
