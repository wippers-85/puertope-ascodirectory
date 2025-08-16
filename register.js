alert('JS CARGÓ');

(function () {
  let currentLang = 'es';

  function applyTranslations() {
    document.querySelectorAll('[data-es]').forEach(el => {
      const es = el.getAttribute('data-es');
      const en = el.getAttribute('data-en');
      const txt = currentLang === 'es' ? es : en;

      // Si el elemento tiene placeholder, se traduce el placeholder
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = txt;
      } else if (el.tagName === 'OPTION') {
        el.textContent = txt;
      } else {
        el.textContent = txt;
      }
    });
  }

  // Botones de idioma
  const btnES = document.getElementById('langES');
  const btnEN = document.getElementById('langEN');
  if (btnES) btnES.addEventListener('click', () => { currentLang = 'es'; applyTranslations(); });
  if (btnEN) btnEN.addEventListener('click', () => { currentLang = 'en'; applyTranslations(); });

  // Inicializa traducciones al cargar
  document.addEventListener('DOMContentLoaded', applyTranslations);

  // Exponer función global porque tu HTML usa onclick="detectLocation()"
  window.detectLocation = function () {
    if (!navigator.geolocation) {
      alert(currentLang === 'es'
        ? 'La geolocalización no es compatible en este navegador.'
        : 'Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');

        if (latInput) { latInput.readOnly = false; latInput.value = latitude.toFixed(6); }
        if (lonInput) { lonInput.readOnly = false; lonInput.value = longitude.toFixed(6); }
      },
      (err) => {
        alert('Error ' + err.code + ': ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };
})();
