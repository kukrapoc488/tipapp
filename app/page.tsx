import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('waiters').select('*')

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>{error ? error.message : 'connected to supabase ✓'}</p>
    </main>
  )
}