"use strict";

(function() {
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function bytes(value) {
    
    if (!Number.isFinite(value)) {
      return "N/A";
    }
    
    if (value < 1024)
      return `${value} B`;
    
    if (value < 1024 ** 2)
      return `${(value / 1024).toFixed(1)} KB`;
    
    if (value < 1024 ** 3)
      return `${(value / 1024 ** 2).toFixed(1)} MB`;
    
    return `${(value / 1024 ** 3).toFixed(2)} GB`;
  }
  
  async function refresh() {
    
    if (!navigator.storage?.estimate) {
      
      set(
        "storagePercent",
        "N/A"
      );
      
      set(
        "storageUsed",
        "Tidak tersedia"
      );
      
      return;
    }
    
    try {
      
      const data =
        await navigator.storage.estimate();
      
      const used = data.usage || 0;
      const quota = data.quota || 0;
      
      if (!quota) return;
      
      const available =
        Math.max(quota - used, 0);
      
      const percent =
        Math.min(
          100,
          (used / quota) * 100
        );
      
      set(
        "storagePercent",
        `${percent.toFixed(1)}%`
      );
      
      set(
        "storageUsed",
        bytes(used)
      );
      
      set(
        "storageQuota",
        bytes(quota)
      );
      
      set(
        "storageAvailable",
        bytes(available)
      );
      
    } catch {
      
      set(
        "storagePercent",
        "N/A"
      );
    }
  }
  
  window.DarkSpyStorage = {
    refresh
  };
  
  refresh();
  
  setInterval(refresh, 5000);
  
})();