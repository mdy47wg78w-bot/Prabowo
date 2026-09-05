"use strict";

(function() {
  
  let watchId = null;
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function permission(state) {
    
    set(
      "permissionLocation",
      state.toUpperCase()
    );
  }
  
  async function checkPermission() {
    
    if (!navigator.permissions) {
      permission("unknown");
      return;
    }
    
    try {
      
      const p =
        await navigator.permissions.query({
          name: "geolocation"
        });
      
      permission(p.state);
      
      p.onchange = () =>
        permission(p.state);
      
    } catch {
      
      permission("unknown");
    }
  }
  
  function start() {
    
    if (!navigator.geolocation) {
      
      logActivity(
        "Geolocation tidak tersedia",
        "ERROR"
      );
      
      return;
    }
    
    if (watchId !== null) return;
    
    logActivity(
      "Meminta izin lokasi",
      "LOCATION"
    );
    
    watchId =
      navigator.geolocation.watchPosition(
        
        position => {
          
          const c =
            position.coords;
          
          set(
            "latitude",
            c.latitude.toFixed(6)
          );
          
          set(
            "longitude",
            c.longitude.toFixed(6)
          );
          
          set(
            "locationAccuracy",
            `${Math.round(
                            c.accuracy
                        )} meter`
          );
          
          set(
            "locationTime",
            new Date()
            .toLocaleTimeString()
          );
          
          permission("granted");
          
          logActivity(
            "Lokasi diperbarui",
            "LOCATION"
          );
        },
        
        error => {
          
          const msg = {
            1: "Izin lokasi ditolak",
            2: "Lokasi tidak tersedia",
            3: "Request lokasi timeout"
          };
          
          logActivity(
            msg[error.code] ||
            "Gagal mendapatkan lokasi",
            "ERROR"
          );
        },
        
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000
        }
      );
  }
  
  function stop() {
    
    if (watchId === null) return;
    
    navigator.geolocation.clearWatch(
      watchId
    );
    
    watchId = null;
    
    logActivity(
      "Monitoring lokasi dihentikan",
      "LOCATION"
    );
  }
  
  document
    .getElementById("locationStart")
    ?.addEventListener(
      "click",
      start
    );
  
  document
    .getElementById("locationStop")
    ?.addEventListener(
      "click",
      stop
    );
  
  window.DarkSpyLocation = {
    start,
    stop,
    isActive: () =>
      watchId !== null
  };
  
  checkPermission();
  
})();