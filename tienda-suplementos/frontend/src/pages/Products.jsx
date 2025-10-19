import ProductList from '../components/ProductList';
import { useLocation, useParams } from 'react-router-dom';
import { CATEGORY_META } from './categoryConfigs';

// Mapeo de slugs a las categorías originales (rollback)
const CATEGORY_SLUG_MAP = {
  proteinas: 'Proteínas',
  proteina: 'Proteínas', // tolera singular
  creatina: 'Creatina',
  aminoacidos: 'Aminoácidos',
  'pre-workout': 'Pre-Workout',
  preworkout: 'Pre-Workout',
  'pre-workouts': 'Pre-Workout',
  preworkouts: 'Pre-Workout',
  vitaminas: 'Vitaminas',
  otros: 'Otros'
};

function useQuery() {
  const { search } = useLocation();
  return Object.fromEntries(new URLSearchParams(search));
}

export default function Products() {
	const query = useQuery();
	const { category: categoryParam } = useParams();
	// Prioridad simple: slug en ruta > query param ?category > alias legacy ?cat
	const categoryQuery = query.category || query.cat;
	let rawCategory = categoryParam || categoryQuery || undefined;

	let normalizedCategory;
	if (rawCategory) {
		const slug = decodeURIComponent(rawCategory).trim().toLowerCase();
		normalizedCategory = CATEGORY_SLUG_MAP[slug];
	}

	const search = query.q || undefined;

	const meta = normalizedCategory ? CATEGORY_META[normalizedCategory] : undefined;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero condicional basado en configuración de categoría */}
			{meta?.hero && (
				<section
					className="relative w-full bg-black z-0"
					style={{ height: meta.hero.height || 'calc(100vh - 36px)' }}
				>
					{meta.hero.type === 'image' && (
						<img src={meta.hero.src} alt={normalizedCategory} className="absolute inset-0 w-full h-full object-cover" />
					)}
					{meta.hero.overlay && <div className={`absolute inset-0 ${meta.hero.overlay}`} />}
				</section>
			)}

			<div className="pt-36 md:pt-40 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900">{normalizedCategory || 'Todos los Productos'}</h1>
					<p className="mt-2 text-gray-600">{search ? `Resultados para "${search}"` : 'Explora nuestro catálogo completo'}</p>
				</div>
				<ProductList category={normalizedCategory} search={search} />
			</div>
		</div>
	);
}

