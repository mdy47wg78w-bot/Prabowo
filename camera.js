"use strict";

(function() {
  
  let stream = null;
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function updatePermission(state) {
    
    set(
      "permissionCamera",
      state.toUpperCase()
    );
  }
  
  async function checkPermission() {
    
    if (!navigator.permissions) {
      updatePermission("unknown");
      return;
    }
    
    try {
      
      const p =
        await navigator.permissions.query({
          name: "camera"
        });
      
      updatePermission(p.state);
      
      p.onchange = () =>
        updatePermission(p.state);
      
    } catch {
      
      updatePermission("unknown");
    }
  }
  
  async function start() {
    
    if (!navigator.mediaDevices?.getUserMedia) {
      
      logActivity(
        "Camera API tidak tersedia",
        "ERROR"
      );
      
      return;
    }
    
    if (stream) return;
    
    try {
      
      logActivity(
        "Meminta izin kamera",
        "CAMERA"
      );
      
      stream =
        await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false
        });
      
      const video =
        document.getElementById(
          "cameraVideo"
        );
      
      video.srcObject = stream;
      
      updatePermission("granted");
      
      set(
        "cameraState",
        "● CAMERA ACTIVE"
      );
      
      logActivity(
        "Kamera aktif — preview lokal",
        "CAMERA"
      );
      
    } catch (error) {
      
      updatePermission(
        error.name === "NotAllowedError" ?
        "denied" :
        "unknown"
      );
      
      logActivity(
        `Kamera gagal: ${
                    error.message || "Unknown"
                }`,
        "ERROR"
      );
    }
  }
  
  function stop() {
    
    if (!stream) return;
    
    stream.getTracks()
      .forEach(track => track.stop());
    
    stream = null;
    
    const video =
      document.getElementById(
        "cameraVideo"
      );
    
    if (video) {
      video.srcObject = null;
    }
    
    set(
      "cameraState",
      "CAMERA OFF"
    );
    
    logActivity(
      "Kamera dihentikan",
      "CAMERA"
    );
  }
  
  document
    .getElementById("cameraStart")
    ?.addEventListener(
      "click",
      start
    );
  
  document
    .getElementById("cameraStop")
    ?.addEventListener(
      "click",
      stop
    );
  
  window.DarkSpyCamera = {
    start,
    stop,
    isActive: () =>
      stream !== null
  };
  
  checkPermission();
  
})();