import {PlatformShell} from './components/PlatformShell';
import {AuthGate} from './platform/auth/AuthGate';
import {AuthProvider} from './platform/auth/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <PlatformShell />
      </AuthGate>
    </AuthProvider>
  );
}
