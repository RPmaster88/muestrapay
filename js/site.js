(function () {
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  if (header && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var STORAGE_KEY = "clerkbay_cookie_consent_v1";

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  }

  function loadGoogleTags() {
    var cfg = window.CLERKBAY_CONFIG || {};
    if (cfg.googleTagManager && cfg.googleTagManager.enabled && cfg.googleTagManager.containerId) {
      var gtm = cfg.googleTagManager.containerId;
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0];
        var j = d.createElement(s);
        var dl = l !== "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", gtm);
    }
    if (cfg.googleAnalytics && cfg.googleAnalytics.enabled && cfg.googleAnalytics.measurementId) {
      var id = cfg.googleAnalytics.measurementId;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", id, { anonymize_ip: true });
    }
  }

  function hideBanner() {
    var banner = document.getElementById("cookie-banner");
    if (banner) banner.classList.remove("is-visible");
  }

  function showBanner() {
    var banner = document.getElementById("cookie-banner");
    if (banner) banner.classList.add("is-visible");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var existing = getConsent();
    if (existing && existing.analytics) loadGoogleTags();
    else if (!existing) showBanner();

    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var panel = document.getElementById("cookie-panel");
    var analyticsBox = document.getElementById("cookie-analytics");

    banner.querySelector("[data-cookie-accept-all]")?.addEventListener("click", function () {
      setConsent({ necessary: true, analytics: true, ts: Date.now() });
      loadGoogleTags();
      hideBanner();
    });
    banner.querySelector("[data-cookie-reject]")?.addEventListener("click", function () {
      setConsent({ necessary: true, analytics: false, ts: Date.now() });
      hideBanner();
    });
    banner.querySelector("[data-cookie-manage]")?.addEventListener("click", function () {
      panel?.classList.toggle("is-open");
    });
    banner.querySelector("[data-cookie-save]")?.addEventListener("click", function () {
      var analytics = analyticsBox ? analyticsBox.checked : false;
      setConsent({ necessary: true, analytics: analytics, ts: Date.now() });
      if (analytics) loadGoogleTags();
      hideBanner();
    });
  });

  window.CLERKBAY_COOKIES = { reopenBanner: showBanner, getConsent: getConsent };
})();
