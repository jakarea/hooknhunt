# CRM Module i18n Implementation Guide

## 📚 Overview

This guide shows how to convert hardcoded CRM components to support both English and Bangla (Bengali) translations.

---

## 🚀 Quick Start

### 1. Import the translation hook

```tsx
import { useTranslation } from 'react-i18next'
```

### 2. Initialize the hook in your component

```tsx
export default function YourComponent() {
  const { t } = useTranslation()

  // Now you can use t() function
  return <div>{t('crm.leads.title')}</div>
}
```

---

## 📝 Conversion Examples

### Example 1: CRM Dashboard Page

**❌ Before (Hardcoded):**
```tsx
<Title order={1}>CRM Dashboard</Title>
<Text>Customer Relationship Management Analytics</Text>
<Button>View Leads</Button>
```

**✅ After (Translatable):**
```tsx
import { useTranslation } from 'react-i18next'

export default function CRMDashboardPage() {
  const { t } = useTranslation()

  return (
    <>
      <Title order={1}>{t('crm.dashboard.title')}</Title>
      <Text>{t('crm.dashboard.subtitle')}</Text>
      <Button>{t('crm.leads.view')}</Button>
    </>
  )
}
```

**Result:**
- English: "CRM Dashboard" / "Customer Relationship Management Analytics"
- Bangla: "সিআরএম ড্যাশবোর্ড" / "কাস্টমার রিলেশনশিপ ম্যানেজমেন্ট অ্যানালিটিক্স"

---

### Example 2: Leads Status Badges

**❌ Before:**
```tsx
<Badge color="blue">New</Badge>
<Badge color="teal">Converted</Badge>
<Badge color="red">Lost</Badge>
```

**✅ After:**
```tsx
<Badge color="blue">{t('crm.leads.status.new')}</Badge>
<Badge color="teal">{t('crm.leads.status.converted')}</Badge>
<Badge color="red">{t('crm.leads.status.lost')}</Badge>
```

**Result:**
- English: "New" / "Converted" / "Lost"
- Bangla: "নতুন" / "কনভার্ট হয়েছে" / "হারিয়ে গেছে"

---

### Example 3: Filter Select Options

**❌ Before:**
```tsx
<Select
  data={[
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
  ]}
/>
```

**✅ After:**
```tsx
<Select
  data={[
    { value: 'all', label: t('crm.leads.status.all') },
    { value: 'new', label: t('crm.leads.status.new') },
    { value: 'contacted', label: t('crm.leads.status.contacted') },
  ]}
/>
```

---

### Example 4: Success/Error Messages

**❌ Before:**
```tsx
notifications.show({
  title: 'Success',
  message: 'Lead created successfully',
  color: 'green',
})

notifications.show({
  title: 'Error',
  message: 'Failed to load leads. Please try again.',
  color: 'red',
})
```

**✅ After:**
```tsx
notifications.show({
  title: t('common.success'),
  message: t('crm.leads.created'),
  color: 'green',
})

notifications.show({
  title: t('common.error'),
  message: t('crm.leads.errorLoading'),
  color: 'red',
})
```

**Result:**
- English: "Success" / "Lead created successfully"
- Bangla: "সফল হয়েছে" / "লিড সফলভাবে তৈরি করা হয়েছে"

---

### Example 5: Delete Confirmation

**❌ Before:**
```tsx
modals.openConfirmModal({
  title: 'Delete Lead',
  children: (
    <Text size="sm">
      Are you sure you want to delete this lead? This action cannot be undone.
    </Text>
  ),
  labels: { confirm: 'Delete', cancel: 'Cancel' },
})
```

**✅ After:**
```tsx
modals.openConfirmModal({
  title: t('crm.leads.delete'),
  children: (
    <Text size="sm">
      {t('crm.leads.deleteConfirm')}
    </Text>
  ),
  labels: {
    confirm: t('common.confirm'),
    cancel: t('common.cancel')
  },
})
```

**Result:**
- English: "Delete Lead" / "Are you sure you want to delete this lead? This action cannot be undone."
- Bangla: "লিড মুছুন" / "আপনি কি নিশ্চিতভাবে এই লিডটি মুছে ফেলতে চান? এটি ফিরিয়ে আনা যাবে না।"

---

### Example 6: Placeholders

**❌ Before:**
```tsx
<TextInput
  placeholder="Search leads by name or phone..."
/>

<TextInput
  placeholder="Search customers by name, phone or email..."
/>
```

**✅ After:**
```tsx
<TextInput
  placeholder={t('crm.leads.searchPlaceholder')}
/>

<TextInput
  placeholder={t('crm.customers.searchPlaceholder')}
/>
```

**Result:**
- English: "Search leads by name or phone..."
- Bangla: "নাম বা ফোন দিয়ে লিড খুঁজুন..."

---

### Example 7: Dynamic Labels with Interpolation

**✅ Using variables in translations:**

```tsx
// In translation file:
"welcomeUser": "Welcome back, {{name}}!"

// In component:
<Text>{t('crm.dashboard.welcomeUser', { name: user.name })}</Text>

// Result: "Welcome back, John!" (or "স্বাগতম, John!" in Bangla)
```

---

## 📋 Translation Key Reference

### Dashboard
```tsx
t('crm.dashboard.title')                    // "CRM Dashboard" / "সিআরএম ড্যাশবোর্ড"
t('crm.dashboard.subtitle')                 // "Customer Relationship Management Analytics"
t('crm.dashboard.totalLeads')               // "Total Leads" / "মোট লিড"
t('crm.dashboard.converted')                // "Converted" / "কনভার্ট হয়েছে"
t('crm.dashboard.conversionRate')           // "conversion rate" / "কনভার্সন রেট"
t('crm.dashboard.quickActions')             // "Quick Actions" / "দ্রুত কাজ"
```

### Leads
```tsx
t('crm.leads.title')                        // "Leads" / "লিড"
t('crm.leads.add')                          // "Add Lead" / "লিড যোগ করুন"
t('crm.leads.delete')                       // "Delete Lead" / "লিড মুছুন"
t('crm.leads.deleteConfirm')                // "Are you sure you want to delete this lead?..."
t('crm.leads.created')                      // "Lead created successfully" / "লিড সফলভাবে তৈরি করা হয়েছে"
t('crm.leads.errorLoading')                 // "Failed to load leads. Please try again."
t('crm.leads.searchPlaceholder')            // "Search leads by name or phone..."
t('crm.leads.status.new')                   // "New" / "নতুন"
t('crm.leads.status.contacted')             // "Contacted" / "যোগাযোগ করা হয়েছে"
t('crm.leads.status.qualified')             // "Qualified" / "যোগ্য"
t('crm.leads.status.converted')             // "Converted" / "কনভার্ট হয়েছে"
t('crm.leads.status.lost')                  // "Lost" / "হারিয়ে গেছে"
t('crm.leads.source.manual')                // "Manual Entry" / "ম্যানুয়াল এন্ট্রি"
t('crm.leads.source.website')               // "Website" / "ওয়েবসাইট"
```

### Customers
```tsx
t('crm.customers.title')                    // "Customers" / "কাস্টমার"
t('crm.customers.management')               // "Customer Management" / "কাস্টমার ম্যানেজমেন্ট"
t('crm.customers.export')                   // "Export to CSV" / "CSV তে এক্সপোর্ট করুন"
t('crm.customers.filter')                   // "Filter Customers" / "কাস্টমার ফিল্টার করুন"
t('crm.customers.clearFilters')             // "Clear All Filters" / "সব ফিল্টার সরান"
t('crm.customers.errorLoading')             // "Failed to load customers. Please try again."
t('crm.customers.type.retail')              // "Retail" / "খুচরা"
t('crm.customers.type.wholesale')           // "Wholesale" / "পাইকারি"
```

### Wallet
```tsx
t('crm.wallet.title')                       // "Wallet Management" / "ওয়ালেট ম্যানেজমেন্ট"
t('crm.wallet.balance')                     // "Wallet Balance" / "ওয়ালেট ব্যালেন্স"
t('crm.wallet.addFunds')                    // "Add Funds" / "টাকা যোগ করুন"
t('crm.wallet.deductFunds')                 // "Deduct Funds" / "টাকা কমান"
t('crm.wallet.freeze')                      // "Freeze Wallet" / "ওয়ালেট ফ্রিজ করুন"
```

### Loyalty
```tsx
t('crm.loyalty.title')                      // "Loyalty Program" / "লয়্যালটি প্রোগ্রাম"
t('crm.loyalty.tiers.bronze')               // "Bronze" / "ব্রোঞ্জ"
t('crm.loyalty.tiers.silver')               // "Silver" / "রুপালি"
t('crm.loyalty.tiers.gold')                 // "Gold" / "স্বর্ণ"
t('crm.loyalty.tiers.platinum')             // "Platinum" / "প্ল্যাটিনাম"
t('crm.loyalty.earnPoints')                 // "Earn Points" / "পয়েন্ট অর্জন করুন"
t('crm.loyalty.redeemPoints')               // "Redeem Points" / "পয়েন্ট খরচ করুন"
```

---

## 🎯 Complete Component Example

Here's a complete example of converting the CRM Dashboard page:

```tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Group, Title, Text, Button, Badge, Card } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

export default function CRMDashboardPage() {
  const { t } = useTranslation()  // ✅ Initialize translation hook
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/crm/stats')

      if (response.data?.status) {
        setStats(response.data.data)
      } else {
        throw new Error('Failed to fetch CRM stats')
      }
    } catch (error) {
      // ✅ Use translated error message
      notifications.show({
        title: t('common.error'),
        message: t('crm.dashboard.errorLoading'),
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <div>{t('common.loading')}...</div>
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* ✅ Translated header */}
        <Box>
          <Title order={1} className="text-lg md:text-xl lg:text-2xl">
            {t('crm.dashboard.title')}
          </Title>
          <Text c="dimmed" className="text-sm md:text-base">
            {t('crm.dashboard.subtitle')}
          </Text>
        </Box>

        {/* ✅ Translated metrics */}
        <Card withBorder p="md" radius="md">
          <Text size="xs" c="dimmed">{t('crm.dashboard.totalLeads')}</Text>
          <Text size="xl" fw={700}>{stats?.leads?.total}</Text>
          <Text size="xs" c="green">
            {stats?.leads?.thisMonth} {t('crm.dashboard.thisMonth')}
          </Text>
        </Card>

        {/* ✅ Translated status badges */}
        <Badge color="blue">{t('crm.leads.status.new')}</Badge>
        <Badge color="teal">{t('crm.leads.status.converted')}</Badge>

        {/* ✅ Translated buttons */}
        <Button>{t('crm.leads.add')}</Button>
        <Button>{t('crm.customers.view')}</Button>
      </Stack>
    </Box>
  )
}
```

---

## 🧪 Testing Language Switching

### Method 1: Using Browser Console

```javascript
// Switch to English
localStorage.setItem('i18nextLng', 'en')
location.reload()

// Switch to Bangla
localStorage.setItem('i18nextLng', 'bn')
location.reload()
```

### Method 2: Add Language Switcher Component

Create a language switcher in your app:

```tsx
import { useTranslation } from 'react-i18next'
import { SegmentedControl } from '@mantine/core'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <SegmentedControl
      value={i18n.language}
      onChange={(lang) => i18n.changeLanguage(lang)}
      data={[
        { label: '🇺🇸 English', value: 'en' },
        { label: '🇧🇩 বাংলা', value: 'bn' },
      ]}
    />
  )
}
```

---

## ✅ Implementation Checklist

For each CRM component, ensure you:

- [ ] Import `useTranslation` hook
- [ ] Initialize `const { t } = useTranslation()`
- [ ] Replace all hardcoded text with `t('key')`
- [ ] Test in English (default)
- [ ] Test in Bangla
- [ ] Check all placeholders
- [ ] Check all error/success messages
- [ ] Check all modal/confirmation dialogs
- [ ] Check all button labels
- [ ] Check all form field labels

---

## 📦 Files to Update

### High Priority
1. ✅ `crm/page.tsx` - Dashboard
2. ⏳ `crm/leads/page.tsx` - Leads list
3. ⏳ `crm/leads/create/page.tsx` - Create lead
4. ⏳ `crm/leads/[id]/page.tsx` - Lead details
5. ⏳ `crm/customers/page.tsx` - Customer list
6. ⏳ `crm/customers/create/page.tsx` - Create customer
7. ⏳ `crm/wallet/page.tsx` - Wallet management
8. ⏳ `crm/loyalty/page.tsx` - Loyalty program

---

## 🚀 Quick Implementation Tips

1. **Start with the most visible text first:** Titles, buttons, headers
2. **Use consistent key naming:** `crm.module.key` format
3. **Test both languages frequently:** Don't wait until the end
4. **Keep translation keys short but descriptive:** `crm.leads.add` not `crm.leads.button.add.new.lead`
5. **Use interpolation sparingly:** Only when variables are needed

---

## 🎉 Completion

After implementing translations:
- All CRM pages will be fully bilingual
- Language preference will be saved in localStorage
- Users can switch between English and Bangla seamlessly
- App will remember language choice across sessions

---

## 📞 Support

If you need help:
1. Check the translation files: `src/locales/en.json` and `src/locales/bn.json`
2. Refer to existing examples in auth/login/page.tsx (already translated)
3. Test with both languages to ensure everything works

---

**Translation Status:**
- ✅ Translation files created
- ⏳ Components need updating
- ⏳ Testing required

**Estimated Time:** 4-6 hours to update all CRM components
