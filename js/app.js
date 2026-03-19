/* ═══════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════ */
const $ = id => document.getElementById(id);
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function setTxt(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

/**
 * Formatea el número de cuenta insertando espacios cada 4 dígitos
 * Se llama desde oninput en el input del formulario
 */
function fmtAcc(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 18);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Permite solo números y un punto decimal en el campo de monto
 */
function fmtMonto(el) {
  let v = el.value.replace(/[^\d.]/g, '');
  const parts = v.split('.');
  if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
  el.value = v;
}

/**
 * Al salir del campo de monto, formatea con 2 decimales
 */
function blurMonto(el) {
  const n = parseFloat(el.value.replace(/,/g, ''));
  if (!isNaN(n) && n > 0)
    el.value = n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Enmascara la cuenta: muestra solo los últimos 4 dígitos
 * Ej: "1234 5678 9012 3456" → "•••• •••• •••• 3456"
 */
function maskAccount(accStr) {
  const digits = accStr.replace(/\D/g, '');
  if (digits.length < 4) return accStr;
  const last4 = digits.slice(-4);
  const groups = Math.ceil((digits.length - 4) / 4);
  let masked = '';
  for (let i = 0; i < groups; i++) masked += '•••• ';
  return masked + last4;
}

/**
 * Enmascara el correo: muestra primeras 2 letras + *** + @dominio
 * Ej: "carlos@gmail.com" → "ca***@gmail.com"
 */
function maskEmail(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const visible = name.length > 2 ? name.slice(0, 2) : name;
  return visible + '***@' + parts[1];
}

/**
 * Devuelve la fecha y hora actual en zona horaria de México (CST)
 * con formato largo: "lunes, 19 de marzo de 2026, 10:35:22 a.m."
 */
function nowMX() {
  return new Date().toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
}

/**
 * Devuelve fecha corta con hora: "19/03/2026, 10:35"
 */
function shortDate() {
  return new Date().toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ═══════════════════════════════════════
   GENERADORES DE CLAVES ÚNICAS
═══════════════════════════════════════ */

/** Genera una clave de rastreo SPEI realista */
function genTrace() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const base = 'SPEI' + Date.now().toString(36).toUpperCase();
  const rand = Array.from({ length: 8 }, () => chars[ri(0, chars.length - 1)]).join('');
  return base + rand;
}

/** Genera un número de autorización bancaria */
function genAuth() {
  return String(ri(1000000, 9999999)).padStart(7, '0') + ri(10, 99);
}

/** Genera un folio de operación */
function genFolio() {
  return 'TX' + Date.now().toString().slice(-10) + ri(10, 99);
}

/** Genera la referencia única del comprobante */
function genRef() {
  return 'PP-MX-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-8);
}

/* ═══════════════════════════════════════
   VALIDACIÓN
═══════════════════════════════════════ */

/**
 * Muestra u oculta el mensaje de error de un campo input/select
 */
function showErr(inputId, errId, show) {
  const el = $(inputId);
  const em = $(errId);
  if (!el || !em) return;
  el.classList[show ? 'add' : 'remove']('err');
  em.classList[show ? 'add' : 'remove']('show');
}

/**
 * Muestra u oculta el mensaje de error del wrapper del monto
 */
function setWrapErr(wrapId, errId, show) {
  $(wrapId).classList[show ? 'add' : 'remove']('err');
  $(errId).classList[show ? 'add' : 'remove']('show');
}

/** Valida formato de correo electrónico */
function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/* ═══════════════════════════════════════
   GENERAR COMPROBANTE
═══════════════════════════════════════ */
function generate() {
  // Leer valores del formulario
  const sName   = $('fSName').value.trim();
  const sEmail  = $('fSEmail').value.trim();
  const sAcc    = $('fSAcc').value.trim();
  const sBank   = $('fSBank').value;
  const rName   = $('fRName').value.trim();
  const rAcc    = $('fRAcc').value.trim();
  const rBank   = $('fRBank').value;
  const rType   = $('fRType').value;
  const amtRaw  = $('fAmt').value.replace(/,/g, '');
  const concept = $('fConcept').value.trim();

  // Validar todos los campos
  let valid = true;

  if (!sName)                             { showErr('fSName',  'eSName',  true); valid = false; } else showErr('fSName',  'eSName',  false);
  if (!validateEmail(sEmail))             { showErr('fSEmail', 'eSEmail', true); valid = false; } else showErr('fSEmail', 'eSEmail', false);
  if (sAcc.replace(/\s/g, '').length < 8){ showErr('fSAcc',   'eSAcc',   true); valid = false; } else showErr('fSAcc',   'eSAcc',   false);
  if (!sBank)                             { showErr('fSBank',  'eSBank',  true); valid = false; } else showErr('fSBank',  'eSBank',  false);
  if (!rName)                             { showErr('fRName',  'eRName',  true); valid = false; } else showErr('fRName',  'eRName',  false);
  if (rAcc.replace(/\s/g, '').length < 8){ showErr('fRAcc',   'eRAcc',   true); valid = false; } else showErr('fRAcc',   'eRAcc',   false);
  if (!rBank)                             { showErr('fRBank',  'eRBank',  true); valid = false; } else showErr('fRBank',  'eRBank',  false);

  const amtNum = parseFloat(amtRaw);
  if (isNaN(amtNum) || amtNum <= 0) {
    setWrapErr('montoWrap', 'eAmt', true); valid = false;
  } else {
    setWrapErr('montoWrap', 'eAmt', false);
  }

  if (!concept) { showErr('fConcept', 'eConcept', true); valid = false; } else showErr('fConcept', 'eConcept', false);

  if (!valid) {
    // Hacer scroll al primer error visible
    document.querySelector('.err-msg.show')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const amtFmt = amtNum.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Rellenar el comprobante con los datos ingresados y generados
  setTxt('rRef',      genRef());
  setTxt('rDate',     'Procesada el ' + nowMX() + ' (CST)');
  setTxt('rAmt',      amtFmt);
  setTxt('rSName',    sName);
  setTxt('rSEmail',   maskEmail(sEmail));
  setTxt('rSAcc',     maskAccount(sAcc));
  setTxt('rSBank',    sBank);
  setTxt('rRName',    rName);
  setTxt('rRAcc',     maskAccount(rAcc));
  setTxt('rRBank',    rBank);
  setTxt('rRType',    rType);
  setTxt('rConcept',  concept);
  setTxt('rTrace',    genTrace());
  setTxt('rAuth',     genAuth());
  setTxt('rFolio',    genFolio());
  setTxt('rFootDate', 'Generado: ' + shortDate() + ' CST');

  // Transición: ocultar formulario, mostrar comprobante
  $('stepForm').style.display = 'none';
  const s = $('stepReceipt');
  s.classList.add('show');
  s.style.opacity = 0;
  s.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    s.style.transition = 'opacity .45s ease, transform .45s ease';
    s.style.opacity = 1;
    s.style.transform = 'translateY(0)';
  });
}

/* ═══════════════════════════════════════
   DESCARGAR PDF
═══════════════════════════════════════ */
async function downloadPDF() {
  const overlay = $('loadingOverlay');
  const loadTxt = $('loadingText');
  overlay.classList.add('show');
  loadTxt.textContent = 'Capturando comprobante...';

  try {
    const el  = $('receiptDoc');
    const ref = $('rRef').textContent || 'comprobante';

    loadTxt.textContent = 'Generando PDF...';

    // Renderizar el HTML como imagen con alta resolución
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: false,
      imageTimeout: 5000,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const pageW  = pdf.internal.pageSize.getWidth();
    const pageH  = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxW   = pageW - margin * 2;
    const ratio  = canvas.height / canvas.width;
    const imgH   = maxW * ratio;

    // Si el comprobante supera la altura de la página, lo escala para que quepa
    const finalH = imgH > (pageH - margin * 2) ? (pageH - margin * 2) : imgH;
    const finalW = finalH / ratio;
    const offsetX = (pageW - finalW) / 2;

    pdf.addImage(imgData, 'JPEG', offsetX, margin, finalW, finalH);
    pdf.save('Comprobante-PayPal-' + ref + '.pdf');

  } catch (err) {
    alert('No se pudo generar el PDF. Usa el botón Imprimir como alternativa.');
    console.error(err);
  } finally {
    overlay.classList.remove('show');
  }
}

/* ═══════════════════════════════════════
   IMPRIMIR
═══════════════════════════════════════ */
function printReceipt() {
  window.print();
}

/* ═══════════════════════════════════════
   RESETEAR — volver al formulario
═══════════════════════════════════════ */
function goBack() {
  const s = $('stepReceipt');
  s.classList.remove('show');
  $('stepForm').style.display = 'block';

  // Limpiar todos los campos del formulario
  ['fSName', 'fSEmail', 'fSAcc', 'fRName', 'fRAcc', 'fAmt', 'fConcept']
    .forEach(id => $(id).value = '');
  ['fSBank', 'fRBank'].forEach(id => $(id).value = '');
  $('fRType').selectedIndex = 0;
  $('montoWrap').classList.remove('err');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
