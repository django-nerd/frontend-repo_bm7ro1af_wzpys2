export default function ProductCard({ item, onClick }) {
  return (
    <button onClick={onClick} className="group text-left bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
      <div className="aspect-square w-full bg-slate-100 overflow-hidden">
        <img src={item.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
        <div className="mt-2 font-bold text-blue-700">Rp {Number(item.price).toLocaleString('id-ID')}</div>
        <div className="mt-1 text-xs text-slate-500">{item.condition || 'Bekas baik'}</div>
      </div>
    </button>
  );
}
