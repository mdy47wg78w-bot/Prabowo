"use strict";

(function() {
  
  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  
  async function check(
    name,
    element
  ) {
    
    if (!navigator.permissions) {
      set(element, "UNKNOWN");
      return;
    }
    
    try {
      
      const result =
        await navigator.permissions.query({
          name
        });
      
      set(
        element,
        result.state.toUpperCase()
      );
      
      result.onchange = () => {
        set(
          element,
          result.state.toUpperCase()
        );
      };
      
    } catch {
      
      set(element, "UNKNOWN");
    }
  }
  
  async function refresh() {
    
    await check(
      "geolocation",
      "permissionLocation"
    );
    
    await check(
      "camera",
      "permissionCamera"
    );
    
    if ("Notification" in window) {
      
      set(
        "permissionNotification",
        Notification.permission.toUpperCase()
      );
      
    } else {
      
      set(
        "permissionNotification",
        "N/A"
      );
    }
  }
  
  window.DarkSpyPermissions = {
    refresh
  };
  
  refresh();
  
})();