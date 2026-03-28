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

- [ ] 7.1 Corregir warning de lint en Announcements.jsx (useEffect missing dependency)
- [ ] 7.2 Reemplazar confirm() nativos por Sileo en todas las páginas admin
- [ ] 7.3 Agregar validación de formato URL en campos de imagen

### Mejoras de UX

- [ ] 7.4 Agregar estados de loading en modales de categoría/ciudad
- [ ] 7.5 Validación en tiempo real del formato de coordenadas (Franchises)
- [ ] 7.6 Agregar tooltips o ayuda contextual en campos complejos

### Optimización de Rendimiento

- [ ] 7.7 Implementar code splitting para rutas/admin
- [ ] 7.8 Agregar memoización en componentes grandes (ProductTable, FranchiseTable)
- [ ] 7.9 Optimizar bundle (configurar manualChunks en Vite)

### Seguridad

- [ ] 7.10 Agregar interceptor para manejo de 401 (token expirado)
- [ ] 7.11 Sanitizar inputs antes de enviar a API

### Testing

- [ ] 7.12 Configurar Vitest o Jest para tests unitarios
- [ ] 7.13 Agregar tests para componentes críticos (AuthContext, API service)
