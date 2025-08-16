/*
 * Script para la página de registro de negocios en el directorio de Puerto Peñasco.
 * Maneja la traducción bilingüe de la interfaz, la detección de ubicación mediante geolocalización
 * y la captura de datos del formulario. En esta versión no se envía información a un servidor;
 * simplemente se almacena en localStorage y muestra un mensaje de confirmación al usuario.
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentLang = 'es';

  // Función para aplicar traducciones en todos los elementos con data-es/data-en
  function applyTranslations() {
    document.querySelectorAll('[data-es]').forEach(el => {
      const esText = el.getAttribute('data-es');
      const enText = el.getAttribute('data-en');
      if (currentLang === 'es') {
        if (el.placeholder !== undefined && el.tagName === 'INPUT') {
          el.placeholder = esText;
        } else if (el.tagName === 'OPTION') {
          // para opciones de select
          el.textContent = esText;
        } else {
          el.textContent = esText;
        }
      } else {
        if (el.placeholder !== undefined && el.tagName === 'INPUT') {
          el.placeholder = enText;
        } else if (el.tagName === 'OPTION') {
          el.textContent = enText;
        } else {
          el.textContent = enText;
        }
      }
    });
  }

  // Manejar cambios de idioma
  document.getElementById('langES').addEventListener('click', () => {
    currentLang = 'es';
    applyTranslations();
  });
  document.getElementById('langEN').addEventListener('click', () => {
    currentLang = 'en';
    applyTranslations();
  });

  // Detectar ubicación y rellenar campos
  document.getElementById('detectLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert(currentLang === 'es' ? 'La geolocalización no es compatible.' : 'Geolocation is not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        document.getElementById('latitude').value = latitude.toFixed(6);
        document.getElementById('longitude'). value = longitude.toFixed(6);
      },
      err => {
        alert(currentLang === 'es' ? 'No se pudo obtener tu ubicación.' : 'Could not retrieve your location.');
      }
    );
  });

  // Manejar envío de formulario
  document.getElementById('registerForm').addEventListener('submit', (e) => {
   // e.preventDefault();
    // Recopilar datos del formulario
    const data = {
      name_es: document.getElementById('businessNameES').value.trim(),
      name_en: document.getElementById('businessNameEN').value.trim(),
      category: document.getElementById('category').value,
      address_es: document.getElementById('addressES').value.trim(),
      address_en: document.getElementById('addressEN').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim(),
      description_es: document.getElementById('descriptionES').value.trim(),
      description_en: document.getElementById('descriptionEN').value.trim(),
      price: document.getElementById('price').value,
      lat: document.getElementById('latitude').value.trim(),
      lon: document.getElementById('longitude').value.trim(),
      email: document.getElementById('email').value.trim(),
      terms: document.getElementById('terms').checked
    };
    // Guardar datos en localStorage (simulación) con una clave única
   // const entries = JSON.parse(localStorage.getItem('ppRegistrations') || '[]');
    //entries.push(data);
    //localStorage.setItem('ppRegistrations', JSON.stringify(entries));
    // Mostrar mensaje al usuario
    //alert(
     // currentLang === 'es'
       // ? 'Gracias por registrarte. Nos pondremos en contacto contigo pronto para completar tu inscripción.'
       // : 'Thank you for registering. We will contact you soon to complete your listing.'
    );
    // Reiniciar formulario
   // e.target.reset();
    //document.getElementById('latitude').value = '';
    e.target.submit();     //document.getElementById('longitude').value = '';
  });

  // Inicializar traducciones
  applyTranslations();
});
