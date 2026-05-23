import {BarChart3, Repeat2, Target} from 'lucide-react';

export function ReviewHome() {
  const items = [
    {label: 'Due cards', value: '0', icon: Repeat2},
    {label: 'Case accuracy', value: '--', icon: Target},
    {label: 'Weekly attempts', value: '0', icon: BarChart3},
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-stone-950">Review</h2>
        <p className="mt-1 text-sm text-stone-600">
          Progress tracking will connect to completed exercise attempts.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-lg border border-stone-200 bg-white p-4">
              <Icon className="h-5 w-5 text-red-700" />
              <p className="mt-4 text-2xl font-semibold text-stone-950">{item.value}</p>
              <p className="text-sm text-stone-500">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
