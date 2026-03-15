---

# 🌍 GLOBAL ENGINEERING MODE

## Laravel API + Mobile-First React PWA (Enterprise ERP Standard)

**Tech Stack:**
- Backend: Laravel (API-first)
- Frontend: React + TypeScript
- UI: Mantine UI
- Styling: Tailwind CSS
- Icons: Tabler Icons
- State: Zustand
- Architecture: Mobile-First PWA → Android/iOS (Capacitor)

---

# 🏗 BACKEND (Laravel)

## Architecture
- Clean Architecture: Controller → Service → Repository
- Thin controllers, business logic in services
- SOLID principles, dependency injection
- PSR-12 coding standard

## Security (NON-NEGOTIABLE)
- Form Request validation on ALL inputs
- Mass assignment protection (guarded/fillable)
- Authentication + Authorization (Policies/Gates)
- Never expose exceptions to client
- API must NEVER crash due to client behavior

## Performance
- Prevent N+1 (eager loading)
- Select only required columns
- Pagination for large datasets
- Use chunking for heavy processing

## Error Handling
```json
{
  success: boolean,
  message: string,
  data: object | array | null,
  meta?: pagination
}
```

---

# 📱 FRONTEND (React + PWA)

## UI Rules (STRICT)
- ✅ Mantine UI components only (no custom UI if Mantine has it)
- ✅ Tailwind CSS only (no inline styles)
- ✅ Tabler Icons only
- ✅ Design: Calm, Clean, Non-aggressive

## Mobile-First
- Mobile = baseline, Desktop = enhancement
- NO hover states (tap/click/press only)
- Finger-friendly touch targets
- Forms scroll when keyboard opens

## Responsive Data Rendering
- Desktop (md+) → Table view
- Mobile (<md) → Card view
- Use: `hidden md:block` and `block md:hidden`

## State Management (Zustand)
- Small, modular, predictable stores
- Selective selectors only
- Isolate side effects from UI

## Performance (CRITICAL)
- Assume low-end Android device
- useMemo, useCallback, Memoized components
- Never re-render full pages unnecessarily
- Optimize render cycles

## Navigation (STANDARD)
- ✅ `useNavigate()` hook (React Router)
- ❌ NEVER `window.location.href` (causes reloads)

---

# 🧘 UX MENTAL PEACE (NON-NEGOTIABLE)

ERP = long-usage software → Mental peace = feature

## Destructive Actions
- Always show confirmation dialog
- Calm, clear, non-threatening wording

## Feedback
- ✅ Success: Toast after create/update/delete
- ❌ Error: Human-readable, non-technical, calm
- 🔄 Loading: Smooth transitions, no flashing/blinking

---

# 🔤 Typography (Tailwind ONLY)

Mobile baseline. Desktop scales up.

- Body: `text-sm md:text-base`
- Section: `text-base md:text-lg lg:text-xl`
- Page: `text-lg md:text-xl lg:text-2xl`
- Always pair with: `leading-normal` or `leading-relaxed`

---

# 🌍 i18n (MANDATORY)

All user-facing text MUST be translatable via `t()`

**Structure:**
- `resources/js/locales/en/[module-name].json`
- `resources/js/locales/bn/[module-name].json`

**Applies to:** Buttons, Labels, Toasts, Errors, Confirmations, Dialogs

---

# 🛡 CODE QUALITY

## Backend
- Testable, Deterministic, Secure, Performant

## Frontend
- Fully TypeScript safe (no `any`)
- ESLint clean
- Predictable rendering
- No hidden side effects

---

# ✅ FINAL ASSUMPTION

If a feature feels:
- Aggressive, Cluttered, Unstable, Confusing (mobile), Stressful

→ It MUST be redesigned

**Mobile UX = baseline**
**Mental peace = feature**
**Security = mandatory**
**Performance = default**
**Clarity = law**

---
