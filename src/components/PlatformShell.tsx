import {useState} from 'react';
import {BookOpen, ClipboardList, LogOut, Shield, Table2} from 'lucide-react';
import {AdminStudio} from './AdminStudio';
import {DeclensionTables} from './DeclensionTables';
import {LearnMap} from './LearnMap';
import {ReviewHome} from './ReviewHome';
import {useAuth} from '../platform/auth/AuthProvider';

type TabId = 'learn' | 'cases' | 'review' | 'admin';

const baseTabs = [
  {id: 'learn' as const, label: 'Learn', icon: BookOpen},
  {id: 'cases' as const, label: 'Cases', icon: Table2},
  {id: 'review' as const, label: 'Review', icon: ClipboardList},
];

export function PlatformShell() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('learn');
  const tabs =
    auth.profile?.role === 'admin'
      ? [...baseTabs, {id: 'admin' as const, label: 'Admin', icon: Shield}]
      : baseTabs;

  const currentTab = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : 'learn';

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-red-700">
              Polish Language Platform
            </p>
            <h1 className="text-2xl font-semibold text-stone-950">
              {auth.profile?.email}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void auth.signOut()}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:border-red-700 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex min-w-32 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition lg:w-full ${
                  isActive
                    ? 'bg-red-700 text-white'
                    : 'bg-white text-stone-700 hover:text-red-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div>
          {currentTab === 'learn' ? <LearnMap /> : null}
          {currentTab === 'cases' ? <DeclensionTables /> : null}
          {currentTab === 'review' ? <ReviewHome /> : null}
          {currentTab === 'admin' && auth.profile?.role === 'admin' ? (
            <AdminStudio />
          ) : null}
        </div>
      </div>
    </main>
  );
}
