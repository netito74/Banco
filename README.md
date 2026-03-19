# Comprobante de Transferencia — PayPal

Generador de comprobantes de transferencia bancaria con estilo PayPal.  
Desarrollado con HTML, CSS y JavaScript vanilla. Sin dependencias de Node ni instalación requerida.

## Estructura del proyecto

```
comprobante-paypal/
├── index.html        ← Página principal (formulario + comprobante)
├── css/
│   └── styles.css    ← Todos los estilos (variables, formulario, comprobante, print)
├── js/
│   └── app.js        ← Toda la lógica (validación, generación, PDF, impresión)
└── README.md
```

## Cómo usar

### Opción 1 — Abrir directo en el navegador
Simplemente abre `index.html` en tu navegador. No requiere servidor.

### Opción 2 — Servidor local (recomendado para desarrollo)
```bash
# Con Python
python -m http.server 3000

# Con Node / npx
npx serve .

# Con VS Code
Instala la extensión "Live Server" y da clic en "Go Live"
```

Luego abre: [http://localhost:3000](http://localhost:3000)

## Funcionalidades

- ✅ Formulario con validación en tiempo real
- ✅ Enmascarado de cuentas (solo últimos 4 dígitos visibles)
- ✅ Enmascarado de correo electrónico
- ✅ Fecha y hora real en zona horaria México (CST)
- ✅ Claves SPEI, autorización y folio generadas automáticamente
- ✅ Aviso de fondos retenidos / impuesto de retención
- ✅ Descarga de PDF con alta resolución (jsPDF + html2canvas)
- ✅ Impresión optimizada con estilos `@media print`

## Dependencias CDN (incluidas en index.html)

| Librería | Uso |
|---|---|
| [jsPDF 2.5.1](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js) | Generación del archivo PDF |
| [html2canvas 1.4.1](https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js) | Captura del comprobante como imagen |

No se instala nada. Todo carga desde CDN automáticamente.

## Deploy en GitHub Pages

1. Sube el proyecto a un repositorio en GitHub
2. Ve a **Settings → Pages**
3. En *Source* selecciona la rama `main` y la carpeta `/ (root)`
4. GitHub Pages publicará el sitio automáticamente

---

> Proyecto de demostración. No afiliado con PayPal Inc.
