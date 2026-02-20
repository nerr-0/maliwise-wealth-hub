

# Plan: Custom Favicon + Remove NSE Platform

## 1. Replace the Favicon (Browser Tab Icon)

Currently there is no explicit favicon link in `index.html`, so the browser falls back to Lovable's default icon.

**What we'll do:**
- Create an SVG favicon that matches the app logo -- a rounded green square with a white "M" (matching the Header component's logo)
- Add it as `public/favicon.svg`
- Update `index.html` to reference it with a `<link rel="icon">` tag
- Also update the page title from "maliwise-wealth-hub" to "MaliWise" and clean up the Lovable-branded meta tags (description, author, OG image, Twitter card)

## 2. Remove NSE from Connected Platforms

In `src/pages/EnhancedDashboard.tsx` (line 425), the "NSE (Nairobi Securities Exchange)" entry will be removed from the platforms array, leaving the other 5 platforms (ChamaSoft, Ndovu, M-Pesa, KCB Bank, Equity Bank).

---

## Files to Create
- `public/favicon.svg` -- SVG icon with green rounded square + white "M"

## Files to Modify
- `index.html` -- Add favicon link, update title/meta tags
- `src/pages/EnhancedDashboard.tsx` -- Remove NSE entry from the platforms list (line 425)

