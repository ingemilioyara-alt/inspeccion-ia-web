# INSPECTIA-Web — Sistema de Inspección de Tapas con IA (Académico)

*Objetivo:* Sistema web que simula inspecciones de calidad de envases (detección “Con_Tapa / Sin_Tapa”) siguiendo los mockups y guardando datos en localStorage.

## Acceso (usuarios de prueba)
- *Admin* → 1234
- *Operador* → 5678

> Credenciales académicas para evaluación.

## Sitio publicado
- *URL:* (pegar aquí la URL de GitHub Pages cuando la actives)

## Estructura del proyecto

/inspectia-web
│── index.html → Todas las vistas (Login, Dashboard, Registro, Detalle, Reportes)
│── style.css → Estilos (estructura, colores, botones según mockups)
│── script.js → Lógica de login, navegación SPA, IA simulada, reportes y exportación
│── README.md → Guía de instalación, uso y publicación
└── /assets
└── logo.png → Logo (Masglo académico)

## Cómo correr localmente
1. Clona o descarga este repositorio.
2. Abre index.html con tu navegador (doble clic)  
   *o* en VS Code usa la extensión *Live Server* (clic derecho → Open with Live Server).

## Publicación en GitHub Pages (sin terminal)
1. Sube index.html, style.css, script.js y la carpeta assets a un repositorio *público* en GitHub.  
2. En el repo: *Settings → Pages → Build and deployment*  
   - *Source:* Deploy from a branch  
   - *Branch:* main y carpeta */* (root)  
   - *Save*  
3. Espera 1–3 min. Se mostrará la *URL pública*. Pégala arriba en “Sitio publicado”.

## Flujo de uso
1. *Login:* Admin/1234 o Operador/5678 → Panel de Control.  
2. *Nueva Inspección:* Elegir línea → Subir imagen → *Detectar* (simulado) → *Registrar*.  
3. *Detalle:* Ver datos + foto → *Finalizar* vuelve al Panel.  
4. *Reportes:* Filtrar por turno/línea/fecha → *Generar Reporte* → *Exportar Excel* (CSV con BOM y “;”).

## Tips / Solución de problemas
- Si el CSV abre mal en Excel, usar *Datos → Desde texto/CSV, elegir **UTF-8* y delimitador *;*.  
- Si no ves datos en Reportes, asegúrate de:  
  - Haber hecho *Registrar Inspección* al menos una vez  
  - En *Reportes, dejar filtros vacíos y pulsar **Generar Reporte*  
  - (Opcional) Limpiar datos: abre consola (F12) y ejecuta localStorage.removeItem('inspecciones').

## Tecnologías
- HTML, CSS, JavaScript (SPA simple)
- Almacenamiento: localStorage
- Despliegue: GitHub Pages

## Nota legal
Marca ficticia usada únicamente con fines académicos. No representa a la empresa real.