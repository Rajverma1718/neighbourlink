# NeighbourLink

A community website by Raj Verma with two separate directories: public restrooms and rooms/houses for rent. FoodBridge integration is deferred.

## Run in VS Code

Install Node.js 22 or newer. Open this folder and run:

```sh
npm start
```

Open http://127.0.0.1:4200. No npm installation is needed. Internet access is required for Firebase, map libraries and map tiles. Use the local server rather than opening index.html as a file.

```sh
npm test
npm run build
```

## Features

- Separate restroom and rental sections with search by listing/locality, distance and relevant filters.
- Device location on request, map-area search and source-labelled OpenStreetMap restroom lookup.
- Rental comparison for up to three properties: rent, deposit, size, rent per square foot, furnishing, facilities and distance.
- Firebase email/password signup, login, verification and reset emails. Verified email is required to publish, enquire or report.
- Owner-created rental and restroom listings, editing, visibility controls and deletion.
- Public rental coordinates are rounded; exact address is saved separately and owner-only.
- Private saved community listings and rental enquiries, owner replies, cancellation and status tracking.
- Reporting and a moderation view. Moderators can hide listings; owners cannot undo moderation through their own edit rights.
- Responsive interface, labelled forms, keyboard-operable dialogs and explicit error/retry states.
- Photo upload implementation, validation, resizing and prepared Storage rules. **Photo storage remains disabled and unverified live, at the owner's request to keep billing off.**

No fictional listings, fabricated reviews, made-up ratings or sample users are seeded into the live database. Illustrations are decorative, not photographs of real properties. Enquiries appear inside the app; automatic enquiry email alerts and online payments are outside this release.

## Backend and permissions

The Firebase project is `neighbourlink-raj-2026`. Public web configuration in public/config.js is project metadata, not an administrator credential. Firestore rules enforce public-active versus owner-only listing access, exact-address privacy, participant-only enquiries and private saved records. A verified account with the owner-controlled email `vermaraj.techit@gmail.com` has moderation access; a trusted Firebase custom `admin` claim is also supported. Other accounts cannot grant this through profile fields.

Listings live in `listings`, owner-only addresses in `listing_private`, private conversations in `enquiries`, saved IDs under `users/{uid}/saved`, and moderation reports in `reports`. Photo paths are prepared under `owners/{uid}/listings/{listingId}` for future Storage activation.

Geo queries use pinned `geofire-common` and Firestore geohash indexes, followed by actual distance filtering. Query batches are paginated; press Load more when more community results remain. Text filters apply to loaded community records. OSM lookup is user-triggered and capped at a 10 km radius per lookup; it can fail or be incomplete because it depends on an external public service.

## Billing and photos

Billing has not been enabled. Firebase currently requires the Blaze plan for Cloud Storage. `settings.storageEnabled` is deliberately false. Do not switch it to true until a bucket exists, rules are deployed, image access is tested and the owner has agreed to the billing implications. Listings can be published without photos in this release.

## Deploy

Authenticate using your own Firebase CLI session, then:

```sh
firebase deploy --only auth,firestore,hosting --project neighbourlink-raj-2026
```

GitHub Pages is configured to build and publish only dist/. Firebase Hosting publishes public/. Add your local and production domains in Firebase Authentication authorised domains if you change them. Do not commit CLI session files, private keys, service-account JSON or real passwords.

## Responsible use

Listings are self-reported; email confirmation is not property-ownership verification. Renters must independently inspect a property before paying anyone. There is no payment gateway. Facility hours, fees and accessibility can change. Photos, when enabled, are intentionally public; never upload identity documents or other confidential information. Browser location is requested on user action and is not written to a user-tracking collection.

Map tiles: https://tile.openstreetmap.org/ with visible OpenStreetMap attribution. No offline tile downloads or bulk prefetching are implemented. The app uses no public Nominatim geocoder. Users choose the area on the map; the text box filters community listings rather than geocoding arbitrary addresses. Restroom lookup uses https://overpass-api.de/api/interpreter. For higher traffic, evaluate a suitable map/data provider and capacity controls.

## Release checks

Run domain.test.mjs for input validation, distances, filters, sorting, unknown-fee handling and text escaping. Deployment checks and live access-control checks are performed separately. Browser/device behaviour and external-map availability must also be checked; a successful static deployment alone does not prove every browser flow.
