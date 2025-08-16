// REEMPLAZA todo window.detectLocation = function () { ... } por ESTO:
window.detectLocation = function () {
  alert('A) CLICK detectLocation');              // 1: el botón sí llamó a la función

  if (!navigator.geolocation) {
    alert('B) NO GEO: el navegador no soporta geolocalización');
    return;
  }

  alert('C) LLAMAR getCurrentPosition');         // 2: vamos a pedir GPS

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      alert('D) OK GPS');                        // 3: el GPS regresó coordenadas
      const { latitude, longitude } = pos.coords;
      document.getElementById('latitude').readOnly = false;
      document.getElementById('longitude').readOnly = false;
      document.getElementById('latitude').value  = latitude.toFixed(6);
      document.getElementById('longitude').value = longitude.toFixed(6);
    },
    (err) => {
      alert('E) ERROR GPS: ' + err.code + ' - ' + err.message); // 4: falló y por qué
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
};
