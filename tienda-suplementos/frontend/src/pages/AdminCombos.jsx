import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminCombos() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // Normalizar categoría
  const categoryName = category === 'volumen' ? 'Volumen' : 'Definición';

  const emptyCombo = {
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: categoryName,
    image: '',
    inStock: true,
    featured: false,
    products: []
  };

  const [form, setForm] = useState(emptyCombo);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/combos?category=${categoryName}`);
      setCombos(data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Error cargando combos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Validar categoría
    if (category !== 'volumen' && category !== 'definición' && category !== 'definicion') {
      navigate('/admin/products');
      return;
    }
    
    // Solo hacer fetch si está autenticado
    if (isAuthenticated && user?.role === 'admin') {
      fetchCombos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isAuthenticated, user]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCombo);
    setModalOpen(true);
  };

  const openEdit = (combo) => {
    setEditing(combo);
    setForm({
      name: combo.name || '',
      description: combo.description || '',
      price: combo.price || '',
      originalPrice: combo.originalPrice || '',
      category: combo.category,
      image: combo.image || '',
      inStock: combo.inStock !== false,
      featured: combo.featured || false,
      products: combo.products || []
    });
    setModalOpen(true);
  };

  const saveCombo = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', categoryName);
      formData.append('inStock', form.inStock);
      formData.append('featured', form.featured);
      
      if (form.originalPrice) formData.append('originalPrice', form.originalPrice);
      if (form.products && form.products.length > 0) {
        formData.append('products', JSON.stringify(form.products));
      }
      
      // Si hay una imagen nueva seleccionada
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      if (editing) {
        await axios.put(`/api/combos/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/combos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      fetchCombos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error guardando combo');
    } finally {
      setSaving(false);
    }
  };

  const deleteCombo = async (combo) => {
    if (!confirm('¿Eliminar este combo definitivamente?')) return;
    try {
      await axios.delete(`/api/combos/${combo._id}`);
      setCombos(cs => cs.filter(c => c._id !== combo._id));
    } catch (e) {
      alert('Error eliminando: ' + (e.response?.data?.message || 'intenta de nuevo'));
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="pt-24 md:pt-28 p-6 max-w-6xl mx-auto">
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Acceso restringido. Debes ser administrador para acceder a esta página.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 md:pt-28 p-6 max-w-6xl mx-auto">
        <p className="text-sm text-gray-500">Cargando combos...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-xs text-indigo-600 hover:underline mb-2 flex items-center gap-1"
          >
            ← Volver al Panel
          </button>
          <h1 className="text-2xl font-bold mb-1">Combos de {categoryName}</h1>
          <p className="text-sm text-gray-600">
            {combos.length} combo{combos.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchCombos}
            className="text-xs px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            Refrescar
          </button>
          
          {/* Botón verde para crear */}
          <button
            onClick={openCreate}
            title="Agregar Nuevo Combo"
            className="group cursor-pointer outline-none duration-300 hover:rotate-90 p-0 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              className="stroke-green-400 fill-none group-hover:fill-green-800 group-active:stroke-green-200 group-active:fill-green-600 group-active:duration-0 duration-300"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
          </button>
        </div>
      </header>

      {loading && <p className="text-sm text-gray-500">Cargando combos...</p>}
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</div>}

      {!loading && combos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No hay combos de {categoryName} aún</p>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Crear Primer Combo
          </button>
        </div>
      )}

      {/* Lista de combos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map(combo => (
          <div key={combo._id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-red-600 hover:shadow-lg transition-all duration-200">
            <div className="relative h-48 bg-gray-100">
              {combo.image && (
                <img
                  src={`${axios.defaults.baseURL}${combo.image}`}
                  alt={combo.name}
                  className="w-full h-full object-cover"
                />
              )}
              {!combo.inStock && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Sin Stock
                </div>
              )}
              {combo.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  Destacado
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-gray-900">{combo.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{combo.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-red-600">${combo.price}</span>
                {combo.originalPrice && combo.originalPrice > combo.price && (() => {
                  const pct = Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100);
                  return (
                    <>
                      <span className="text-sm text-gray-400 line-through">${combo.originalPrice}</span>
                      <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">-{pct}%</span>
                    </>
                  );
                })()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(combo)}
                  className="flex-1 px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-red-600 hover:text-red-700 transition-all"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteCombo(combo)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de creación/edición */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900">{editing ? 'Editar Combo' : 'Nuevo Combo'}</h2>
            
            <form onSubmit={saveCombo} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-700 focus:outline-none transition-all"
                  placeholder="Ej: Combo Ganancia Muscular"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-700 focus:outline-none transition-all"
                  placeholder="Describe los beneficios del combo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-700 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-700 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-700 transition-all"
                />
                {editing && form.image && !form.imageFile && (
                  <p className="text-xs text-gray-500 mt-2">Imagen actual: {form.image.split('/').pop()}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-red-700 transition-all">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={e => setForm({ ...form, inStock: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-red-700 focus:ring-2 focus:ring-red-700"
                    style={{ accentColor: '#b91c1c' }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800">Hay stock disponible</span>
                    <p className="text-xs text-gray-500">El combo está disponible para la venta</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-red-700 transition-all">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-red-700 focus:ring-2 focus:ring-red-700"
                    style={{ accentColor: '#b91c1c' }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800">Combo destacado</span>
                    <p className="text-xs text-gray-500">Aparecerá en la sección destacados</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Combo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
