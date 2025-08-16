// main/script.js
(function () {
  // Configura aquí tus teléfonos
  const PHONE_INTL = '+526441234567';   // <--- cámbialo
  const WHATS_INTL = '5216441234567';   // <--- cámbialo (sin +)

  // Idioma actual
  let currentLang = document.documentElement.lang || 'es';

  function applyTranslations() {
    document.querySelectorAll('[data-es]').forEach(el => {
      const es = el.getAttribute('data-es');
      const en = el.getAttribute('data-en');
      if (!es && !en) return;

      // placeholder en inputs/textarea
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
        if (currentLang === 'es' && es) el.placeholder = es;
        if (currentLang === 'en' && en) el.placeholder = en;
      }

      // texto visible
      if (es || en) {
        el.textContent = currentLang === 'es' ? (es ?? el.textContent) : (en ?? el.textContent);
      }
    });

    document.documentElement.lang = currentLang;
  }

  function setLang(lang) {
    currentLang = (lang === 'en' ? 'en' : 'es');
    applyTranslations();
  }

  // Botones globales
  document.addEventListener('DOMContentLoaded', () => {
    const btnES = document.getElementById('langES');
    const btnEN = document.getElementById('langEN');
    if (btnES) btnES.addEventListener('click', () => setLang('es'));
    if (btnEN) btnEN.addEventListener('click', () => setLang('en'));

    // Enlaces demo en index (tarjeta + flotantes)
    const demoWhats = document.getElementById('demoWhats');
    const demoCall  = document.getElementById('demoCall');
    const floaterW  = document.getElementById('floaterWhats');
    const floaterC  = document.getElementById('floaterCall');

    const waLink = `https://wa.me/${WHATS_INTL}?text=${encodeURIComponent('Hola, quiero registrar mi negocio')}`;
    if (demoWhats) demoWhats.href = waLink;
    if (floaterW)  floaterW.href  = waLink;

    const telLink = `tel:${PHONE_INTL}`;
    if (demoCall) demoCall.href = telLink;
    if (floaterC) floaterC.href = telLink;

    applyTranslations();
  });
})();
