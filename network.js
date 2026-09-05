"use strict";

(function() {
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function connection() {
    return navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection ||
      null;
  }
  
  function refresh() {
    
    const online = navigator.onLine;
    const status = online ?
      "ONLINE" :
      "OFFLINE";
    
    set("dashNetwork", status);
    set("networkStatus", status);
    set("netOnline", online ? "Yes" : "No");
    
    const c = connection();
    
    if (!c) {
      
      set("dashNetworkType", "API N/A");
      set("networkType", "N/A");
      set("networkEffective", "N/A");
      set("networkDownlink", "N/A");
      set("netSaveData", "N/A");
      set("netRTT", "N/A");
      set("netDown", "N/A");
      
      return;
    }
    
    set(
      "dashNetworkType",
      c.effectiveType || "Unknown"
    );
    
    set(
      "networkType",
      c.type || "Unknown"
    );
    
    set(
      "networkEffective",
      c.effectiveType || "Unknown"
    );
    
    set(
      "networkDownlink",
      Number.isFinite(c.downlink) ?
      `${c.downlink} Mbps` :
      "Unknown"
    );
    
    set(
      "netSaveData",
      c.saveData ?
      "Enabled" :
      "Disabled"
    );
    
    set(
      "netRTT",
      Number.isFinite(c.rtt) ?
      `${c.rtt} ms` :
      "Unknown"
    );
    
    set(
      "netDown",
      Number.isFinite(c.downlink) ?
      `${c.downlink} Mbps` :
      "Unknown"
    );
  }
  
  window.DarkSpyNetwork = {
    refresh
  };
  
  window.addEventListener("online", () => {
    refresh();
    
    if (window.logActivity) {
      logActivity(
        "Koneksi kembali online",
        "NETWORK"
      );
    }
  });
  
  window.addEventListener("offline", () => {
    refresh();
    
    if (window.logActivity) {
      logActivity(
        "Koneksi offline",
        "NETWORK"
      );
    }
  });
  
  const c = connection();
  
  if (c) {
    c.addEventListener("change", refresh);
  }
  
  refresh();
  
})();