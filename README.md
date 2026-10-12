# The Metropolitan Spring Hill: website

A rebuilt, fully responsive website for The Metropolitan Spring Hill
(106 Leichhardt Street, Spring Hill QLD 4000). It's plain HTML, CSS and JavaScript
with no build step: upload the folder to any web host.

```
index.html       Home
rooms.html       Room details (link to a room with rooms.html#queen, #twin, #balcony, #family)
facilities.html  Facilities, parking and hotel information
location.html    Map, getting here and things to do nearby
faq.html         Frequently asked questions
contact.html     Contact details and enquiry form
book.html        Booking form (accepts ?room=, ?checkin=, ?checkout=, ?guests=)
css/styles.css   Design shared by every page
js/main.js       Menu, booking form, contact form
img/             Photos and favicon
```

The header, footer and "Ready to stay" banner are repeated on every page, so an edit
to one of them (for example a new phone number) must be made in all seven HTML files.

## Before going live

1. **Photos**: add real photos to `img/` using these names (JPG, about 1600px wide):
   `hero.jpg`, `room-about.jpg`, `room-queen.jpg`, `room-twin.jpg`,
   `room-balcony.jpg`, `room-family.jpg`, `rooftop.jpg`, `parking.jpg`, `spring-hill.jpg`.
   Until then, coloured placeholders show.
2. **Rooms and prices**: the room names, bed setups and "From $" prices in
   `index.html`, `rooms.html` and `book.html` are placeholders. Match them to your real room types.
3. **Booking engine**: set `BOOKING_URL` at the top of `js/main.js` to your
   booking engine link, using `{checkin}`, `{checkout}` and `{guests}` where the dates go.
   If it's left empty, the booking bar opens a pre-filled email enquiry instead.
4. **Email**: `stay@metropolitanspringhill.com.au` is a placeholder. Replace it in
   every HTML file and in `js/main.js`.
5. **Contact form**: optionally set `CONTACT_ENDPOINT` in `js/main.js` (for example
   Formspree) so enquiries are sent without opening the visitor's email app.
6. Check the rating, walking times, amenity list, and the payment and smoking
   policies on `facilities.html` are accurate.

## Improvements over the old site

- Separate pages for rooms, facilities, location, FAQ, contact and booking, each with its own search title and description
- Room "Book this room" buttons carry the chosen room through to the booking form
- Mobile-first layout with a sticky "Call / Book direct" bar on phones
- Booking bar at the top of the page with date checks
- "Book direct" benefits section to win bookings back from OTAs
- FAQ answering common questions (check-in times, parking, transport)
- Embedded map, directions link and nearby attractions
- Hotel structured data (schema.org) and Open Graph tags for Google and social sharing
- Accessibility: skip link, keyboard-friendly menu, labelled forms, reduced-motion support
- Fast: no frameworks, one small script, lazy-loaded map
