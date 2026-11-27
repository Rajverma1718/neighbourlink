# Start NeighbourLink

1. Extract the ZIP, then open its folder in VS Code.
2. Install Node.js 22 or newer.
3. Open Terminal > New Terminal in the project folder.
4. Run `npm start`. No `npm install` is needed.
5. Open http://127.0.0.1:4200.
6. Stop the server using Ctrl+C.

Internet is required. The project connects to your live NeighbourLink Firebase backend; users' cloud data is not bundled inside the ZIP. It starts without fictional listings.

Sign up using your email, verify the email, then use Account > I have verified. Verified email is required for publishing, enquiries and reports. Reset password is available in the login form.

The default map area is Mumbai, not your detected location. Press Near me to request device location, or move the map and press Search this area. The text box filters community listing names/localities; it does not geocode addresses. Load mapped restrooms requests real OpenStreetMap data through Overpass, which may be incomplete or temporarily unavailable.

Owners can add rental details, manage active/inactive status and reply privately in Inbox. Renters can save places and compare up to three rentals. There are no online payments or automatic enquiry email alerts in this release.

Photo uploads remain disabled because you requested keeping billing off. The source includes the upload code and Storage rules for later activation. Do not switch the flag to true without actually setting up and testing Storage.

Run `npm test` for the nine domain tests, and `npm run build` to prepare dist for GitHub Pages. See README.md for backend, permissions and deployment details.
