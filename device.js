"use strict";

(function() {
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  function browser() {
    const ua = navigator.userAgent;
    
    if (/Edg\//i.test(ua)) return "Edge";
    if (/OPR\//i.test(ua)) return "Opera";
    if (/Chrome\//i.test(ua)) return "Chrome";
    if (/Firefox\//i.test(ua)) return "Firefox";
    if (/Safari\//i.test(ua)) return "Safari";
    
    return "Unknown";
  }
  
  function platform() {
    return navigator.userAgentData?.platform ||
      navigator.platform ||
      "Unknown";
  }
  
  function refresh() {
    
    const p = platform();
    const b = browser();
    
    const screenInfo =
      `${screen.width} × ${screen.height}`;
    
    const orientation =
      screen.orientation?.type ||
      (innerWidth > innerHeight ?
        "landscape" :
        "portrait");
    
    const timezone =
      Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone || "Unknown";
    
    const language =
      navigator.language || "Unknown";
    
    const cpu =
      navigator.hardwareConcurrency || "Unknown";
    
    const memory =
      navigator.deviceMemory ?
      `${navigator.deviceMemory} GB` :
      "Tidak tersedia";
    
    set("sumPlatform", p);
    set("sumBrowser", b);
    set("sumScreen", screenInfo);
    set("sumCPU", cpu);
    set("sumLanguage", language);
    set("sumTimezone", timezone);
    
    set("devicePlatform", p);
    set("deviceBrowser", b);
    set("deviceUA", navigator.userAgent);
    set("deviceCPU", cpu);
    set("deviceMemory", memory);
    set("deviceScreen", screenInfo);
    set("pixelRatio", `${devicePixelRatio}x`);
    set("deviceOrientation", orientation);
    set("deviceLanguage", language);
    set("deviceTimezone", timezone);
  }
  
  window.DarkSpyDevice = {
    refresh
  };
  
  refresh();
  
  window.addEventListener("resize", refresh);
  
})();