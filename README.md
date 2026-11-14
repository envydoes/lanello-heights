# Lanello Heights — landing page (Google Apps Script)

Single-page web app for Lanello Heights by Masaito Homes, Brgy. Pasong Camachile II, General Trias, Cavite.

```
lanello-heights/
  .clasp.json          (created by `clasp create`, rootDir = src)
  src/
    appsscript.json    web app: execute as you, access: anyone (anonymous)
    Code.gs            doGet, include(), img(), submitInquiry(), setup()
    index.html         page markup (template)
    styles.html        CSS, pulled in with include('styles')
    script.html        JS, pulled in with include('script')
    media/*.html       photos as WebP data URIs, pulled in with img('name')
```

## One-time setup

```powershell
npm install -g @google/clasp
clasp login
```

Then turn on the Apps Script API at https://script.google.com/home/usersettings. `clasp push` fails until it is on.

## Create the project and push

Run these from this folder (`lanello-heights`):

```powershell
clasp create --type webapp --title "Lanello Heights" --rootDir src
clasp push --force
clasp open
```

> If `clasp create` replaces `src/appsscript.json` with a default manifest, restore the `webapp` block (`executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS`) and the `spreadsheets` OAuth scope before running `clasp push`.

In the editor, run **`setup`** once. It asks you to authorize Google Sheets, then creates the spreadsheet "Lanello Heights — Inquiries"; its URL appears in the execution log. To use a sheet you already have, add a Script Property `INQUIRY_SHEET_ID` with that sheet's ID before you run `setup`.

## Deploy

```powershell
clasp deploy --description "v1"
```

Or use **Deploy → New deployment → Web app** in the editor. To update a deployment after `clasp push`, use `clasp deploy -i <deploymentId>`, or **Manage deployments → Edit → New version**.

## Data notes

- Model specs, Chelsea's ₱3,712,500 TCP, coordinates (14.360221, 120.912148), contact numbers, photos and the YouTube tour all come from https://sites.google.com/view/lanello-heights.
- **Brenda:** the official site lists 2 BR / 2 T&B, 60 sqm floor area and 77 sqm lot area. The design spec said 3 BR and an 80 sqm lot. The page uses the official figures; see the comment in `index.html`.
- **Community amenities:** badminton, billiards and church follow the design spec. The official amenities page lists a gated entrance, office, covered basketball court, multi-purpose hall, playground and jogging path. Check with Masaito Homes before launch.
- The YouTube video (`wkC_NePhvLI`) is a third-party vlog embedded on the official site, not an official developer upload.
