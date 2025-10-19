import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import creatinasImg from '../assets/images/creatinas.jpg';
import proteinasImg from '../assets/images/proteinas.jpg';

const BASE = [
  { id: 1, name: 'Creatinas', image: creatinasImg, link: '/products/creatina' },
  { id: 2, name: 'Pre-entrenos', image: creatinasImg, link: '/products/preworkout' },
  { id: 3, name: 'Aminoácidos', image: creatinasImg, link: '/products/aminoacidos' },
  { id: 4, name: 'Vitaminas', image: proteinasImg, link: '/products/vitaminas' },
  { id: 5, name: 'Proteínas', image: proteinasImg, link: '/products/proteinas' },
  { id: 6, name: 'Complementos', image: proteinasImg, link: '/products/complementos' },
  { id: 7, name: 'Salud', image: creatinasImg, link: '/products/salud' },
  { id: 8, name: 'Comida', image: proteinasImg, link: '/products/comida' }
];

export default function CategoryCarouselClean() {
  const ref = useRef(null);
  const [adjusting, setAdjusting] = useState(false);
  const items = [...BASE, ...BASE, ...BASE];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const itemWidth = 240;
    el.scrollLeft = BASE.length * itemWidth;
  }, []);

  const onScroll = () => {
    const el = ref.current;
    if (!el || adjusting) return;
    const itemWidth = 240;
    const section = BASE.length * itemWidth;
    if (el.scrollLeft >= section * 2 - 100) {
      setAdjusting(true);
      el.scrollLeft = section;
      setTimeout(() => setAdjusting(false), 50);
    } else if (el.scrollLeft <= 100) {
      setAdjusting(true);
      el.scrollLeft = section;
      setTimeout(() => setAdjusting(false), 50);
    }
  };

  const nudge = (dir) => {
    const el = ref.current;
    if (!el) return;
    const amount = 300;
    const left = dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount;
    el.scrollTo({ left, behavior: 'smooth' });
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h2 id="categories-title" className="text-3xl font-bold text-center mb-8 text-gray-900">Categorías</h2>
        <p className="text-center text-gray-600 mb-8">Explora por categoría y encuentra lo que necesitas</p>

        <div className="relative">
          <button onClick={() => nudge('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all" aria-label="Anterior">
            <ChevronLeft size={24} className="text-orange-500" />
          </button>

          <div ref={ref} onScroll={onScroll} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {items.map((cat, idx) => (
              <Link key={`${cat.id}-${idx}`} to={cat.link} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  {/* Gradiente y texto superpuesto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-bold text-sm drop-shadow-sm">{cat.name}</h3>
                    <p className="text-[11px] text-white/90">Click para ver más</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button onClick={() => nudge('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all" aria-label="Siguiente">
            <ChevronRight size={24} className="text-orange-500" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}