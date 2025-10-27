import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Dumbbell, TrendingUp, Activity, Package } from 'lucide-react';

const AdminPageManagement = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Catálogo',
      icon: Package,
      description: 'Gestionar categorías de productos',
      path: '/admin/catalog',
    },
    {
      title: 'Accesorios',
      icon: Dumbbell,
      description: 'Gestionar accesorios y subcategorías',
      path: '/admin/accessories',
    },
    {
      title: 'Volumen',
      icon: TrendingUp,
      description: 'Ver productos de volumen',
      path: '/products/volumen',
    },
    {
      title: 'Definición',
      icon: Activity,
      description: 'Ver productos de definición',
      path: '/products/definicion',
    },
    {
      title: 'Inicio',
      icon: ShoppingBag,
      description: 'Ir a la página de inicio',
      path: '/',
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 mt-8">
      <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-6 border-2 border-red-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Administración de Página</h2>
        <p className="text-gray-600">Navega por las diferentes secciones de la tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="group bg-white border-2 border-gray-200 rounded-lg p-6 text-left transition-all duration-200 hover:border-red-600 hover:shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-red-50 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                  <Icon size={24} className="text-red-600 group-hover:text-white transition-colors" />
                </div>
                
                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {section.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center text-red-600 font-semibold text-sm pt-2 border-t border-gray-100 group-hover:text-red-700 transition-colors">
                  <span>Administrar</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPageManagement;
