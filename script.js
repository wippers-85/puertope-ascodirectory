/*
 * Puerto Peñasco Directory
 * Este script maneja la lógica de la página: traducción, filtrado, búsqueda,
 * detección de ubicación y generación dinámica de tarjetas de negocios,
 * promociones y eventos. No hay backend; todos los datos se almacenan en
 * variables de ejemplo. Para producción, estos datos deberían provenir de
 * un servidor o base de datos.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Idioma actual (español por defecto)
  let currentLang = 'es';
  let currentCategory = 'all';
  let currentSearch = '';

  // Datos de negocios de ejemplo
  const businesses = [
    {
      id: 1,
      category: 'cafeteria',
      name_es: 'Café del Mar',
      name_en: 'Café del Mar',
      address_es: 'Av. Campeche 123, Puerto Peñasco',
      address_en: 'Av. Campeche 123, Puerto Peñasco',
      description_es: 'Cafetería con vista al mar y deliciosos postres.',
      description_en: 'Coffee shop with sea view and delicious desserts.',
      phone: '+526631234567',
      whatsapp: '+526631234567',
      lat: 31.31666,
      lon: -113.53499,
      price: '$$',
      rating: 4.5,
      images: ['https://picsum.photos/seed/cafe/400/300'],
      featured: true
    },
    {
      id: 2,
      category: 'restaurant',
      name_es: 'La Parrilla Sonorense',
      name_en: 'Sonoran Grill',
      address_es: 'Calle 12 y Morelos, Puerto Peñasco',
      address_en: 'Calle 12 and Morelos, Puerto Peñasco',
      description_es: 'Restaurante de comida regional con carnes a la parrilla.',
      description_en: 'Regional restaurant serving grilled meats.',
      phone: '+526636789012',
      whatsapp: '+526636789012',
      lat: 31.32610,
      lon: -113.54020,
      price: '$$$',
      rating: 4.7,
      images: ['https://picsum.photos/seed/restaurant/400/300'],
      featured: false
    },
    {
      id: 3,
      category: 'hotel',
      name_es: 'Hotel Playa Azul',
      name_en: 'Blue Beach Hotel',
      address_es: 'Blvd. Benito Juárez 200, Puerto Peñasco',
      address_en: 'Blvd. Benito Juárez 200, Puerto Peñasco',
      description_es: 'Hotel frente al mar con piscina y spa.',
      description_en: 'Beachfront hotel with pool and spa.',
      phone: '+526638765432',
      whatsapp: '+526638765432',
      lat: 31.30890,
      lon: -113.53780,
      price: '$$$',
      rating: 4.3,
      images: ['https://picsum.photos/seed/hotel/400/300'],
      featured: true
    },
    {
      id: 4,
      category: 'tour',
      name_es: 'Tour de avistamiento de ballenas',
      name_en: 'Whale Watching Tour',
      address_es: 'Muelle principal, Puerto Peñasco',
      address_en: 'Main pier, Puerto Peñasco',
      description_es: 'Excursión en barco para observar ballenas y delfines.',
      description_en: 'Boat trip to observe whales and dolphins.',
      phone: '+526632224455',
      whatsapp: '+526632224455',
      lat: 31.30350,
      lon: -113.53070,
      price: '$$',
      rating: 4.8,
      images: ['https://picsum.photos/seed/tour/400/300'],
      featured: false
    }
  ];

  // Promociones de ejemplo
  const promotions = [
    {
      id: 'promo1',
      title_es: 'Descuento en tours de verano',
      title_en: 'Summer tour discount',
      description_es: 'Obtén 20% de descuento en tours de avistamiento de ballenas este verano.',
      description_en: 'Get 20% off on whale watching tours this summer.',
      image: 'https://picsum.photos/seed/promo1/400/250',
      link: '#'
    },
    {
      id: 'promo2',
      title_es: '2x1 en cafés de la tarde',
      title_en: '2-for-1 afternoon coffee',
      description_es: 'Visita Café del Mar de 3 pm a 5 pm y disfruta de 2x1.',
      description_en: 'Visit Café del Mar from 3–5 p.m. and enjoy 2-for-1.',
      image: 'https://picsum.photos/seed/promo2/400/250',
      link: '#'
    }
  ];

  // Eventos locales de ejemplo
  const events = [
    {
      id: 'event1',
      title_es: 'Festival del camarón',
      title_en: 'Shrimp Festival',
      date: '2025-09-15',
      description_es: 'Celebración anual con degustaciones y música en vivo.',
      description_en: 'Annual celebration with tastings and live music.',
      image: 'https://picsum.photos/seed/event1/400/250'
    },
    {
      id: 'event2',
      title_es: 'Concierto en la playa',
      title_en: 'Beach concert',
      date: '2025-10-05',
      description_es: 'Bandas locales e invitadas en un escenario frente al mar.',
      description_en: 'Local and guest bands on a beachfront stage.',
      image: 'https://picsum.photos/seed/event2/400/250'
    }
  ];

  // Helper para traducir textos de atributos data-es/data-en
  function applyTranslations() {
    document.querySelectorAll('[data-es]').forEach(el => {
      const esText = el.getAttribute('data-es');
      const enText = el.getAttribute('data-en');
      if (currentLang === 'es') {
        // Element is input?
        if (el.placeholder !== undefined && el.tagName === 'INPUT') {
          el.placeholder = esText;
        } else {
          el.textContent = esText;
        }
      } else {
        if (el.placeholder !== undefined && el.tagName === 'INPUT') {
          el.placeholder = enText;
        } else {
          el.textContent = enText;
        }
      }
    });
  }

  // Generar estrellas de calificación
  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    let html = '';
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fa-solid fa-star"></i>';
    }
    if (halfStar) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let j = 0; j < emptyStars; j++) {
      html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

  // Calcular distancia en km entre dos coordenadas (Haversine)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // radio terrestre km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Renderizar negocios
  function renderBusinesses() {
    const container = document.getElementById('businessList');
    container.innerHTML = '';
    let filtered = businesses.filter(biz => {
      // Filtrar por categoría
      if (currentCategory !== 'all' && biz.category !== currentCategory) return false;
      // Filtrar por búsqueda
      const query = currentSearch.toLowerCase();
      const name = (currentLang === 'es' ? biz.name_es : biz.name_en).toLowerCase();
      const desc = (currentLang === 'es' ? biz.description_es : biz.description_en).toLowerCase();
      if (query && !name.includes(query) && !desc.includes(query)) return false;
      return true;
    });
    filtered.forEach(biz => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 mb-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${biz.images[0]}" class="card-img-top" alt="${biz.name_es}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${currentLang === 'es' ? biz.name_es : biz.name_en}</h5>
            <div class="rating mb-2">${renderStars(biz.rating)}</div>
            <p class="card-text flex-grow-1">${currentLang === 'es' ? biz.description_es : biz.description_en}</p>
            <p class="fw-bold mb-1"><i class="fa-solid fa-location-dot"></i> ${currentLang === 'es' ? biz.address_es : biz.address_en}</p>
            <div class="mb-2">
              <span class="badge bg-secondary me-1">${biz.price}</span>
              <span class="badge bg-info text-dark">${currentLang === 'es' ? getCategoryLabel(biz.category, 'es') : getCategoryLabel(biz.category, 'en')}</span>
            </div>
            <div class="mt-auto">
              <a href="https://wa.me/${biz.whatsapp.replace(/[^0-9\+]/g,'')}?text=${encodeURIComponent(getWhatsappMessage(biz))}" class="btn btn-success btn-sm me-1" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
              <a href="tel:${biz.phone}" class="btn btn-primary btn-sm me-1"><i class="fa-solid fa-phone"></i> ${currentLang === 'es' ? 'Llamar' : 'Call'}</a>
              <a href="https://www.google.com/maps?q=${biz.lat},${biz.lon}" class="btn btn-outline-secondary btn-sm" target="_blank"><i class="fa-solid fa-map-location-dot"></i> Map</a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  // Obtener etiqueta de categoría según idioma
  function getCategoryLabel(cat, lang) {
    const labels = {
      cafeteria: { es: 'Cafetería', en: 'Café' },
      restaurant: { es: 'Restaurante', en: 'Restaurant' },
      hotel: { es: 'Hotel', en: 'Hotel' },
      tour: { es: 'Tour', en: 'Tour' }
    };
    return labels[cat] ? labels[cat][lang] : cat;
  }

  // Mensaje de WhatsApp según idioma
  function getWhatsappMessage(biz) {
    return currentLang === 'es'
      ? `Hola, me gustaría obtener más información sobre ${biz.name_es}.`
      : `Hello, I would like more information about ${biz.name_en}.`;
  }

  // Renderizar secciones premium y promociones
  function renderPremium() {
    const list = document.getElementById('premiumList');
    list.innerHTML = '';
    businesses.filter(b => b.featured).forEach(biz => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 mb-4';
      col.innerHTML = `
        <div class="card h-100 border-warning shadow-sm">
          <img src="${biz.images[0]}" class="card-img-top" alt="${biz.name_es}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${currentLang === 'es' ? biz.name_es : biz.name_en}</h5>
            <div class="rating mb-2">${renderStars(biz.rating)}</div>
            <p class="card-text flex-grow-1">${currentLang === 'es' ? biz.description_es : biz.description_en}</p>
            <a href="https://www.google.com/maps?q=${biz.lat},${biz.lon}" class="btn btn-outline-secondary btn-sm mt-auto" target="_blank"><i class="fa-solid fa-map-location-dot"></i> Map</a>
          </div>
        </div>
      `;
      list.appendChild(col);
    });
  }

  function renderPromotions() {
    const promoList = document.getElementById('promoList');
    promoList.innerHTML = '';
    promotions.forEach(promo => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 mb-4';
      col.innerHTML = `
        <div class="card h-100 promo-card shadow-sm">
          <img src="${promo.image}" class="card-img-top" alt="${promo.title_es}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${currentLang === 'es' ? promo.title_es : promo.title_en}</h5>
            <p class="card-text flex-grow-1">${currentLang === 'es' ? promo.description_es : promo.description_en}</p>
            <a href="${promo.link}" class="btn btn-warning mt-auto">${currentLang === 'es' ? 'Ver más' : 'Learn more'}</a>
          </div>
        </div>
      `;
      promoList.appendChild(col);
    });
  }

  function renderEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    events.forEach(ev => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4 mb-4';
      const date = new Date(ev.date);
      const dateStr = date.toLocaleDateString(currentLang === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${ev.image}" class="card-img-top" alt="${ev.title_es}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${currentLang === 'es' ? ev.title_es : ev.title_en}</h5>
            <p class="text-muted">${dateStr}</p>
            <p class="card-text flex-grow-1">${currentLang === 'es' ? ev.description_es : ev.description_en}</p>
            <button class="btn btn-outline-primary mt-auto" disabled>${currentLang === 'es' ? 'Más información' : 'More info'}</button>
          </div>
        </div>
      `;
      eventsList.appendChild(col);
    });
  }

  // Manejar cambio de idioma
  document.getElementById('langES').addEventListener('click', () => {
    currentLang = 'es';
    applyTranslations();
    renderPremium();
    renderPromotions();
    renderBusinesses();
    renderEvents();
  });
  document.getElementById('langEN').addEventListener('click', () => {
    currentLang = 'en';
    applyTranslations();
    renderPremium();
    renderPromotions();
    renderBusinesses();
    renderEvents();
  });

  // Manejar búsqueda
  document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderBusinesses();
  });

  // Manejar filtros de categoría
  document.querySelectorAll('#categoryMenu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('#categoryMenu a').forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      renderBusinesses();
    });
  });

  // Near me detection
  document.getElementById('nearMeBtn').addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert(currentLang === 'es' ? 'La geolocalización no es compatible.' : 'Geolocation is not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      // Filtrar negocios a 5 km
      const nearby = businesses.filter(biz => calculateDistance(latitude, longitude, biz.lat, biz.lon) <= 5);
      const container = document.getElementById('businessList');
      container.innerHTML = '';
      nearby.forEach(biz => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
          <div class="card h-100 shadow-sm border-success">
            <img src="${biz.images[0]}" class="card-img-top" alt="${biz.name_es}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${currentLang === 'es' ? biz.name_es : biz.name_en}</h5>
              <div class="rating mb-2">${renderStars(biz.rating)}</div>
              <p class="card-text flex-grow-1">${currentLang === 'es' ? biz.description_es : biz.description_en}</p>
              <p class="fw-bold mb-1"><i class="fa-solid fa-location-dot"></i> ${currentLang === 'es' ? biz.address_es : biz.address_en}</p>
              <div class="mb-2">
                <span class="badge bg-secondary me-1">${biz.price}</span>
                <span class="badge bg-info text-dark">${currentLang === 'es' ? getCategoryLabel(biz.category, 'es') : getCategoryLabel(biz.category, 'en')}</span>
              </div>
              <div class="mt-auto">
                <a href="https://wa.me/${biz.whatsapp.replace(/[^0-9\+]/g,'')}?text=${encodeURIComponent(getWhatsappMessage(biz))}" class="btn btn-success btn-sm me-1" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                <a href="tel:${biz.phone}" class="btn btn-primary btn-sm me-1"><i class="fa-solid fa-phone"></i> ${currentLang === 'es' ? 'Llamar' : 'Call'}</a>
                <a href="https://www.google.com/maps?q=${biz.lat},${biz.lon}" class="btn btn-outline-secondary btn-sm" target="_blank"><i class="fa-solid fa-map-location-dot"></i> Map</a>
              </div>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    }, err => {
      alert(currentLang === 'es' ? 'No se pudo obtener tu ubicación.' : 'Could not retrieve your location.');
    });
  });

  // Inicialización
  applyTranslations();
  renderPremium();
  renderPromotions();
  renderBusinesses();
  renderEvents();
});