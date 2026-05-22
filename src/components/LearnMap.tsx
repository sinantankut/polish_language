import {CheckCircle2, Clock3, LockKeyhole} from 'lucide-react';
import {curriculumLevels, curriculumUnits} from '../data/curriculumSeed';

const statusStyles = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  planned: 'border-amber-200 bg-amber-50 text-amber-800',
  locked: 'border-stone-200 bg-stone-50 text-stone-500',
};

export function LearnMap() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-stone-950">Learn</h2>
        <p className="text-sm text-stone-600">
          A1-C1 structure, with A2-B1 active for the first release.
        </p>
      </div>

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
                    className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
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
