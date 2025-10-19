import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FeaturedTypeTabs from '../components/FeaturedTypeTabs';
import CategoryCarouselClean from '../components/CategoryCarouselClean';

import { products } from '../data/products';
import heroVideo from '../assets/images/d74e90ff5ff8439aa70ba7559fa09ab7.HD-720p-4.5Mbps-51800263.mp4';
import foto2 from '../assets/images/foto2.jpg';

const Home = () => {
  const featuredProducts = products.slice(0, 4);
  const scrollToCategories = () => {
    const section = document.getElementById('categories');
    const title = document.getElementById('categories-title');
    const target = title || section;
    if (!target) return;

    // Calcula altura real del navbar fijo y su top actual (20px/40px) para sacar el offset exacto
    const navbar = document.getElementById('main-navbar');
    let headerOffset = 0;
    if (navbar) {
      const rect = navbar.getBoundingClientRect();
      const styles = getComputedStyle(navbar);
      const topPx = parseFloat(styles.top) || 0; // por ejemplo 20 o 40
      headerOffset = rect.height + topPx; // altura total ocupada desde el top
    }

    const desiredGap = 32; // separación visual extra para replicar la captura
    const y = target.getBoundingClientRect().top + window.scrollY - headerOffset - desiredGap;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
  <div className="min-h-screen text-gray-900">
      {/* Hero Section */}
      {/* Hero Video - Full screen menos el alto del carrusel superior (h-9 = 36px) */}
      <section
        className="relative w-full bg-black z-0"
        style={{ height: 'calc(100vh - 36px)' }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loopy
          muted
          playsInline
          preload="auto"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Overlay de texto y CTA sobre el video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Vuelvete imparable.
              </h1>
              <p className="text-white/90 text-base sm:text-lg mb-6">
                Cada entrenamiento es un gesto silencioso de poder. Eleva tu rendimiento con suplementos que hablan por ti.
              </p>
              <button
                onClick={scrollToCategories}
                type="button"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg px-5 py-3 transition-colors"
              >
                Ver productos ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
 
      <hr className="my-8 border-black" />
      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Los suplementos más populares de nuestra tienda
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           {/* Imagen full-bleed: ocupa todo el ancho de la pantalla */}
           <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-8">
            <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">DESDE $0</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantía</h3>
              <p className="text-gray-600">30 días de garantía</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Productos certificados</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Devoluciones</h3>
              <p className="text-gray-600">Fácil proceso de devolución</p>
            </div>
          </div>
        </div>
      </section>
             <img src={foto2} alt="Featured Products" className="w-screen h-auto object-cover" />
           </div>
          {/* Carrusel de Categorías - ubicado arriba del selector de combos */}
          <section id="categories" className="py-8 scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
            <CategoryCarouselClean />
          </section>
          <hr className="my-8 border-black" />
          {/* Tabs de filtrado por objetivo - Debajo de los productos */}
          <FeaturedTypeTabs 
            products={products}
          />
          
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
        <hr className="my-8 border-black" />

    
     
    </div>
  );
};

export default Home;