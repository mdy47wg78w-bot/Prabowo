"use strict";

(function() {
  
  let battery = null;
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function time(seconds) {
    
    if (!Number.isFinite(seconds) ||
      seconds === Infinity ||
      seconds <= 0) {
      return "Tidak tersedia";
    }
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    return h > 0 ?
      `${h}j ${m}m` :
      `${m}m`;
  }
  
  function refresh() {
    
    if (!battery) return;
    
    const level =
      Math.round(battery.level * 100);
    
    set("dashBattery", `${level}%`);
    set(
      "dashCharging",
      battery.charging ?
      "CHARGING" :
      "NOT CHARGING"
    );
    
    set("batteryBig", `${level}%`);
    set("batteryLevel", `${level}%`);
    
    set(
      "batteryState",
      battery.charging ?
      "Charging" :
      "Not Charging"
    );
    
    set(
      "chargeTime",
      time(battery.chargingTime)
    );
    
    set(
      "dischargeTime",
      time(battery.dischargingTime)
    );
    
    const fill =
      document.getElementById("batteryFill");
    
    if (fill) {
      fill.style.width = `${level}%`;
    }
  }
  
  async function init() {
    
    if (!navigator.getBattery) {
      
      set("dashBattery", "N/A");
      set("batteryBig", "N/A");
      set(
        "batteryLevel",
        "Browser tidak mendukung"
      );
      
      return;
    }
    
    try {
      
      battery =
        await navigator.getBattery();
      
      refresh();
      
      [
        "levelchange",
        "chargingchange",
        "chargingtimechange",
        "dischargingtimechange"
      ].forEach(event => {
        battery.addEventListener(
          event,
          refresh
        );
      });
      
    } catch {
      
      set("dashBattery", "N/A");
      set("batteryBig", "N/A");
    }
  }
  
  window.DarkSpyBattery = {
    refresh
  };
  
  init();
  
})();