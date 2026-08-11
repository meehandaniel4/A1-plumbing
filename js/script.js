/* ============================================================
   A1 Handyman & Home Plumbing — interactions
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close the drawer when a link is tapped
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Quote form (work-order ticket) ---------- */
  var form = document.getElementById("quoteForm");
  var successBox = document.getElementById("formSuccess");
  var ticketEl = document.getElementById("ticketNum");

  if (form) {
    // Roll a fresh ticket number on load
    if (ticketEl) {
      var now = new Date();
      var day = String(now.getDate()).padStart(2, "0");
      var seed = (now.getMonth() * 31 + now.getDate() + now.getHours()).toString(36).toUpperCase().slice(-2);
      ticketEl.textContent = "A1-" + seed + day;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var service = form.querySelector('[name="service"]');

      [name, phone, service].forEach(function (field) {
        if (!field || !field.value.trim()) {
          valid = false;
          field && field.classList.add("field-error");
        } else {
          field && field.classList.remove("field-error");
        }
      });

      if (!valid) {
        return;
      }

      // This opens the messaging app on phones, with every submitted field
      // pre-filled in a text message for the customer to review and send.
      var companyPhone = "+12153806666";
      var ticketNumber = ticketEl ? ticketEl.textContent : "A1 inquiry";
      var bodyLines = [
        "Estimate request: " + ticketNumber,
        "",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Email: " + (form.querySelector('[name="email"]').value.trim() || "not provided"),
        "Service needed: " + (service.value || "not selected"),
        "",
        "Details:",
        form.querySelector('[name="message"]').value.trim() || "(no details provided)"
      ];
      var sms = "sms:" + companyPhone +
        "?body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = sms;

      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    // Clear error state as the user fixes fields
    form.addEventListener("input", function (e) {
      if (e.target.classList && e.target.classList.contains("field-error") && e.target.value.trim()) {
        e.target.classList.remove("field-error");
      }
    });
  }
})();
