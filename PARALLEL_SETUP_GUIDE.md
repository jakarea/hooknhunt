# 🎯 Parallel Development Setup Guide
## Monolith + Modular Side-by-Side

**Status**: Ready to Execute | **Created**: 2026-02-28

---

## 📁 Directory Structure (After Setup)

```
/Applications/MAMP/htdocs/hooknhunt/
├── hooknhunt-api/              # ✅ Original monolith (KEEP - working backup)
├── hooknhunt-modular/          # ✨ NEW: Modular version (fresh Laravel)
│   ├── Modules/
│   │   ├── Auth/
│   │   ├── Catalog/
│   │   ├── Finance/
│   │   └── ... (14 modules)
│   ├── app/                    # Minimal Laravel core
│   ├── routes/api.php          # Main routes (loads module routes)
│   └── config/modules.php      # Module configuration
│
├── storefront/                 # Next.js storefront (unchanged)
├── services/                   # Microservices (from earlier - optional)
├── setup-modular-project.sh    # ✅ Automated setup script
└── MODULAR_*.md                # Documentation
```

---

## 🚀 Quick Setup (Automated)

### Option 1: Run the Setup Script (Recommended)

```bash
cd /Applications/MAMP/htdocs/hooknhunt

# Make script executable
chmod +x setup-modular-project.sh

# Run setup
./setup-modular-project.sh
```

**This will**:
- ✅ Create fresh Laravel project
- ✅ Install nwidart/laravel-modules
- ✅ Create all 14 modules
- ✅ Configure for MAMP
- ✅ Run migrations
- ✅ Ready to use!

---

### Option 2: Manual Setup

```bash
# 1. Create new Laravel project
cd /Applications/MAMP/htdocs/hooknhunt
composer create-project laravel/laravel hooknhunt-modular

# 2. Install Laravel Modules
cd hooknhunt-modular
composer require nwidart/laravel-modules:^11.0

# 3. Publish config
php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"

# 4. Update composer.json autoload
# Add "Modules\\": "Modules/" to autoload.psr-4

# 5. Create modules
php artisan module:make Auth Catalog Finance Procurement Inventory Sales Logistics HRM CRM Wallet CMS Settings Media User

# 6. Configure .env for MAMP
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=8889
DB_DATABASE=hooknhunt_modular
DB_USERNAME=root
DB_PASSWORD=root

# 7. Run migrations
php artisan migrate

# 8. Start server
php artisan serve
```

---

## 📋 Development Workflow

### Phase 1: Parallel Development (Next 1-3 months)

**Keep both running, migrate gradually:**

```
Week 1-2: Setup & Auth Module
├── hooknhunt-api/         → Keep using (production)
└── hooknhunt-modular/     → Build Auth module

Week 3-4: Catalog & Settings Modules
├── hooknhunt-api/         → Keep using (production)
└── hooknhunt-modular/     → Add Catalog, Settings

Week 5-8: Core Modules
├── hooknhunt-api/         → Keep using (production)
└── hooknhunt-modular/     → Add Finance, Sales, Procurement

Week 9-12: Remaining Modules
├── hooknhunt-api/         → Keep using (production)
└── hooknhunt-modular/     → Add all remaining modules

Month 4: Testing & Migration
├── hooknhunt-api/         → Backup only
└── hooknhunt-modular/     → Production ready!
```

### Phase 2: Cutover to Modular

**When modular is ready:**

```bash
# 1. Deploy modular to cPanel
cd hooknhunt-modular
git push origin main

# On cPanel server
cd ~/public_html
mv api api-backup
git clone <your-repo> api
cd api
composer install --no-dev
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache

# 2. Test thoroughly
curl https://your-domain.com/api/v2/auth/health

# 3. Delete old monolith (after 1 week of testing)
rm -rf api-backup
```

---

## 🔀 Code Migration Strategy

### Strategy A: Copy & Adapt (Recommended)

**For each module:**

```bash
# 1. In hooknhunt-modular
cd Modules/Auth

# 2. Copy from monolith
cp ../../../hooknhunt-api/app/Http/Controllers/Api/V2/AuthController.php App/Controllers/

# 3. Update namespace
# From: namespace App\Http\Controllers\Api\V2;
# To: namespace Modules\Auth\App\Controllers;

# 4. Update imports
use Modules\Auth\App\Models\User;
use Modules\Auth\App\Models\Otp;

# 5. Copy models
cp ../../../hooknhunt-api/app/Models/User.php App/Models/
cp ../../../hooknhunt-api/app/Models/Otp.php App/Models/

# 6. Update model namespaces
# From: namespace App\Models;
# To: namespace Modules\Auth\App\Models;

# 7. Copy routes
# Extract auth routes from hooknhunt-api/routes/api.php
# Paste into Modules/Auth/Routes/api.php

# 8. Test
php artisan route:list | grep auth
curl http://localhost:8000/api/v2/auth/health
```

### Strategy B: Fresh Implementation (Clean Slate)

**Rewrite each module from scratch:**
- ✅ Clean code, no legacy
- ✅ Latest best practices
- ✅ No bad habits
- ❌ Takes longer

---

## 🧪 Testing Side-by-Side

### Test Monolith (Port 8000)
```bash
cd hooknhunt-api
php artisan serve --port=8000

# Test
curl http://localhost:8000/api/v2/auth/health
```

### Test Modular (Port 8001)
```bash
cd hooknhunt-modular
php artisan serve --port=8001

# Test
curl http://localhost:8001/api/v2/auth/health
```

### Compare Results
Both should return the same response!

---

## 📊 Migration Progress Tracker

Track your progress with this checklist:

### Auth Module
- [ ] Create module structure
- [ ] Copy AuthController
- [ ] Copy User, Otp models
- [ ] Copy auth requests
- [ ] Extract auth routes
- [ ] Update namespaces
- [ ] Test login endpoint
- [ ] Test registration endpoint
- [ ] Test OTP verification
- [ ] ✅ Complete

### Catalog Module
- [ ] Create module structure
- [ ] Copy ProductController, CategoryController, BrandController
- [ ] Copy Product, Category, Brand models
- [ ] Extract catalog routes
- [ ] Update namespaces
- [ ] Test all endpoints
- [ ] ✅ Complete

### Finance Module
- [ ] Create module structure
- [ ] Copy all finance controllers
- [ ] Copy ChartOfAccount, JournalEntry models
- [ ] Extract finance routes
- [ ] Update namespaces
- [ ] Test all endpoints
- [ ] ✅ Complete

### ... (11 more modules)

---

## 🗄️ Database Strategy

### Option A: Separate Databases (Recommended for Development)

**Monolith**: `hooknhunt` database
**Modular**: `hooknhunt_modular` database

**Benefits**:
- ✅ No conflicts
- ✅ Can test independently
- ✅ Safe migration

**Setup**:
```bash
# Create new database in MAMP
# Database: hooknhunt_modular

# Update .env in hooknhunt-modular
DB_DATABASE=hooknhunt_modular
```

### Option B: Same Database (Production)

**Both**: `hooknhunt` database

**Benefits**:
- ✅ Same data
- ✅ Easy cutover

**Risks**:
- ⚠️ Migrations might conflict
- ⚠️ Need to be careful

**Setup**:
```bash
# Use same database
DB_DATABASE=hooknhunt

# Add table prefixes to avoid conflicts
# Or just use same tables (easier)
```

---

## 🚢 Deployment Comparison

### Deploy Monolith (Current)
```bash
cd hooknhunt-api
git push
# On cPanel: git pull
```

### Deploy Modular (Future)
```bash
cd hooknhunt-modular
git push
# On cPanel: git pull
```

**Same deployment process!** Both are Laravel apps.

---

## 📚 Documentation Index

| Document | Purpose | Location |
|----------|---------|----------|
| **This Guide** | Parallel setup strategy | [link](./PARALLEL_SETUP_GUIDE.md) |
| **MODULAR_MONOLITH_SETUP_GUIDE.md** | Detailed modules setup | [link](./MODULAR_MONOLITH_SETUP_GUIDE.md) |
| **MODULE_MIGRATION_GUIDE.md** | Code migration steps | [link](./MODULE_MIGRATION_GUIDE.md) |
| **setup-modular-project.sh** | Automated setup script | [link](./setup-modular-project.sh) |

---

## ✅ Setup Checklist

- [ ] Run setup script OR create project manually
- [ ] Verify 14 modules created
- [ ] Configure .env for MAMP
- [ ] Run migrations
- [ ] Start development server
- [ ] Test: `php artisan route:list`
- [ ] Test: `curl http://localhost:8000/api/v2/health`
- [ ] Start migrating Auth module
- [ ] Commit to Git

---

## 🎯 What's Next?

After setup is complete, I can help you:

1. **Migrate Auth module first** - Foundation, everything depends on it
2. **Migrate Catalog module** - Products, categories, brands
3. **Migrate all modules** - Complete migration in batches
4. **Set up automated tests** - Ensure modular works same as monolith
5. **Deploy to staging** - Test on production-like environment

---

## ❓ Quick Questions

### Q: Will the modular version have all the same features?

**A**: YES! We're migrating ALL code from monolith to modular, just organizing it differently.

### Q: Can I use the same frontend (React Admin Panel)?

**A**: YES! Frontend calls APIs, doesn't care about backend structure. Just update API URL.

### Q: How long will migration take?

**A**:
- Setup: 30 minutes
- Auth module: 1 hour
- Each additional module: 30 min - 1 hour
- Total: ~15-20 hours (spread over 2-3 weeks)

### Q: Can I skip some modules?

**A**: YES! Don't use Wallet? Skip it. Don't need CRM? Skip it. Migrate only what you need.

---

## 🚀 Ready to Start?

**Run the setup script:**

```bash
cd /Applications/MAMP/htdocs/hooknhunt
chmod +x setup-modular-project.sh
./setup-modular-project.sh
```

**Then I'll help you migrate the first module!**

**Which module do you want to migrate first?**

1. **Auth** (recommended - foundation)
2. **Catalog** (products, categories)
3. **Settings** (easiest - good for testing)
4. **All modules** (I'll create batch migration script)

**Tell me your choice and let's get started!** 🎉
