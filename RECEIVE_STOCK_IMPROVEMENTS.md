# Receive Stock Improvements

## Summary of Changes

I've implemented two major improvements to the **Receive Stock** flow (`/purchase/receive/:poItemId`):

### ✅ 1. Auto-filled Internal Name with Edit Capability

**What Changed:**
- Internal name is now **pre-filled with the product's base_name** when loading the page
- Users can still modify it if they want a different internal tracking name
- Added a helpful hint below the field explaining this behavior

**Implementation:**
- Located in `ReceiveStockNew.tsx` line 245
- When PO item is loaded, it automatically sets: `setInternalName(foundItem.product.base_name)`
- Added hint text: "💡 This is pre-filled with the product base name. You can modify it for internal tracking."

**User Experience:**
```
Before: User had to manually type the product name
After:  Field shows "Wireless Headphones" automatically, user can edit if needed
```

---

### ✅ 2. Auto-Save Draft on "Next" Button Click

**What Changed:**
- When user clicks "Next" button, data is **automatically saved as a draft**
- Draft is saved to localStorage (ready for backend API integration)
- Added **"Save Draft"** button for manual saves
- Implemented **auto-save** that triggers 3 seconds after user stops typing
- Added **"Auto-saved at HH:MM:SS"** indicator showing last save time

**Implementation Details:**

#### Draft Storage Structure
```typescript
{
  po_item_id: "39",
  product_id: 1,
  status: "draft",
  internal_name: "Rahim Mckee",
  product_type: "variable",

  // Simple product data
  simple_sku: "",
  simple_qty: "100",
  simple_landed_cost: "80",

  // Variable product data
  variants: [...],
  selected_attributes: [...],

  // Platform configuration
  platforms: {...},

  // Metadata
  current_step: 1,
  last_saved: "2025-12-07T10:30:45.123Z"
}
```

#### Save Triggers

1. **On "Next" Button Click** (lines 588-612)
   - Validates the current step
   - Saves draft before moving to next step
   - Shows success message: "✓ Step 1 completed & saved as draft!"

2. **Manual "Save Draft" Button** (lines 1462-1476)
   - Located in navigation area
   - Saves immediately when clicked
   - Shows toast notification

3. **Auto-Save** (lines 557-577)
   - Triggers 3 seconds after user stops editing
   - Silent save (no notifications)
   - Updates "Auto-saved at HH:MM:SS" indicator

#### Draft Recovery

When user returns to the page:
- Draft is automatically loaded from localStorage (lines 580-605)
- All fields are restored to previous values
- User sees notification: "📝 Draft loaded from previous session"
- Can continue from where they left off

---

## Visual Changes

### Navigation Area (Bottom of Page)

**Before:**
```
[← Previous]          Step 1 of 4          [Next →]
```

**After:**
```
[← Previous]    [Save Draft]    Step 1 of 4         [Next →]
                                ✓ Auto-saved at 10:30:45
```

### Internal Name Field

**Before:**
```
Internal Name *
[                    ] (empty field)
```

**After:**
```
Internal Name *
[Wireless Headphones] (pre-filled, editable)
💡 This is pre-filled with the product base name. You can modify it for internal tracking.
```

---

## Technical Implementation

### Files Modified
- `hooknhunt-ui/src/pages/inventory/ReceiveStockNew.tsx`

### Key Functions Added

1. **`saveDraft(silent = false)`** (lines 512-557)
   - Saves current form state to localStorage
   - Returns true/false for success/failure
   - `silent` parameter suppresses console logs for auto-save

2. **`useEffect` for Draft Loading** (lines 580-605)
   - Runs on component mount
   - Checks localStorage for saved draft
   - Restores all form fields

3. **`useEffect` for Auto-Save** (lines 557-577)
   - Watches all important form fields
   - Debounces saves to 3 seconds after last change
   - Prevents excessive saves

### State Variables Added
```typescript
const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
const [lastSaved, setLastSaved] = useState<string | null>(null);
```

---

## Backend Integration (TODO)

Currently, drafts are saved to **localStorage**. To integrate with backend:

### 1. Create API Endpoint

```php
// Laravel Route
POST /api/v1/admin/inventory/receive-stock/draft

// Request Body (same as localStorage structure)
{
  "po_item_id": "39",
  "product_id": 1,
  "status": "draft",
  "internal_name": "Rahim Mckee",
  "product_type": "variable",
  // ... rest of data
}
```

### 2. Update `saveDraft()` function

Replace this:
```typescript
localStorage.setItem(`receive_stock_draft_${poItemId}`, JSON.stringify(draftData));
```

With this:
```typescript
const response = await apiClient.post('/admin/inventory/receive-stock/draft', draftData);
```

### 3. Update Draft Loading

Replace this:
```typescript
const savedDraft = localStorage.getItem(`receive_stock_draft_${poItemId}`);
if (savedDraft) {
  const draftData = JSON.parse(savedDraft);
  // ... restore state
}
```

With this:
```typescript
const response = await apiClient.get(`/admin/inventory/receive-stock/draft/${poItemId}`);
if (response.data) {
  const draftData = response.data;
  // ... restore state
}
```

### 4. Database Schema (Suggested)

```sql
CREATE TABLE inventory_receive_drafts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  po_item_id BIGINT NOT NULL,
  product_id BIGINT,
  user_id BIGINT,
  status VARCHAR(20) DEFAULT 'draft',
  draft_data JSON NOT NULL,
  current_step INT DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  FOREIGN KEY (po_item_id) REFERENCES purchase_order_items(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id),

  UNIQUE KEY (po_item_id) -- One draft per PO item
);
```

---

## Testing Checklist

### Manual Testing Steps

1. **Pre-filled Internal Name**
   - [ ] Navigate to `/purchase/receive/39`
   - [ ] Verify internal name shows product base name
   - [ ] Modify the name
   - [ ] Verify change persists

2. **Save Draft Button**
   - [ ] Click "Save Draft" button
   - [ ] Verify toast shows "💾 Draft saved successfully!"
   - [ ] Refresh page
   - [ ] Verify data is restored

3. **Auto-Save on Next**
   - [ ] Fill in Step 1 data
   - [ ] Click "Next" button
   - [ ] Verify toast shows "✓ Step 1 completed & saved as draft!"
   - [ ] Check localStorage for saved data
   - [ ] Refresh page
   - [ ] Verify you're on Step 2 with data intact

4. **Auto-Save Timer**
   - [ ] Type in any field
   - [ ] Wait 3 seconds
   - [ ] Verify "✓ Auto-saved at HH:MM:SS" appears
   - [ ] Continue typing
   - [ ] Verify timestamp updates after 3 seconds

5. **Draft Recovery**
   - [ ] Fill in data and move through steps
   - [ ] Close browser/tab
   - [ ] Return to same URL
   - [ ] Verify message: "📝 Draft loaded from previous session"
   - [ ] Verify all fields are restored

---

## Benefits

### For Users
✅ **Saves Time**: No need to manually re-enter product name
✅ **No Data Loss**: Progress is automatically saved
✅ **Flexibility**: Can leave and return without losing work
✅ **Peace of Mind**: Visual confirmation of saves

### For System
✅ **Better UX**: Reduced friction in inventory management
✅ **Data Integrity**: Less chance of losing work
✅ **Efficiency**: Users can work faster and with confidence

---

## Future Enhancements

1. **Backend Persistence**
   - Store drafts in database instead of localStorage
   - Allows access from different devices
   - Enables draft management/deletion

2. **Draft List**
   - Show all pending drafts in a dashboard
   - Allow users to resume or delete drafts
   - Show draft age and status

3. **Conflict Resolution**
   - Handle cases where PO item is modified while draft exists
   - Warn user if draft is outdated

4. **Version History**
   - Keep previous draft versions
   - Allow user to revert to earlier state

---

## Console Debugging

When testing, check browser console for:

```
💾 Saving draft... {po_item_id: "39", ...}
✓ Auto-saved at 10:30:45
📝 Draft loaded from previous session
```

To clear a draft for testing:
```javascript
localStorage.removeItem('receive_stock_draft_39')
```

To view saved draft:
```javascript
JSON.parse(localStorage.getItem('receive_stock_draft_39'))
```
