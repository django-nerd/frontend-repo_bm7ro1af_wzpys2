import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic demo auth: store user in localStorage (no backend)
    const user = mode === 'login'
      ? { name: form.name || 'Pengguna', email: form.email, role: 'buyer' }
      : { name: form.name || 'Pengguna Baru', email: form.email, role: 'buyer' };
    localStorage.setItem('sfh_user', JSON.stringify(user));
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{mode === 'login' ? 'Masuk' : 'Daftar'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              required
              value={form.name}
              onChange={(e)=>setForm({...form, name:e.target.value})}
              placeholder="Nama"
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
            />
          )}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
            placeholder="Email"
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            placeholder="Password"
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
          />

          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
            {mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>
        <div className="text-sm text-center mt-3">
          {mode === 'login' ? (
            <button onClick={()=>setMode('register')} className="text-blue-600 hover:underline">Belum punya akun? Daftar</button>
          ) : (
            <button onClick={()=>setMode('login')} className="text-blue-600 hover:underline">Sudah punya akun? Masuk</button>
          )}
        </div>
      </div>
    </div>
  );
}
