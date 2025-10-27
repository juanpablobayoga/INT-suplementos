import { useEffect } from 'react';
import ProductList from '../../components/ProductList';

const CategoryPageBase = ({ 
  title, 
  apiCategory, 
  hero, 
  description,
  pageTitle,
  children 
}) => {
  
  // SEO: Cambiar el título de la página
  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle;
    }
    return () => {
      document.title = 'Tienda Suplementos'; // título por defecto
    };
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero personalizable */}
      {hero && (
        <section
          className="relative w-full bg-black z-0"
          style={{ height: hero.height || 'calc(100vh - 36px)' }}
        >
          {hero.type === 'image' && hero.src && (
            <img 
              src={hero.src} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          )}
          {hero.overlay && (
            <div className={`absolute inset-0 ${hero.overlay}`} />
          )}
          
          {/* Contenido superpuesto en el hero */}
          {hero.content && (
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4">
                {hero.content}
              </div>
            </div>
          )}
        </section>
      )}

      <div className="pt-36 md:pt-40 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título y descripción */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          {description && (
            <div className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </div>
          )}
        </div>

        {/* Contenido personalizable antes de los productos */}
        {children}

        {/* Lista de productos filtrada por categoría */}
        <ProductList category={apiCategory} />
      </div>
    </div>
  );
};

export default CategoryPageBase;