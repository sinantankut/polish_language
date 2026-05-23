import {declensionRows} from '../data/declensionTables';

export function DeclensionTables() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-stone-950">Cases</h2>
        <p className="mt-1 text-sm text-stone-600">
          Fast reference for the seven Polish cases and their core jobs.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[160px_150px_1fr_1fr] gap-4 border-b border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 md:grid">
          <span>Case</span>
          <span>Questions</span>
          <span>Core uses</span>
          <span>Noun hints</span>
        </div>
        {declensionRows.map((row) => (
          <article
            key={row.caseId}
            className="grid gap-3 border-b border-stone-100 px-4 py-4 last:border-b-0 md:grid-cols-[160px_150px_1fr_1fr] md:gap-4"
          >
            <div>
              <h3 className="font-semibold capitalize text-stone-950">{row.caseId}</h3>
              <p className="text-sm text-stone-500">{row.polishName}</p>
            </div>
            <p className="text-sm font-medium text-red-800">{row.questions.join(' / ')}</p>
            <p className="text-sm leading-6 text-stone-700">{row.coreUses.join(', ')}</p>
            <p className="text-sm leading-6 text-stone-600">{row.nounHints.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
