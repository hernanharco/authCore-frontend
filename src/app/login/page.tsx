// src/app/login/page.tsx
import { AuthView } from '@/components/AuthView';

// ESTO ES UN SERVER COMPONENT
export default function LoginPage() {
  // ELIMINAMOS: const auth = useAuth(); <--- Esto causaba el error
  
  return (
    <main>
      {/* Simplemente renderizamos la Vista. 
         La Vista se encargará de llamar al Hook internamente.
      */}
      <AuthView />
    </main>
  );
}