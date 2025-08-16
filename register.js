// register.js
document.addEventListener('DOMContentLoaded', () => {
  let currentLang = 'es';

  // Aplicar traducciones
  function applyTranslations() {
    document.querySelectorAll('[data-es]').forEach(el => {
      const esText = el.getAttribute('data-es');
      const enText = el.getAttribute('data-en');
      if (!esText || !enText) return;

      if (currentLang === 'es') {
        if (el.placeholder !== undefined && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          el.placeholder = esText;
        } else {
          el.textContent = esText;
        }
      } else {
        if (el.placeholder !== undefined && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          el.placeholder = enText;
        } else {
          el.textContent = enText;
        }
      }
    });
  }

  // Botones de idioma
  document.getElementById('langES').addEventListener('click', () => {
    currentLang = 'es';
    applyTranslations();
  });

  document.getElementById('langEN').addEventListener('click', () => {
    currentLang = 'en';
    applyTranslations();
  });

  // Detectar ubicación
  document.getElementById('detectLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert(currentLang === 'es'
        ? 'La geolocalización no es compatible con este navegador.'
        : 'Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        document.getElementById('latitude').value = latitude.toFixed(6);
        document.getElementById('longitude').value = longitude.toFixed(6);
      },
      err => {
        alert(
          currentLang === 'es'
            ? `Error al obtener ubicación: ${err.message}`
            : `Error getting location: ${err.message}`
        );
      }
    );
  });

  // Manejar envío de formulario
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    // Dejar que Formspree procese el envío normal
    // Validaciones extra opcionales
    const phone = document.getElementById('phone').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    if (!phone.startsWith('+52') || !whatsapp.startsWith('+52')) {
      e.preventDefault();
      alert(currentLang === 'es'
        ? 'El número de teléfono y WhatsApp deben estar en formato internacional (+52...).'
        : 'Phone and WhatsApp numbers must be in international format (+52...).'
      );
      return;
    }
  });

  // Inicializar traducciones al cargar
  applyTranslations();
});
