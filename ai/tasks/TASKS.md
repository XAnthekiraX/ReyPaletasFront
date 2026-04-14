# Tareas - ReyPaletas Frontend

## Fase 1: Configuración ✅ COMPLETADA

- [x] 1.1 Crear archivo `.env` con variables requeridas
- [x] 1.2 Instalar dependencias adicionales (@supabase/supabase-js, leaflet, react-leaflet, motion, @iconify/react)
- [x] 1.3 Crear estructura de carpetas src/

## Fase 2: Servicios y Estado ✅ COMPLETADA

- [x] 2.1 Configurar cliente Supabase
- [x] 2.2 Crear servicios de API (api-client.js)
- [x] 2.3 Crear AuthContext
- [x] 2.4 Crear CartContext
- [x] 2.5 Crear UIContext

## Fase 3: Componentes Globales ✅ COMPLETADA

- [x] 3.1 Layout (Header, Footer)
- [x] 3.2 Rutas públicas (Router)

## Fase 4: Páginas Públicas ✅ COMPLETADA

- [x] 4.1 Home (/)
- [x] 4.2 Sabores (/sabores)
- [x] 4.3 Quienes Somos (/quienes-somos)
- [x] 4.4 Puntos de Venta (/puntos-de-venta)
- [x] 4.5 Franquicias (/franquicias) - con OpenStreetMap
- [x] 4.6 Contactanos (/contactanos)
- [x] 4.7 Compras (/compras) - Carrito + WhatsApp

## Fase 5: Admin Panel ✅ COMPLETADA

- [x] 5.1 Ruta /admin y protección de rutas
- [x] 5.2 Login /admin/login
- [x] 5.3 Dashboard /admin
- [x] 5.4 Gestión Productos /admin/productos
- [x] 5.5 Gestión Categorías /admin/categorias
- [x] 5.6 Gestión Avisos /admin/avisos
- [x] 5.7 Gestión Franquicias /admin/franquicias

## Fase 6: Deployment ✅ COMPLETADA

- [x] 6.1 Configurar Vercel
- [x] 6.2 Variables de entorno en Vercel

## Fase 7: Mejoras y Optimizaciones

### Mejoras de Código

- [x] 7.1 Corregir warning de lint en Announcements.jsx (useEffect missing dependency)
- [x] 7.2 Reemplazar confirm() nativos por Sileo en todas las páginas admin
- [x] 7.3 Agregar validación de formato URL en campos de imagen (N/A - se usa input file)

### Mejoras de UX

- [x] 7.4 Agregar estados de loading en modales de categoría/ciudad
- [x] 7.5 Validación en tiempo real del formato de coordenadas (Franchises)
- [x] 7.6 Agregar tooltips o ayuda contextual en campos complejos

### Optimización de Rendimiento

- [x] 7.7 Implementar code splitting para rutas/admin
- [x] 7.8 Agregar memoización en componentes grandes (N/A - code splitting suficiente)
- [x] 7.9 Optimizar bundle (configurar manualChunks en Vite)

### Seguridad

- [x] 7.10 Agregar interceptor para manejo de 401 (token expirado)
- [ ] 7.11 Sanitizar inputs antes de enviar a API

### Testing

- [ ] 7.12 Configurar Vitest o Jest para tests unitarios
- [ ] 7.13 Agregar tests para componentes críticos (AuthContext, API service)

## Fase 8: Subida de Imágenes a Supabase

### Configuración

- [x] 8.1 Instalar `@supabase/supabase-js`
- [x] 8.2 Agregar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY al .env
- [x] 8.3 Crear cliente Supabase en src/services/supabase.js

### Funcionalidad de Upload

- [x] 8.4 Crear función uploadImage(file, bucket, folder) - retorna URL pública
- [x] 8.5 Crear función uploadMultipleImages(files, bucket, folder)

### Admin Products

- [x] 8.6 Agregar input file con preview en formulario de productos
- [x] 8.7 Integrar upload antes de guardar y guardar URL en image_url

### Admin Franchises

- [x] 8.8 Agregar input file para foto del gerente (manager_photo)
- [x] 8.9 Integrar upload y guardar URL

### Admin Announcements

- [x] 8.10 Agregar input file para imagen del aviso
- [x] 8.11 Integrar upload y guardar URL

### Verificación

- [ ] 8.12 Probar upload en cada módulo
- [ ] 8.13 Verificar URLs guardadas correctamente en la DB

## Fase 9: Cambios Visuales y Estructurales

### Admin Franquicias

- [x] 9.1 Eliminar campos photo, description y name de los datos mostrados en tabla de franquicias
- [ ] 9.2 Agregar selector de puntos de venta como franquicia con mapa
- [ ] 9.3 Implementar 2 pestañas: "Obtener un punto de venta" y "Ubicaciones"

### Public Footer

- [ ] 9.4 Cambiar slogan del footer por "Una delicia real"

### Public Hero

- [ ] 9.5 Reemplazar nombre de marca por logo en el Hero
