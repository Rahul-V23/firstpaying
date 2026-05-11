'use client';

export default function DebugPage() {
  return (
    <div className="p-8 bg-[#0a0a0a] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      
      <div className="space-y-4 font-mono text-sm">
        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">NEXT_PUBLIC_SUPABASE_URL:</p>
          <p className="text-green-400">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
          <p className="text-green-400">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING'}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">OPENROUTER_API_KEY:</p>
          <p className="text-green-400">{process.env.OPENROUTER_API_KEY || 'MISSING'}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p className="text-gray-400">All env vars:</p>
          <pre className="text-green-400 overflow-auto">
            {JSON.stringify(process.env, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
