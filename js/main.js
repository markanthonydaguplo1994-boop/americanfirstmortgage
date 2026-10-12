/* The Metropolitan Spring Hill: site behaviour (shared by every page) */
(function () {
  'use strict';

  // ---- Configuration -------------------------------------------------------
  // BOOKING_URL: your online booking engine link (e.g. SiteMinder, Cloudbeds,
  // Little Hotelier). {checkin}, {checkout}, {guests} and {room} are filled in
  // from the booking form. Leave empty to send guests an email enquiry instead.
  var BOOKING_URL = '';
  // CONTACT_ENDPOINT: a form service URL (e.g. https://formspree.io/f/xxxx).
  // Leave empty to open the visitor's email app with the message filled in.
  var CONTACT_ENDPOINT = '';
  var HOTEL_EMAIL = 'stay@metropolitanspringhill.com.au';
  var HOTEL_PHONE = '(07) 3831 6000';
  // --------------------------------------------------------------------------

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  // Solid header once the page scrolls
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Fade content in as it scrolls into view
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section-head, .split > *, .room-card, .room-detail, .amenity-grid li, .info-card, .thing, .faq details')
      .forEach(function (el) {
        el.classList.add('reveal');
        revealObserver.observe(el);
      });
  }

  var year = document.querySelector('.year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Booking form (home page and book.html) ------------------------------
  var bookForm = document.querySelector('.booking-form');
  if (bookForm) {
    var checkin = bookForm.querySelector('[name="checkin"]');
    var checkout = bookForm.querySelector('[name="checkout"]');
    var guests = bookForm.querySelector('[name="guests"]');
    var room = bookForm.querySelector('[name="room"]');
    var bookError = bookForm.querySelector('.form-error');

    var isoDate = function (d) {
      var tz = d.getTimezoneOffset() * 60000;
      return new Date(d - tz).toISOString().slice(0, 10);
    };
    var addDays = function (iso, n) {
      var d = new Date(iso + 'T00:00:00');
      d.setDate(d.getDate() + n);
      return isoDate(d);
    };

    // Pre-fill from the URL, e.g. book.html?room=Family+Room&checkin=2026-12-01
    var params = new URLSearchParams(window.location.search);
    var dateParam = function (name) {
      var v = params.get(name) || '';
      return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
    };
    var today = isoDate(new Date());
    var inParam = dateParam('checkin');
    var outParam = dateParam('checkout');
    checkin.min = today;
    checkin.value = inParam >= today ? inParam : today;
    checkout.min = addDays(checkin.value, 1);
    checkout.value = outParam > checkin.value ? outParam : addDays(checkin.value, 1);
    if (params.get('guests')) guests.value = params.get('guests');
    if (room && params.get('room')) room.value = params.get('room');

    checkin.addEventListener('change', function () {
      var minOut = addDays(checkin.value, 1);
      checkout.min = minOut;
      if (!checkout.value || checkout.value < minOut) checkout.value = minOut;
    });

    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      bookError.hidden = true;
      if (!checkin.value || !checkout.value || checkout.value <= checkin.value) {
        bookError.textContent = 'Please choose a check-out date after your check-in date.';
        bookError.hidden = false;
        checkout.setAttribute('aria-invalid', 'true');
        checkout.focus();
        return;
      }
      checkout.removeAttribute('aria-invalid');
      var roomName = room ? room.value : '';

      if (BOOKING_URL) {
        window.location.href = BOOKING_URL
          .replace('{checkin}', encodeURIComponent(checkin.value))
          .replace('{checkout}', encodeURIComponent(checkout.value))
          .replace('{guests}', encodeURIComponent(guests.value))
          .replace('{room}', encodeURIComponent(roomName));
        return;
      }

      var body = 'Hi,\n\nI would like to check availability for:\n\n' +
        'Check in: ' + checkin.value + '\n' +
        'Check out: ' + checkout.value + '\n' +
        'Guests: ' + guests.options[guests.selectedIndex].text + '\n' +
        (roomName ? 'Room: ' + roomName + '\n' : '') +
        '\nThank you.';
      window.location.href = 'mailto:' + HOTEL_EMAIL +
        '?subject=' + encodeURIComponent('Availability enquiry') +
        '&body=' + encodeURIComponent(body);
    });
  }

  // ---- Contact form (contact.html) -----------------------------------------
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var status = contactForm.querySelector('.form-status');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var firstInvalid = null;
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        var ok = field.checkValidity() && field.value.trim() !== '';
        field.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        status.textContent = 'Please fill in your name, a valid email and a message.';
        status.classList.add('err');
        firstInvalid.focus();
        return;
      }

      var data = new FormData(contactForm);

      if (CONTACT_ENDPOINT) {
        var btn = contactForm.querySelector('button');
        btn.disabled = true;
        fetch(CONTACT_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            contactForm.reset();
            status.textContent = 'Thanks! Your message has been sent. We\'ll be in touch soon.';
            status.classList.add('ok');
          })
          .catch(function () {
            status.textContent = 'Sorry, something went wrong. Please call us on ' + HOTEL_PHONE + '.';
            status.classList.add('err');
          })
          .finally(function () { btn.disabled = false; });
        return;
      }

      var body = 'Enquiry about: ' + data.get('topic') + '\n\n' + data.get('message') + '\n\n' +
        data.get('name') + (data.get('phone') ? '\n' + data.get('phone') : '') + '\n' + data.get('email');
      window.location.href = 'mailto:' + HOTEL_EMAIL +
        '?subject=' + encodeURIComponent('Website enquiry from ' + data.get('name')) +
        '&body=' + encodeURIComponent(body);
      status.textContent = 'Opening your email app…';
      status.classList.add('ok');
    });
  }
})();
