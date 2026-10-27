# SR Estates website

Built from the RK Real Estate template, connected to the `sr-estates` Firebase project
and the `vofzzvhe` Cloudinary account.

## Files

| File | What it is |
|---|---|
| `index.html` | Home + all properties (Buy/Rent and type filters, search, detail popup with photo gallery + YouTube video) |
| `about.html` | About, stats, services, areas served |
| `contact.html` | Contact cards, office map, WhatsApp enquiry form |
| `admin.html` | Admin panel — Firebase email login, add / edit / delete / mark Sold, photo + document upload to Cloudinary |
| `404.html` | Redirects old links (`details.php?id=440` → `/?property=440`) |
| `firestore.rules` | Paste into Firebase → Firestore → Rules |

## Before going live

1. **Logo** — save the old site's logo as `logo.png` in this folder:
   `https://www.srestates.in/images/logo/logo@2x.png`
2. **Optional photo** — add `rakesh.png` (square photo of Mr. R. Rakesh). Without it an "SR" badge is shown.
3. **Firestore rules** — Firebase console → Firestore → Rules → paste `firestore.rules` → Publish.
4. **Authorized domains** — Firebase → Authentication → Settings → Authorized domains → add
   `maheshkumar040795-afk.github.io` and `srestates.in` / `www.srestates.in`.

## Data

- Collection `properties`, doc id = old site id (`440`). New listings continue from `442`.
- Shown on the site as `SR440`; links work as `?property=440` or `?property=SR440`.
- Photos: Cloudinary `sr-estates/<id>/` (migrated) and `sr-estates/new/` (added from admin).
- Price types: Lakh, Crore, ₹/sq.ft, ₹/month, On Request.
- Deleting a listing does not delete its photos from Cloudinary. Tick **Sold** to just hide it.
