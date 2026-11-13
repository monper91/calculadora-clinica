/* Editor de analíticas · lector PDF.js 6.5.438 (Mozilla, licencia Apache 2.0).
 * Dependencias integradas exclusivamente en ./vendor/pdfjs/. Ningún envío de
 * documentos, texto ni resultados. Sin OCR. No almacenar en almacenamiento persistente.
 */
'use strict';
(function (global) {
  const MAX_SIZE = 20 * 1024 * 1024;
  const MAX_PAGES = 80;
  const MAX_TEXT = 350000;
  // PDF.js está empaquetado como scripts clásicos para funcionar también en file://.
  // El manejador de mensajes está cargado localmente (sin Worker de módulo).

  // PDF.js 6.5 uses modern built-ins absent in some older environments.
  // Compatibility shims are local and never require a network request.
  if (typeof Promise.try !== 'function') {
    Promise.try = (fn, ...args) => Promise.resolve().then(() => fn(...args));
  }
  if (typeof Map.prototype.getOrInsertComputed !== 'function') {
    Map.prototype.getOrInsertComputed = function(key, callback) {
      if (this.has(key)) return this.get(key);
      const value = callback(key);
      this.set(key, value);
      return value;
    };
  }
  if (typeof Math.sumPrecise !== 'function') {
    Math.sumPrecise = values => { let sum = 0; for (const n of values) sum += n; return sum; };
  }
  if (typeof Uint8Array.prototype.toHex !== 'function') {
    Uint8Array.prototype.toHex = function() {
      let out = '';
      for (let i = 0; i < this.length; i++) out += this[i].toString(16).padStart(2, '0');
      return out;
    };
  }

  function getPdfJs() {
    if (!global.pdfjsLib?.getDocument || !global.pdfjsWorker?.WorkerMessageHandler) {
      throw Error('No se ha cargado el motor PDF local. Comprueba los archivos pdf.compat.js y pdf.worker.compat.js en la raíz del portal.');
    }
    // PDF.js utiliza un worker simulado en este mismo contexto. Evita
    // importación de módulos y evita depender de permisos file://.
    return Promise.resolve(global.pdfjsLib);
  }

  // PDF text items expose their PDF-page coordinates. Reconstruct by baseline,
  // not by raw stream order; value, unit and reference intervals stay in the same row.
  function isAdministrativeLine(line) {
    return /^(?:SERVICIO EXTREMEÑO DE SALUD|(?:SE\s+)?Sexo\s*:|CIP\s*:|Tlf\s*:|Poblaci[oó]n\s*:|F\.Ingr\.?\s*:|Fecha Solicitud\s*:|N[º°o]\.? de petici[oó]n\s*:|Solicitante\s*:|Diagnostico\s*:|Observaciones\s*:|Categ\. prof\s*:|Centro solicitante\s*:|F\. Firma\s*:|Validado por\s*:|HEMATOLOG[IÍ]A$|HEMATIMETR[IÍ]A$|Determinaci[oó]n\s+Resultado|v\d+[.,]\d+\s*$)/i.test(line);
  }
  function normalizePdfRow(line) {
    const v = line.trim();
    if (isAdministrativeLine(v)) return '';
    // Some SES PDFs draw the heading twice with overlapping text objects.
    if (v.length >= 12 && v.length % 2 === 0 && v.slice(0, v.length/2) === v.slice(v.length/2))
      return isAdministrativeLine(v.slice(0, v.length/2)) ? '' : v.slice(0, v.length/2);
    return v;
  }

  function reconstructRows(items) {
    const parts = [];
    for (const t of items) {
      if (typeof t.str !== 'string' || !t.str.trim()) continue;
      const x = Number(t.transform?.[4]);
      const y = Number(t.transform?.[5]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      parts.push({x, y, width: Number(t.width) || 0,
        text: t.str.replace(/[\u00a0\u2007\u202f]/g, ' ').trim()});
    }
    // Rather than rounding to a fixed line grid, place fragments with close
    // baselines together. This also handles partly-overlapping line positions.
    parts.sort((a, b) => b.y - a.y || a.x - b.x);
    const lines = [];
    for (const p of parts) {
      let r = lines[lines.length - 1];
      if (!r || Math.abs(p.y - r.y) > 3.6) {
        r = {y: p.y, pieces: []};
        lines.push(r);
      }
      r.pieces.push(p);
    }
    const output = [];
    let validatorBlock = false;
    for (const row of lines) {
      row.pieces.sort((a, b) => a.x - b.x);
      let text = '';
      let endX = -Infinity;
      for (const p of row.pieces) {
        const gap = p.x - endX;
        // Separate physical table columns with a TAB; keep adjacent word
        // fragments as words. A huge gap is never swallowed silently.
        const separator = !text ? '' : gap > 16 ? '\t' : (gap > 1 ? ' ' : '');
        text += separator + p.text;
        endX = Math.max(endX, p.x + p.width);
      }
      if (/^Validado por\s*:/i.test(text)) {validatorBlock = true; continue;}
      if (validatorBlock) {
        if (/^F\. Firma\s*:/i.test(text)) validatorBlock = false;
        continue;
      }
      const safeLine = normalizePdfRow(text);
      if (safeLine) output.push(safeLine);
    }
    return output;
  }

  async function extractPdf(file) {
    if (file.size > MAX_SIZE) throw Error('PDF demasiado grande (máximo 20 MB).');
    const arr = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder('latin1').decode(arr.slice(0, 5)) !== '%PDF-')
      throw Error('El archivo no tiene una cabecera PDF válida.');

    const pdfjs = await getPdfJs();
    let loadingTask;
    let doc;
    const pages = [];
    let recognizedChars = 0;
    try {
      loadingTask = pdfjs.getDocument({
        data: arr,
        isEvalSupported: false, // do not evaluate PDF-embedded JavaScript
        enableXfa: false,
        useSystemFonts: true,
        disableFontFace: true,
        stopAtErrors: true,
        // All resources are distributed locally. These addresses contain no
        // patient data and are never supplied by the imported document.
        cMapUrl: 'vendor/pdfjs/web/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'vendor/pdfjs/web/standard_fonts/',
        wasmUrl: 'vendor/pdfjs/web/wasm/'
      });
      doc = await loadingTask.promise;
      if (doc.numPages < 1 || doc.numPages > MAX_PAGES)
        throw Error('Número de páginas no admitido (máximo 80).');
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent({includeMarkedContent: false});
        const rows = reconstructRows(content.items);
        const pageText = rows.join('\n');
        recognizedChars += pageText.length;
        if (recognizedChars > MAX_TEXT)
          throw Error('El texto extraído supera el tamaño máximo permitido.');
        // A scanned page is not silently omitted from a multipage document.
        if (pageText.trim().length < 12)
          throw Error('La página ' + i + ' no contiene texto seleccionable suficiente. Este editor todavía no incorpora OCR.');
        pages.push(pageText);
        page.cleanup();
      }
      const text = pages.join('\n').trim();
      if (text.length < 40 || !/[a-záéíóúñ]{3,}/i.test(text))
        throw Error('No se ha podido reconstruir texto suficiente para analizar el PDF.');
      return {text, type: 'pdf', pages: doc.numPages, engine: 'PDF.js 6.5.438'};
    } catch (e) {
      if (/PasswordException|password/i.test(e.name || ''))
        throw Error('PDF protegido con contraseña: no puede procesarse sin desbloquearlo.');
      throw e;
    } finally {
      // Releases the PDF.js document/worker and its references to PDF bytes.
      if (loadingTask) await loadingTask.destroy().catch(() => {});
    }
  }

  async function read(file) {
    if (!file) throw Error('No se ha seleccionado ningún archivo.');
    if (file.size > MAX_SIZE) throw Error('Archivo demasiado grande (máximo 20 MB).');
    if (/\.(txt|text)$/i.test(file.name) || file.type === 'text/plain')
      return {text: await file.text(), type: 'txt'};
    if (/\.pdf$/i.test(file.name) || file.type === 'application/pdf')
      return extractPdf(file);
    throw Error('Solo admite archivos PDF con texto seleccionable o TXT.');
  }
  global.LabFileReader = {read, reconstructRows};
})(window);
