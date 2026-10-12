/* The Metropolitan Spring Hill: site behaviour */
(function () {
  'use strict';

  // ---- Configuration -------------------------------------------------------
  // BOOKING_URL: your online booking engine link (e.g. SiteMinder, Cloudbeds,
  // Little Hotelier). {checkin}, {checkout} and {guests} are filled in from the
  // booking bar. Leave empty to send guests an email enquiry instead.
  var BOOKING_URL = '';
  // CONTACT_ENDPOINT: a form service URL (e.g. https://formspree.io/f/xxxx).
  // Leave empty to open the visitor's email app with the message filled in.
  var CONTACT_ENDPOINT = '';
  var HOTEL_EMAIL = 'stay@metropolitanspringhill.com.au';
  // --------------------------------------------------------------------------

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  // Header background once the page scrolls past the hero top
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

  // Highlight the nav link for the section in view
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('ul a'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });

    // Fade sections in as they scroll into view
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section-head, .split > *, .room-card, .amenity-grid li, .faq details').forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // ---- Booking bar ---------------------------------------------------------
  var bookForm = document.getElementById('book');
  var checkin = document.getElementById('checkin');
  var checkout = document.getElementById('checkout');
  var guests = document.getElementById('guests');
  var bookError = bookForm.querySelector('.form-error');
  var selectedRoom = '';

  function isoDate(d) {
    var tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  }
  function addDays(iso, n) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return isoDate(d);
  }

  var today = isoDate(new Date());
  checkin.min = today;
  checkin.value = today;
  checkout.min = addDays(today, 1);
  checkout.value = addDays(today, 1);

  checkin.addEventListener('change', function () {
    var minOut = addDays(checkin.value, 1);
    checkout.min = minOut;
    if (!checkout.value || checkout.value < minOut) checkout.value = minOut;
  });

  // "Book" buttons on room cards remember which room was chosen
  document.querySelectorAll('[data-room]').forEach(function (btn) {
    btn.addEventListener('click', function () { selectedRoom = btn.dataset.room; });
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

    if (BOOKING_URL) {
      window.location.href = BOOKING_URL
        .replace('{checkin}', encodeURIComponent(checkin.value))
        .replace('{checkout}', encodeURIComponent(checkout.value))
        .replace('{guests}', encodeURIComponent(guests.value));
      return;
    }

    var guestLabel = guests.options[guests.selectedIndex].text;
    var body = 'Hi,\n\nI would like to check availability for:\n\n' +
      'Check in: ' + checkin.value + '\n' +
      'Check out: ' + checkout.value + '\n' +
      'Guests: ' + guestLabel + '\n' +
      (selectedRoom ? 'Room: ' + selectedRoom + '\n' : '') +
      '\nThank you.';
    window.location.href = 'mailto:' + HOTEL_EMAIL +
      '?subject=' + encodeURIComponent('Availability enquiry') +
      '&body=' + encodeURIComponent(body);
  });

  // ---- Contact form --------------------------------------------------------
  var contactForm = document.getElementById('contact-form');
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
          status.textContent = 'Sorry, something went wrong. Please call us on (07) 3831 6000.';
          status.classList.add('err');
        })
        .finally(function () { btn.disabled = false; });
      return;
    }

    var body = data.get('message') + '\n\n' + data.get('name') +
      (data.get('phone') ? '\n' + data.get('phone') : '') + '\n' + data.get('email');
    window.location.href = 'mailto:' + HOTEL_EMAIL +
      '?subject=' + encodeURIComponent('Website enquiry from ' + data.get('name')) +
      '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app…';
    status.classList.add('ok');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
