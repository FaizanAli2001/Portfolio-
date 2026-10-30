# Faizan Ali — Neon Portfolio

A Django-rendered, single-page portfolio with a futuristic neon visual system, a Three.js interactive 3D hero scene, GSAP scroll reveals, responsive layout and reduced-motion support.

## Run locally

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python manage.py runserver
```

Open http://127.0.0.1:8000

## Before publishing

1. Add your LinkedIn profile URL to the footer once you have the exact URL.
2. Review project dates, descriptions and experience wording for accuracy.
3. Set `DEBUG = False`, use an environment-based `SECRET_KEY`, and follow Django deployment guidance before production. `ALLOWED_HOSTS` includes the current Vercel domain and can be extended with a comma-separated `ALLOWED_HOSTS` environment variable or Vercel's `VERCEL_URL`.
4. Three.js and GSAP are loaded from CDNs; the 3D canvas needs WebGL. The page keeps its visual layout if animation libraries fail to load.

## Main technologies

- Django templates
- HTML / CSS / JavaScript
- Three.js (3D scene)
- GSAP + ScrollTrigger (motion)
