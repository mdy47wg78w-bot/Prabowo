"use strict";

let monitoring = false;
let startTime = null;
let uptimeTimer = null;

let activity = [];

const loggingEnabled =
    () =>
        document.getElementById(
            "logging"
        )?.checked !== false;


/* =========================================================
   NAVIGATION
========================================================= */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .querySelectorAll(".nav")
        .forEach(button => {
            button.classList.remove("active");
        });

    const target =
        document.getElementById(page);

    if (target) {
        target.classList.add("active");
    }

    const nav =
        document.querySelector(
            `.nav[data-page="${page}"]`
        );

    if (nav) {
        nav.classList.add("active");
    }

    const names = {
        dashboard: "Dashboard",
        device: "Device",
        battery: "Battery",
        network: "Network",
        storage: "Storage",
        location: "Location",
        camera: "Camera",
        permissions: "Permissions",
        activity: "Activity",
        settings: "Settings"
    };

    const title =
        document.getElementById(
            "pageTitle"
        );

    if (title) {
        title.textContent =
            names[page] || page;
    }
}

document
    .querySelectorAll(".nav")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {
                showPage(
                    button.dataset.page
                );
            }
        );

    });


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const box =
        document.getElementById("toast");

    if (!box) return;

    box.textContent = message;
    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 2500);
}


/* =========================================================
   ACTIVITY LOG
========================================================= */

function logActivity(
    message,
    type = "SYSTEM"
) {

    if (!loggingEnabled()) {
        return;
    }

    const item = {
        time:
            new Date().toLocaleTimeString(),
        type,
        message
    };

    activity.unshift(item);

    if (activity.length > 200) {
        activity.pop();
    }

    renderLogs();
}

function renderLogs() {

    const full =
        document.getElementById(
            "activityLog"
        );

    const mini =
        document.getElementById(
            "miniLog"
        );

    if (full) {

        full.innerHTML =
            activity.length
                ? activity.map(item => `
                    <div class="logItem">
                        <span class="time">
                            ${escapeHTML(item.time)}
                        </span>

                        <span class="type">
                            ${escapeHTML(item.type)}
                        </span>

                        <span class="message">
                            ${escapeHTML(item.message)}
                        </span>
                    </div>
                `).join("")
                : `
                    <div class="logItem">
                        <span class="message">
                            Belum ada aktivitas.
                        </span>
                    </div>
                `;
    }

    if (mini) {

        mini.innerHTML =
            activity.slice(0, 6).map(item => `
                <div class="miniItem">
                    ${escapeHTML(item.message)}
                    <small>
                        ${escapeHTML(item.time)}
                    </small>
                </div>
            `).join("") ||
            `
                <div class="miniItem">
                    Belum ada event.
                </div>
            `;
    }
}

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");

    if (clock) {

        clock.textContent =
            new Date()
                .toLocaleTimeString();
    }
}

setInterval(updateClock, 1000);
updateClock();


/* =========================================================
   UPTIME
========================================================= */

function formatUptime(ms) {

    const total =
        Math.floor(ms / 1000);

    const seconds =
        total % 60;

    const minutes =
        Math.floor(total / 60) % 60;

    const hours =
        Math.floor(total / 3600);

    return [
        hours,
        minutes,
        seconds
    ]
        .map(n =>
            String(n).padStart(2, "0")
        )
        .join(":");
}

function updateUptime() {

    if (!startTime) return;

    const value =
        formatUptime(
            Date.now() - startTime
        );

    const el =
        document.getElementById(
            "dashUptime"
        );

    if (el) {
        el.textContent = value;
    }
}


/* =========================================================
   MASTER MONITOR
========================================================= */

function startMonitoring() {

    if (monitoring) return;

    monitoring = true;
    startTime = Date.now();

    const btn =
        document.getElementById(
            "masterBtn"
        );

    if (btn) {
        btn.textContent =
            "STOP MONITORING";

        btn.classList.remove("primary");
        btn.classList.add("danger");
    }

    setStatus(true);

    logActivity(
        "Monitoring session dimulai",
        "SYSTEM"
    );

    toast("Monitoring aktif");

    updateAll();

    uptimeTimer =
        setInterval(
            updateUptime,
            1000
        );
}

function stopMonitoring() {

    monitoring = false;

    if (uptimeTimer) {
        clearInterval(uptimeTimer);
        uptimeTimer = null;
    }

    if (window.DarkSpyCamera) {
        DarkSpyCamera.stop();
    }

    if (window.DarkSpyLocation) {
        DarkSpyLocation.stop();
    }

    const btn =
        document.getElementById(
            "masterBtn"
        );

    if (btn) {
        btn.textContent =
            "START MONITORING";

        btn.classList.remove("danger");
        btn.classList.add("primary");
    }

    setStatus(false);

    logActivity(
        "Semua monitoring dihentikan",
        "SYSTEM"
    );

    toast("Monitoring dihentikan");
}

function setStatus(active) {

    const text =
        active
            ? "RUNNING"
            : "STOPPED";

    const hero =
        document.getElementById(
            "heroStatus"
        );

    const side =
        document.getElementById(
            "sideStatus"
        );

    const dash =
        document.getElementById(
            "dashMonitor"
        );

    const sub =
        document.getElementById(
            "dashMonitorSub"
        );

    const dot =
        document.getElementById(
            "statusDot"
        );

    if (hero) {
        hero.textContent =
            active
                ? "SYSTEM ACTIVE"
                : "SYSTEM IDLE";
    }

    if (side) {
        side.textContent = text;
    }

    if (dash) {
        dash.textContent = text;
    }

    if (sub) {
        sub.textContent =
            active
                ? "Monitoring"
                : "Waiting";
    }

    if (dot) {
        dot.style.background =
            active
                ? "#35d58b"
                : "#ff5268";
    }
}

document
    .getElementById("masterBtn")
    ?.addEventListener(
        "click",
        () => {

            if (monitoring) {
                stopMonitoring();
            } else {
                startMonitoring();
            }

        }
    );


/* =========================================================
   REFRESH
========================================================= */

function updateAll() {

    DarkSpyDevice?.refresh();
    DarkSpyBattery?.refresh();
    DarkSpyNetwork?.refresh();
    DarkSpyStorage?.refresh();
    DarkSpyPermissions?.refresh();

    updateUptime();
}

setInterval(() => {

    const enabled =
        document.getElementById(
            "autoRefresh"
        )?.checked;

    if (enabled) {
        updateAll();
    }

}, 3000);


/* =========================================================
   EXPORT
========================================================= */

document
    .getElementById("exportLog")
    ?.addEventListener(
        "click",
        () => {

            const data =
                JSON.stringify(
                    activity,
                    null,
                    2
                );

            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;
            a.download =
                `darkspy-log-${Date.now()}.json`;

            a.click();

            URL.revokeObjectURL(url);

            toast("Log berhasil diekspor");
        }
    );


/* =========================================================
   CLEAR LOG
========================================================= */

document
    .getElementById("clearLog")
    ?.addEventListener(
        "click",
        () => {

            activity = [];

            renderLogs();

            toast("Log dibersihkan");
        }
    );


/* =========================================================
   RESET
========================================================= */

document
    .getElementById("resetBtn")
    ?.addEventListener(
        "click",
        () => {

            stopMonitoring();

            activity = [];

            renderLogs();

            startTime = null;

            const uptime =
                document.getElementById(
                    "dashUptime"
                );

            if (uptime) {
                uptime.textContent =
                    "00:00:00";
            }

            toast("Session di-reset");
        }
    );


/* =========================================================
   INITIALIZE
========================================================= */

setStatus(false);

logActivity(
    "DarkSpy V4 initialized",
    "SYSTEM"
);

updateAll();
renderLogs();