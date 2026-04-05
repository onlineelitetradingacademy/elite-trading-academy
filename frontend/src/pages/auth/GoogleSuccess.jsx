// GoogleSuccess.jsx — handles Google OAuth redirect
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../context/store';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export function GoogleSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    if (!token) { navigate('/auth/login'); return; }
    localStorage.setItem('token', token);
    authAPI.getMe().then(res => {
      setAuth(res.data.data, token, null);
      toast.success('Logged in with Google! 🎉');
      navigate('/dashboard');
    }).catch(() => { navigate('/auth/login'); });
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gold rounded-xl flex items-center justify-center font-display text-dark-900 text-3xl font-bold animate-pulse mx-auto mb-4">E</div>
        <p className="text-muted">Completing Google sign in...</p>
      </div>
    </div>
  );
}
export default GoogleSuccess;
