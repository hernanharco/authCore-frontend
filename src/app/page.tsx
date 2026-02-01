import { redirect } from 'next/navigation';

/**
 * Capa de Entrada Raíz
 * Como es un Server Component por defecto, usamos 'redirect'
 * para enviar al usuario a /login sin cargar HTML innecesario.
 */
export default function RootPage() {
  redirect('/login');
  
  // Este retorno nunca se ejecutará, pero TS lo requiere
  return null;
}