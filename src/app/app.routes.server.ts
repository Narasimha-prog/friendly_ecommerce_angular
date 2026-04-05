import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages: prerender at build time
  {
    path: '', // Home page
    renderMode: RenderMode.Server,
  },
  {
    path: 'products', // Product listing page (can be static)
    renderMode: RenderMode.Server,
  },

  // Dynamic pages: generate HTML at runtime with SSR
  {
    path: 'products/:publicId', // Product details with dynamic ID
    renderMode: RenderMode.Server,
  },
  {
    path: 'cart', // Cart page, depends on user session
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/products/list', // Admin pages
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/products/create',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/categories/list',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/categories/create',
    renderMode: RenderMode.Server,
  },

  // Catch-all fallback
   // Correct fallback patterns
  {
    path: '**',  // Angular's standard wildcard pattern
    renderMode: RenderMode.Server,
  },
];
