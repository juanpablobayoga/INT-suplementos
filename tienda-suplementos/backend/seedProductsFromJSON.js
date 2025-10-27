// backend/seedProductsFromJSON.js
// Script mejorado para poblar la base de datos desde archivo JSON
// Uso: npm run seed:json [opciones]
// Opciones: --clean (limpiar antes), --category="Proteínas" (solo una categoría)

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

// Función para normalizar categorías (coincide con el backend)
const normalizeCategory = (c) => {
  const cat = (c || '').trim();
  const map = {
    'Pre-Workout': 'Pre-entrenos y Energía',
    'Aminoácidos': 'Aminoácidos y Recuperadores',
    'Vitaminas': 'Salud y Bienestar',
    'Para la salud': 'Salud y Bienestar',
    'Complementos': 'Rendimiento hormonal',
    'Comida': 'Comidas con proteína',
    'Creatina': 'Creatinas',
    // Nuevas (ya normalizadas)
    'Proteínas': 'Proteínas',
    'Pre-entrenos y Energía': 'Pre-entrenos y Energía',
    'Creatinas': 'Creatinas',
    'Aminoácidos y Recuperadores': 'Aminoácidos y Recuperadores',
    'Salud y Bienestar': 'Salud y Bienestar',
    'Rendimiento hormonal': 'Rendimiento hormonal',
    'Comidas con proteína': 'Comidas con proteína'
  };
  return map[cat] || cat || 'Sin categoría';
};

async function seedProducts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Leer archivo JSON
    const jsonPath = path.join(__dirname, 'data', 'products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ No se encontró el archivo data/products.json');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let productsToInsert = data.products || [];

    // Normalizar categorías
      // Normalizar categorías y asegurar campos obligatorios (baseSize, image, price)
      productsToInsert = productsToInsert.map(raw => {
        const product = { ...raw };
        // Normalizar categoría
        product.category = normalizeCategory(product.category);

        // Convertir price a number cuando venga como string, eliminar símbolos
        if (typeof product.price === 'string') {
          const cleaned = product.price.replace(/[^0-9.,-]/g, '').replace(',', '.');
          product.price = Number(cleaned);
        }

        // Aceptar 0 como precio, pero si es undefined/null marcar como inválido más adelante
        if (product.price === undefined || product.price === null || Number.isNaN(product.price)) {
          // dejarlo como está; la validación posterior lo filtrará y mostrará advertencia
        } else {
          product.price = Number(product.price);
          if (product.price < 0) product.price = Math.abs(product.price);
        }

        // Asegurar tamaño base obligatorio
        product.baseSize = product.baseSize || product.size || (Array.isArray(product.variants) && product.variants[0] && product.variants[0].size) || '1 unidad';

        // Imagen por defecto si no existe
        product.image = product.image || (Array.isArray(product.images) && product.images[0]) || '/placeholder-product.png';

        // Normalizar variantes y sabores si existen
        if (Array.isArray(product.variants)) {
          product.variants = product.variants.map(v => ({
            size: v.size || product.baseSize || '1 unidad',
            price: Number(v.price) || product.price || 0,
            image: v.image || product.image,
            stock: typeof v.stock === 'number' ? v.stock : (product.stock || 0)
          }));
        }

        if (Array.isArray(product.flavors)) {
          product.flavors = product.flavors.filter(f => typeof f === 'string' && f.trim() !== '').map(f => f.trim());
        }

        return product;
      });

    // Procesar argumentos de línea de comandos
    const args = process.argv.slice(2);
    const shouldClean = args.includes('--clean');
    const categoryFilter = args.find(arg => arg.startsWith('--category='))?.split('=')[1];

    // Filtrar por categoría si se especifica
    if (categoryFilter) {
      const normalizedFilter = normalizeCategory(categoryFilter);
      productsToInsert = productsToInsert.filter(p => p.category === normalizedFilter);
      console.log(`🔍 Filtrando productos de categoría: ${normalizedFilter}`);
    }

    console.log(`📦 Productos a procesar: ${productsToInsert.length}`);

    // Limpiar productos existentes si se solicita
    if (shouldClean) {
      const deleted = await Product.deleteMany({});
      console.log(`🗑️  Productos eliminados: ${deleted.deletedCount}`);
    }

    // Validar productos antes de insertar
    // Validar productos antes de insertar (aceptamos precio 0, pero price debe existir)
    const validProducts = [];
    for (const product of productsToInsert) {
      if (!product.name || !product.category || product.price === undefined || product.price === null || Number.isNaN(product.price)) {
        console.warn(`⚠️  Producto inválido (faltan campos): ${product.name || 'Sin nombre'} - category:${product.category} price:${product.price}`);
        continue;
      }

      // Asegurar baseSize e image (deben existir para el esquema)
      if (!product.baseSize) product.baseSize = '1 unidad';
      if (!product.image) product.image = '/placeholder-product.png';

      validProducts.push(product);
    }

    console.log(`✅ Productos válidos: ${validProducts.length}`);

    // Insertar productos
    if (validProducts.length > 0) {
      try {
        // Verificar duplicados por nombre
        let insertedCount = 0;
        let updatedCount = 0;

        for (const product of validProducts) {
          const existing = await Product.findOne({ name: product.name });
          
          if (existing && !shouldClean) {
            // Actualizar producto existente
            await Product.findByIdAndUpdate(existing._id, product);
            updatedCount++;
            console.log(`🔄 Actualizado: ${product.name}`);
          } else {
            // Insertar nuevo producto
            await Product.create(product);
            insertedCount++;
            console.log(`➕ Insertado: ${product.name}`);
          }
        }

        console.log(`\n📊 RESUMEN:`);
        console.log(`   ➕ Productos insertados: ${insertedCount}`);
        console.log(`   🔄 Productos actualizados: ${updatedCount}`);
        console.log(`   📈 Total procesados: ${insertedCount + updatedCount}`);

        // Mostrar estadísticas por categoría
        const categories = await Product.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        
        console.log(`\n📋 PRODUCTOS POR CATEGORÍA:`);
        categories.forEach(cat => {
          console.log(`   ${cat._id}: ${cat.count} productos`);
        });

      } catch (insertError) {
        console.error('❌ Error al insertar productos:', insertError.message);
        process.exit(1);
      }
    }

    console.log('\n🎉 ¡Seed completado exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

// Mostrar ayuda si se solicita
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📖 AYUDA - Seed de Productos desde JSON

Uso:
  npm run seed:json                           # Insertar/actualizar todos los productos
  npm run seed:json --clean                  # Limpiar BD e insertar todos
  npm run seed:json --category="Proteínas"   # Solo productos de una categoría
  npm run seed:json --clean --category="Creatinas"  # Limpiar e insertar solo creatinas

Archivo de datos:
  backend/data/products.json

Categorías válidas:
  - Proteínas
  - Creatinas
  - Pre-entrenos y Energía
  - Aminoácidos y Recuperadores
  - Salud y Bienestar
  - Rendimiento hormonal
  - Comidas con proteína
`);
  process.exit(0);
}

seedProducts();