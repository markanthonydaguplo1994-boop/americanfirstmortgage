# The Metropolitan Spring Hill: website

A rebuilt, fully responsive website for The Metropolitan Spring Hill
(106 Leichhardt Street, Spring Hill QLD 4000). It's plain HTML, CSS and JavaScript
with no build step: upload the folder to any web host.

```
index.html      page content
css/styles.css  design
js/main.js      menu, booking bar, contact form
img/            photos and favicon
```

## Before going live

1. **Photos**: add real photos to `img/` using these names (JPG, about 1600px wide):
   `hero.jpg`, `room-about.jpg`, `room-queen.jpg`, `room-twin.jpg`,
   `room-balcony.jpg`, `room-family.jpg`. Until then, coloured placeholders show.
2. **Rooms and prices**: the room names, bed setups and "From $" prices in
   `index.html` are placeholders. Match them to your real room types.
3. **Booking engine**: set `BOOKING_URL` at the top of `js/main.js` to your
   booking engine link, using `{checkin}`, `{checkout}` and `{guests}` where the dates go.
   If it's left empty, the booking bar opens a pre-filled email enquiry instead.
4. **Email**: `stay@metropolitanspringhill.com.au` is a placeholder. Replace it in
   `index.html` and `js/main.js`.
5. **Contact form**: optionally set `CONTACT_ENDPOINT` in `js/main.js` (for example
   Formspree) so enquiries are sent without opening the visitor's email app.
6. Check the rating, walking times and amenity list are still accurate.

## Improvements over the old site

- Mobile-first layout with a sticky "Call / Book direct" bar on phones
- Booking bar at the top of the page with date checks
- "Book direct" benefits section to win bookings back from OTAs
- FAQ answering common questions (check-in times, parking, transport)
- Embedded map, directions link and nearby attractions
- Hotel structured data (schema.org) and Open Graph tags for Google and social sharing
- Accessibility: skip link, keyboard-friendly menu, labelled forms, reduced-motion support
- Fast: no frameworks, one small script, lazy-loaded map
