// Ortal Agiv Dress Designer – site behaviour
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "972543477775";

  document.documentElement.classList.add("js");

  // Year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Header border on scroll
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "פתיחת תפריט");
    }
  });

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  // Booking form → WhatsApp message
  var form = document.getElementById("bookingForm");
  var error = document.getElementById("formError");

  function formatDate(value) {
    if (!value) return "";
    var parts = value.split("-");
    return parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : value;
  }

  var f = form.elements;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = f["name"].value.trim();
    var phone = f["phone"].value.trim();

    f["name"].classList.toggle("invalid", !name);
    f["phone"].classList.toggle("invalid", !phone);
    if (!name || !phone) {
      error.hidden = false;
      (name ? f["phone"] : f["name"]).focus();
      return;
    }
    error.hidden = true;

    var lines = [
      "היי אורטל, אשמח לתאם פגישה 🤍",
      "",
      "שם: " + name,
      "טלפון: " + phone,
      "מחפשת: " + f["type"].value
    ];
    var date = formatDate(f["date"].value);
    if (date) lines.push("תאריך האירוע: " + date);
    var message = f["message"].value.trim();
    if (message) lines.push("", message);

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    var fallback = document.getElementById("waFallback");
    fallback.href = url;
    fallback.hidden = false;
    window.open(url, "_blank", "noopener");
  });
})();
