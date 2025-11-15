import { Search, PlusCircle, ShoppingCart, User, Shield } from "lucide-react";

export default function Navbar({ onNavigate, onOpenAuth, currentUser, onLogout, cartCount, onSearchChange }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="text-xl font-bold text-slate-800">
          Sale-Finds Hub
        </button>
        <span className="ml-2 text-xs text-slate-500 hidden sm:inline">Marketplace Barang Bekas Terpercaya</span>
        <div className="flex-1" />
        <div className="relative max-w-md w-full hidden md:block">
          <input
            onChange={(e)=> onSearchChange(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => onNavigate('sell')}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <PlusCircle className="w-5 h-5" />
          Jual
        </button>
        <button
          onClick={() => onNavigate('cart')}
          className="relative p-2 rounded-lg hover:bg-slate-100"
        >
          <ShoppingCart className="w-6 h-6 text-slate-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 grid place-items-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
        <div className="relative">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' && (
                <button onClick={() => onNavigate('admin')} className="p-2 rounded-lg hover:bg-slate-100" title="Admin">
                  <Shield className="w-5 h-5 text-amber-600" />
                </button>
              )}
              <button onClick={() => onNavigate('profile')} className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                <User className="w-5 h-5" /> {currentUser.name}
              </button>
              <button onClick={onLogout} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
              <User className="w-5 h-5" /> Masuk
            </button>
          )}
        </div>
      </div>
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            onChange={(e)=> onSearchChange(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
    </header>
  );
}
