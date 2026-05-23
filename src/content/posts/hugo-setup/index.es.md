---
title: "Cómo monté este blog con Hugo y Hextra"
date: 2025-01-20
draft: false
slug: "como-monte-este-blog"
description: "Guía rápida de cómo configuré Hugo con el tema Hextra y despliegue en Cloudflare Pages."
summary: "Guía rápida de cómo configuré Hugo con el tema Hextra y despliegue en Cloudflare Pages."
category: carrera
tags: [tutorial, herramientas, rendimiento]
cover:
  image: "cover.png"
  alt: "Cover image"
lang: "es"
---

## El stack

Este blog está construido con:

- **Hugo** como generador de sitios estáticos
- **Hextra** como tema
- **Cloudflare Pages** para el despliegue

### ¿Por qué Hugo?

Velocidad. Hugo compila cientos de páginas en milisegundos. No necesita Node.js, no tiene dependencias pesadas. Es un binario que funciona y punto.

### ¿Por qué Hextra?

Es limpio, moderno y tiene soporte bilingüe nativo. Además incluye modo oscuro, búsqueda integrada con Flexsearch, tabla de contenidos automática, zoom en imágenes y un sistema de configuración muy organizado. Todo out-of-the-box.

### Despliegue

Cloudflare Pages detecta Hugo automáticamente. Solo necesitas:

1. Conectar tu repositorio de GitHub
2. Configurar el comando de build: `hugo --minify`
3. Esperar 30 segundos

Así de simple.