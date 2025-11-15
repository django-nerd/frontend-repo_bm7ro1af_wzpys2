import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import ProductForm from './components/ProductForm';

const LS_KEYS = {
  products: 'sfh_products',
  user: 'sfh_user',
  cart: 'sfh_cart',
  orders: 'sfh_orders',
};

function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [route, setRoute] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setUser(loadLS(LS_KEYS.user, null));
    setProducts(loadLS(LS_KEYS.products, demoProducts()));
    setCart(loadLS(LS_KEYS.cart, []));
    setOrders(loadLS(LS_KEYS.orders, []));
  }, []);

  useEffect(() => saveLS(LS_KEYS.user, user), [user]);
  useEffect(() => saveLS(LS_KEYS.products, products), [products]);
  useEffect(() => saveLS(LS_KEYS.cart, cart), [cart]);
  useEffect(() => saveLS(LS_KEYS.orders, orders), [orders]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleAddProduct = (data) => {
    const owner = user?.email || 'anon@example.com';
    const next = [{ ...data, owner }, ...products];
    setProducts(next);
    setRoute('home');
  };

  const handleEditProduct = (data) => {
    const next = products.map(p => p.id === data.id ? { ...p, ...data } : p);
    setProducts(next);
    setRoute('profile');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(x => x.id === item.id);
      if (exists) return prev.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const checkout = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (cart.length === 0) return;
    const newOrder = {
      id: crypto.randomUUID(),
      items: cart,
      buyer: user.email,
      total: cart.reduce((s, i) => s + Number(i.price) * i.qty, 0),
      createdAt: Date.now(),
      status: 'Proses',
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    alert('Pesanan dibuat. Penjual akan dihubungi di luar sistem.');
    setRoute('home');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEYS.user);
  };

  const myListings = useMemo(() => products.filter(p => p.owner === user?.email), [products, user]);
  const myOrders = useMemo(() => orders.filter(o => o.buyer === user?.email), [orders, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar
        onNavigate={setRoute}
        onOpenAuth={() => setAuthOpen(true)}
        currentUser={user}
        onLogout={logout}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onSearchChange={setSearch}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {route === 'home' && (
          <Home
            items={filtered}
            onSelect={setSelected}
            onAdd={addToCart}
          />
        )}

        {route === 'sell' && (
          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Jual Barang</h2>
              <p className="text-slate-600 mb-4">Masukkan detail produk bekas Anda. Gambar gunakan URL dari hosting/CDN.</p>
              {!user && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800">Anda perlu masuk untuk menjual produk.</div>
              )}
              <ProductForm onSubmit={user ? handleAddProduct : () => alert('Silakan masuk dahulu.')} />
            </div>
            <Tips />
          </section>
        )}

        {route === 'profile' && (
          <Profile
            user={user}
            listings={myListings}
            orders={myOrders}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onNeedLogin={() => setAuthOpen(true)}
          />
        )}

        {route === 'cart' && (
          <Cart cart={cart} setCart={setCart} onCheckout={checkout} />
        )}

        {route === 'admin' && (
          <AdminPanel user={user} products={products} orders={orders} onDelete={handleDeleteProduct} />
        )}
      </main>

      {selected && (
        <ProductDetail item={selected} onClose={() => setSelected(null)} onAdd={() => addToCart(selected)} />
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} />
    </div>
  );
}

function Home({ items, onSelect, onAdd }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Produk Terbaru</h2>
        <span className="text-slate-500 text-sm">{items.length} produk</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(it => (
          <div key={it.id} className="relative">
            <ProductCard item={it} onClick={() => onSelect(it)} />
            <div className="absolute right-2 top-2">
              <button onClick={(e)=>{e.stopPropagation(); onAdd(it);}} className="px-2 py-1 text-xs rounded bg-blue-600 text-white">Tambah</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tips() {
  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-4 h-max">
      <h3 className="font-semibold text-slate-800 mb-2">Tips Foto Produk</h3>
      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
        <li>Gunakan pencahayaan alami</li>
        <li>Ambil dari beberapa sudut</li>
        <li>Hindari background yang ramai</li>
        <li>Unggah ke hosting gambar lalu tempel URL</li>
      </ul>
    </aside>
  );
}

function Profile({ user, listings, orders, onEdit, onDelete, onNeedLogin }) {
  if (!user) return (
    <div className="bg-amber-50 text-amber-800 p-4 rounded-lg">Anda harus masuk untuk melihat profil. <button className="underline" onClick={onNeedLogin}>Masuk</button></div>
  );
  return (
    <section className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-3">Listing Saya</h2>
        {listings.length === 0 && <div className="text-slate-500">Belum ada listing.</div>}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <img src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'} alt={item.title} className="w-full aspect-square object-cover" />
              <div className="p-3 space-y-2">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-slate-600">Rp {Number(item.price).toLocaleString('id-ID')}</div>
                <div className="flex gap-2">
                  <EditButton item={item} onEdit={onEdit} />
                  <button onClick={()=>onDelete(item.id)} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Pesanan Saya</h2>
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="font-medium">Order #{o.id.slice(0,6)}</div>
              <div className="text-sm text-slate-600">{new Date(o.createdAt).toLocaleString('id-ID')}</div>
              <div className="text-sm">Total: <span className="font-semibold">Rp {Number(o.total).toLocaleString('id-ID')}</span></div>
              <div className="text-xs text-slate-500">{o.items.length} item</div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-slate-500">Belum ada pesanan.</div>}
        </div>
      </div>
    </section>
  );
}

function EditButton({ item, onEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-1 rounded bg-slate-900 text-white">Edit</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Edit Produk</div>
              <button onClick={()=>setOpen(false)}>✕</button>
            </div>
            <ProductForm initial={item} onSubmit={(data)=>{onEdit(data); setOpen(false);}} />
          </div>
        </div>
      )}
    </>
  );
}

function Cart({ cart, setCart, onCheckout }) {
  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const updateQty = (id, d) => {
    setCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  };
  const remove = (id) => setCart(prev => prev.filter(x => x.id !== id));
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Keranjang</h2>
      {cart.length === 0 ? (
        <div className="text-slate-500">Keranjang kosong.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 flex gap-3 items-center">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-slate-600">Rp {Number(item.price).toLocaleString('id-ID')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateQty(item.id, -1)} className="px-2 py-1 rounded bg-slate-100">-</button>
                  <div>{item.qty}</div>
                  <button onClick={()=>updateQty(item.id, 1)} className="px-2 py-1 rounded bg-slate-100">+</button>
                </div>
                <button onClick={()=>remove(item.id)} className="px-3 py-1 rounded bg-red-50 text-red-700">Hapus</button>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 h-max">
            <div className="font-semibold mb-2">Ringkasan</div>
            <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>Rp {Number(total).toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between text-sm mb-3"><span>Ongkir</span><span>Rp 0</span></div>
            <button onClick={onCheckout} className="w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700">Checkout</button>
          </div>
        </div>
      )}
    </section>
  );
}

function AdminPanel({ user, products, orders, onDelete }) {
  if (!user || user.role !== 'admin') {
    return <div className="bg-rose-50 text-rose-700 p-3 rounded-lg">Akses admin diperlukan.</div>;
  }
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Semua Produk</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="font-medium line-clamp-1">{p.title}</div>
              <div className="text-sm text-slate-600">Pemilik: {p.owner}</div>
              <div className="text-sm">Rp {Number(p.price).toLocaleString('id-ID')}</div>
              <button onClick={()=>onDelete(p.id)} className="mt-2 px-3 py-1 rounded bg-red-50 text-red-700">Hapus</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Transaksi</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="font-medium">Order #{o.id.slice(0,6)}</div>
              <div className="text-sm text-slate-600">{new Date(o.createdAt).toLocaleString('id-ID')}</div>
              <div className="text-sm">Pembeli: {o.buyer}</div>
              <div className="text-sm">Total: Rp {Number(o.total).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductDetail({ item, onClose, onAdd }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/40 overflow-y-auto">
      <div className="min-h-full p-4 grid place-items-center">
        <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                <button onClick={onClose} className="text-slate-500">✕</button>
              </div>
              <div className="mt-1 text-sm text-slate-500">{item.condition}</div>
              <div className="mt-3 text-2xl font-bold text-blue-700">Rp {Number(item.price).toLocaleString('id-ID')}</div>
              <p className="mt-3 text-slate-700 whitespace-pre-wrap">{item.description}</p>
              <div className="mt-5 flex gap-3">
                <button onClick={onAdd} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Tambah ke Keranjang</button>
                <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function demoProducts() {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Laptop Bekas i5 8GB RAM',
      description: 'Kondisi sangat baik, baterai masih awet. Termasuk charger.',
      price: 3500000,
      condition: 'Seperti baru',
      image: 'https://images.unsplash.com/photo-1653976499575-6aacb2644727?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxMYXB0b3AlMjBCZWthcyUyMGk1JTIwOEdCJTIwUkFNfGVufDB8MHx8fDE3NjMyMTY3OTd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
      owner: 'seller1@example.com',
      createdAt: Date.now() - 86400000,
    },
    {
      id: crypto.randomUUID(),
      title: 'Sepeda Lipat Bekas',
      description: 'Ringan dan praktis, cocok untuk komuter. Ada bekas pemakaian.',
      price: 1200000,
      condition: 'Bekas baik',
      image: 'https://images.unsplash.com/photo-1520962922320-2038eebab146?q=80&w=1200&auto=format&fit=crop',
      owner: 'seller2@example.com',
      createdAt: Date.now() - 172800000,
    },
    {
      id: crypto.randomUUID(),
      title: 'Kamera Mirrorless',
      description: 'Lensa kit 16-50mm, shutter count < 15k. Siap pakai.',
      price: 2800000,
      condition: 'Bekas baik',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
      owner: 'seller3@example.com',
      createdAt: Date.now() - 259200000,
    },
    {
      id: crypto.randomUUID(),
      title: 'Ponsel Android',
      description: 'RAM 6GB/128GB, layar mulus. Minus batre sedikit drop.',
      price: 1500000,
      condition: 'Butuh perbaikan',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop',
      owner: 'seller4@example.com',
      createdAt: Date.now() - 300000000,
    },
  ];
}
