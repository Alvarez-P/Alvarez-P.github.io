# alvarez.dev

Portfolio personal con interfaz Spotify — CV interactivo de Adolfo Esteban Alvarez Pacheco, Backend Engineer.

## Stack

- [Astro](https://astro.build) — static site generation
- CSS puro — sin frameworks de UI
- SVG inline — íconos y covers geométricos personalizados por proyecto
- View Transitions — navegación SPA fluida entre vistas

## Vistas

| Ruta | Contenido |
|------|-----------|
| `/` | Inicio — vista de artista Spotify con avatar, tracks populares y typewriter animado |
| `/experiencia` | Discografía profesional — grid de álbumes con detalle expandible al click |
| `/about` | Bio + stack como tracklist, especialidades como genre cards, filosofía |
| `/contact` | Enlaces de contacto y disponibilidad |


## Desarrollo

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build   # output en dist/
npm run preview # previsualizar build
```

## Despliegue

Sitio estático — deployable en cualquier host que sirva archivos:

```bash
npm run build
# Subir dist/ a GitHub Pages, Vercel, Netlify, etc.
```
