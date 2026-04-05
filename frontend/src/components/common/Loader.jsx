// ── Loader.jsx ────────────────────────────────────────────────────
export function Loader() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gold rounded-xl flex items-center justify-center font-display text-dark-900 text-3xl font-bold animate-pulse">E</div>
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Loader;
