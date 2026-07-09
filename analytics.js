/* ============================================================
   analytics.js — central tracking config for johngrossireferrals
   ------------------------------------------------------------
   SETUP (do this once, before running any ads):
   1. Create a GA4 property at analytics.google.com and paste the
      Measurement ID (looks like "G-XXXXXXXXXX") below.
   2. In Google Ads, create two conversion actions ("Lead form
      submission" and "Phone click") and paste the AW- ID and each
      conversion label below.
   3. In Meta Events Manager, create a Pixel and paste its ID below.
   Any ID left as an empty string "" is simply skipped — nothing
   loads and nothing breaks, so the site works fine before setup.
   ============================================================ */

var TRACKING = {
  GA4_ID: "",                 // e.g. "G-XXXXXXXXXX"
  GOOGLE_ADS_ID: "",          // e.g. "AW-123456789"
  ADS_LABEL_LEAD: "",         // conversion label for form submissions
  ADS_LABEL_CALL: "",         // conversion label for phone clicks
  META_PIXEL_ID: ""           // e.g. "1234567890123456"
};

(function () {
  // ---- Google tag (GA4 + Google Ads share one gtag.js) ----
  var gtagId = TRACKING.GA4_ID || TRACKING.GOOGLE_ADS_ID;
  if (gtagId) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + gtagId;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    if (TRACKING.GA4_ID) gtag("config", TRACKING.GA4_ID);
    if (TRACKING.GOOGLE_ADS_ID) gtag("config", TRACKING.GOOGLE_ADS_ID);
  }

  // ---- Meta Pixel ----
  if (TRACKING.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,"script","https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", TRACKING.META_PIXEL_ID);
    fbq("track", "PageView");
  }

  // ---- Conversion helpers ----
  // Call window.trackLead() after a successful form submission.
  window.trackLead = function (label) {
    label = label || "lead_form";
    if (window.gtag) {
      gtag("event", "generate_lead", { event_category: "conversion", event_label: label });
      if (TRACKING.GOOGLE_ADS_ID && TRACKING.ADS_LABEL_LEAD) {
        gtag("event", "conversion", { send_to: TRACKING.GOOGLE_ADS_ID + "/" + TRACKING.ADS_LABEL_LEAD });
      }
    }
    if (window.fbq) fbq("track", "Lead", { content_name: label });
  };

  // ---- Automatic phone-click tracking on every tel: link ----
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    if (window.gtag) {
      gtag("event", "phone_click", { event_category: "conversion", event_label: a.getAttribute("href") });
      if (TRACKING.GOOGLE_ADS_ID && TRACKING.ADS_LABEL_CALL) {
        gtag("event", "conversion", { send_to: TRACKING.GOOGLE_ADS_ID + "/" + TRACKING.ADS_LABEL_CALL });
      }
    }
    if (window.fbq) fbq("track", "Contact");
  });
})();
