import { useState } from 'react';

export default function ProductForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { title:'', description:'', price:'', condition:'Bekas baik', image:''});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, id: initial?.id || crypto.randomUUID(), createdAt: Date.now() };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required placeholder="Judul produk" className="w-full border border-slate-200 rounded-lg px-3 py-2" />
      <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} required placeholder="Deskripsi" className="w-full border border-slate-200 rounded-lg px-3 py-2" rows={3} />
      <div className="grid grid-cols-2 gap-3">
        <input value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} required type="number" min="0" placeholder="Harga" className="w-full border border-slate-200 rounded-lg px-3 py-2" />
        <select value={form.condition} onChange={(e)=>setForm({...form, condition:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2">
          <option>Bekas baik</option>
          <option>Seperti baru</option>
          <option>Butuh perbaikan</option>
        </select>
      </div>
      <input value={form.image} onChange={(e)=>setForm({...form, image:e.target.value})} placeholder="URL Gambar (CDN/hosting)" className="w-full border border-slate-200 rounded-lg px-3 py-2" />
      <button className="w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700">Simpan</button>
    </form>
  );
}
