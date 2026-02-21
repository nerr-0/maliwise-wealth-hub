

# Plan: Add Investment Product Platforms

Add MMF (Money Market Funds), REITs, Bonds, and Bills to the Platforms section in the dashboard alongside the existing financial service platforms.

## Changes

**File: `src/pages/EnhancedDashboard.tsx`**

Add the following entries to the platforms array (around line 425):

- **Money Market Funds (MMFs)** -- Type: "Money Market Fund", e.g. CIC MMF, Cytonn MMF, Sanlam MMF
- **REITs** -- Type: "Real Estate Investment Trust", e.g. ILAM Fahari I-REIT, Acorn D-REIT
- **Government Bonds** -- Type: "Fixed Income", e.g. Kenya Government Bonds
- **Treasury Bills** -- Type: "Fixed Income", e.g. Kenya Treasury Bills

These will appear as additional cards in the same grid layout, each with a "Connect" button and "Not Connected" status, matching the existing platform card style.

The final platforms list will be:
1. ChamaSoft (Chama Management)
2. Ndovu (Digital Investment)
3. M-Pesa (Mobile Money)
4. KCB Bank (Banking)
5. Equity Bank (Banking)
6. CIC MMF (Money Market Fund)
7. Cytonn MMF (Money Market Fund)
8. Sanlam MMF (Money Market Fund)
9. ILAM Fahari I-REIT (REIT)
10. Acorn D-REIT (REIT)
11. Kenya Government Bonds (Fixed Income)
12. Kenya Treasury Bills (Fixed Income)

