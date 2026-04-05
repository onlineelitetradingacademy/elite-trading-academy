// ── AuthLayout.jsx ────────────────────────────────────────────────
import { Outlet, Link } from 'react-router-dom';
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center font-display text-dark-900 text-xl font-bold">E</div>
          <div>
            <div className="font-display text-white text-base tracking-wider leading-none">ELITE</div>
            <div className="text-gold text-[10px] tracking-widest">TRADING ACADEMY</div>
          </div>
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
export default AuthLayout;
