# HOOK & HUNT FINANCE MODULE - USER MANUAL

---

## **PREFACE**

### **Welcome to the Finance Module**

**This module helps you manage ALL money-related tasks in your business.**

Think of it as your business's "money command center" where you can:
- See how much money you have
- Track where money comes from and where it goes
- Pay bills and get paid
- Plan budgets and check if you're following them
- Generate reports to understand your business finances
- Follow accounting rules properly

### **Who Should Use This Manual?**

**This manual is for:**
- Business owners who want to understand their finances
- Accountants and bookkeepers
- Finance managers
- Anyone who handles money transactions

**What you need to know before using this module:**
- Basic computer skills
- Understanding of your business
- No accounting degree required! (We explain everything)

### **How to Use This Manual**

**Read in order:**
1. Start with "Getting Started" (this section)
2. Read Chapters 1-8 (basic concepts and features)
3. Refer to Chapters 9-15 as needed (advanced features)
4. Use Chapters 16-23 for reference (reports, troubleshooting, etc.)

**Look for:**
- **Simple explanations** - We explain things in plain language
- **Examples** - Real business scenarios with step-by-step instructions
- **Tables** - Quick reference guides
- **Tips** - Helpful hints marked with 💡
- **Warnings** - Important things to watch out for marked with ⚠️

---

## **GETTING STARTED**

### **What is the Finance Module?**

**The Finance Module = Your complete business money management system**

It's like having a professional accountant on your computer, but you're in control. It handles:

| Task | What It Means | Why It Matters |
|------|---------------|----------------|
| **Bank Accounts** | Track all your bank accounts | Know your actual balance |
| **Transactions** | Record every money in/out | Never lose track of money |
| **Chart of Accounts** | Organize accounts properly | Follow accounting rules |
| **Expenses** | Track what you spend | Control costs |
| **Accounts Payable** | Money you owe to suppliers | Pay on time, avoid penalties |
| **Accounts Receivable** | Money others owe you | Collect payments faster |
| **Journal Entries** | Manual accounting entries | Fix mistakes, make adjustments |
| **Budgets** | Plan your spending | Stay on track financially |
| **Reports** | See your business health | Make smart decisions |

### **Accessing the Finance Module**

**URL:** `/finance`

**How to get there:**
1. Log in to Hook & Hunt Admin Panel
2. Click on "Finance" in the sidebar menu
3. You'll see the Finance Dashboard

**What you need:**
- User account with Finance permissions
- If you can't see Finance, ask your administrator

### **Navigation Overview**

The Finance module has these main sections:

```
┌─────────────────────────────────────────────┐
│              FINANCE MODULE                 │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Dashboard        → Overview of finances │
│  🏦 Bank Accounts    → Manage bank accounts │
│  💸 Transactions     → All money movements  │
│  📒 Chart of Accounts → Account categories  │
│  💰 Expenses         → Track spending       │
│  📤 Accounts Payable → Bills to pay         │
│  📥 Accounts Receivable → Money to collect  │
│  📝 Journal Entries  → Manual entries       │
│  📋 Budgets          → Spending plans       │
│  📄 Reports          → Financial reports    │
│                                             │
└─────────────────────────────────────────────┘
```

### **Before You Begin**

**Make sure you have:**

✅ **Bank account information**
- Bank names
- Account numbers
- Opening balances
- Account types (Savings, Current, etc.)

✅ **Basic business information**
- Business name and address
- Tax registration number (if applicable)
- Fiscal year start date

✅ **Chart of Accounts set up**
- If not, you can use the default accounts
- Or import from your accountant

✅ **User permissions**
- Make sure you have Finance module access
- Check with your administrator if needed

### **Understanding the Layout**

Every page in the Finance module has similar elements:

```
┌─────────────────────────────────────────────────────┐
│  Page Title                    [+ New] [Export] [⚙️] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔍 [Search box]     [Filter ▼]     [Sort ▼]       │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │ Data Table / Cards                        │    │
│  │                                            │    │
│  │  Item 1 | Details | Actions                │    │
│  │  Item 2 | Details | Actions                │    │
│  │  Item 3 | Details | Actions                │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ← Previous  1 2 3 ... 10  Next →                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Common elements:**
- **[+ New]** button - Create new item
- **[Search]** box - Find specific items
- **[Filter]** - Show only what you need
- **[Export]** - Download data (Excel, PDF)
- **[Actions]** - Edit, delete, view details

### **Important Tips Before You Start**

💡 **Start Simple**
1. Begin with Bank Accounts
2. Record current balances
3. Add transactions as they happen
4. Learn advanced features later

⚠️ **Data Accuracy Matters**
- Always enter correct amounts
- Double-check dates
- Verify account numbers
- Keep descriptions clear

💡 **Regular Tasks**
- Daily: Record transactions
- Weekly: Check bank balances
- Monthly: Reconcile accounts, run reports
- Yearly: Close fiscal year, generate annual reports

⚠️ **Backup Your Data**
- Regular backups are automatic
- But verify backups are working
- Export important reports regularly

### **Common Workflows**

**Everyday tasks:**
```
1. Start work → Check Dashboard for overview
2. Receive payment → Record in Accounts Receivable
3. Pay bill → Record in Accounts Payable
4. Make bank deposit → Add Transaction
5. End of day → Check cash position
```

**Weekly tasks:**
```
1. Review unpaid bills
2. Follow up on overdue payments
3. Check budget vs actual
4. Run quick reports
```

**Monthly tasks:**
```
1. Reconcile bank accounts
2. Review financial reports
3. Check budget performance
4. Prepare for next month
```

### **Getting Help**

**If you need help:**
- Read the relevant chapter in this manual
- Check the Glossary (Chapter 23) for terms
- See Troubleshooting (Chapter 21) for common problems
- Contact your system administrator
- Refer to Best Practices (Chapter 22)

---

## **CHAPTER 1: DASHBOARD**

### **URL:** `/finance/dashboard`

### **What is the Dashboard?**

**Dashboard = Your business financial health at a glance**

Think of it as:
> "A car dashboard that shows your speed, fuel, and warning lights"

The Finance Dashboard shows you the most important financial information in one place, so you can quickly understand your business's financial health.

### **Why Check the Dashboard Daily?**

**The dashboard helps you:**
- Know how much money you have right now
- See if you're making profit or loss
- Spot problems early (like overdue bills)
- Make quick decisions
- Plan ahead

**Real-world example:**
```
You arrive at office in the morning and check the dashboard:

💰 Total Bank Balance: ৳1,250,000
📥 Money to receive: ৳350,000 (from customers)
📤 Money to pay: ৳180,000 (to suppliers)
💸 This month's expenses: ৳450,000 so far
📊 Budget status: 70% used, 30% remaining

Quick understanding:
- After collecting payments: ৳1,250,000 + 350,000 = ৳1,600,000
- After paying bills: ৳1,600,000 - 180,000 = ৳1,420,000
- You have enough money to operate comfortably
- Budget is under control
```

### **What You See on the Dashboard**

The Dashboard is divided into several sections:

#### **Section 1: Summary Cards (Top)**

```
┌─────────────────────────────────────────────────────────┐
│  💰 TOTAL BALANCE          📥 TO RECEIVE   📤 TO PAY   │
│                                                         │
│  ৳ 1,250,000              ৳ 350,000       ৳ 180,000    │
│  (in all accounts)        (from customers) (to bills)  │
│                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  💸 EXPENSES THIS MONTH    📊 REVENUE      📈 PROFIT   │
│                                                         │
│  ৳ 450,000                ৳ 850,000       ৳ 400,000    │
│  (so far)                 (this month)    (this month) │
└─────────────────────────────────────────────────────────┘
```

**Understanding each card:**

| Card | What It Shows | Why It Matters |
|------|---------------|----------------|
| **Total Balance** | Money in all bank accounts | Know your cash position |
| **To Receive** | Money customers owe you | Plan collections |
| **To Pay** | Bills you need to pay | Plan payments |
| **Expenses** | Total spending this month | Control costs |
| **Revenue** | Total income this month | See sales performance |
| **Profit** | Revenue minus expenses | Know if you're making money |

#### **Section 2: Quick Charts**

```
┌───────────────────────────────────────────┐
│         Revenue vs Expenses (This Month)  │
│                                           │
│  Revenue  ████████████████████  ৳850,000  │
│  Expenses ██████████████        ৳450,000  │
│  Profit   ████████             ৳400,000   │
│                                           │
│  Good! Revenue is higher than expenses    │
└───────────────────────────────────────────┘
```

**What the chart tells you:**
- **Green/Positive** → Making profit
- **Red/Negative** → Making loss
- **Trend line** → Getting better or worse

#### **Section 3: Recent Activity**

```
┌────────────────────────────────────────────────────┐
│                 RECENT ACTIVITY                    │
├────────────────────────────────────────────────────┤
│ 📅 Today 3:45 PM                                   │
│    Received ৳50,000 from Customer - ABC Corp       │
│    Bank: Dutch-Bangla Bank → Account: Sales        │
├────────────────────────────────────────────────────┤
│ 📅 Today 2:15 PM                                   │
│    Paid ৳25,000 to Supplier - XYZ Suppliers Ltd    │
│    Bank: Dutch-Bangla Bank → Account: Rent         │
├────────────────────────────────────────────────────┤
│ 📅 Today 11:30 AM                                  │
│    Expense recorded: Office supplies - ৳8,500      │
│    Bank: Cash → Account: Office Expense           │
├────────────────────────────────────────────────────┤
│ 📅 Yesterday 5:00 PM                               │
│    New budget created: Marketing - Q1 2024         │
│    Amount: ৳300,000                                │
└────────────────────────────────────────────────────┘
```

**This shows:**
- Latest transactions
- Who paid you
- Who you paid
- Recent changes
- Helps you spot unusual activity

#### **Section 4: Upcoming Reminders**

```
┌────────────────────────────────────────────────────┐
│                 UPCOMING TASKS                     │
├────────────────────────────────────────────────────┤
│ ⚠️  3 bills due tomorrow (Total: ৳75,000)          │
│    - Rent: ৳25,000                                 │
│    - Electricity: ৳15,000                          │
│    - Internet: ৳5,000                              │
│                                                   │
│ 📋 Budget review due in 5 days                     │
│    (Monthly budget check)                          │
│                                                   │
│ 🔄 Bank reconciliation needed                      │
│    (City Bank Account)                             │
└────────────────────────────────────────────────────┘
```

**This helps you:**
- Never miss payments
- Stay on top of tasks
- Plan your week

### **Understanding Key Metrics**

#### **1. Cash Position**

**Cash = Total Balance + To Receive - To Pay**

```
Example:
Total in bank:      ৳1,250,000
Money coming in:    + ৳350,000
Money going out:    - ৳180,000
                              ──────────
Available cash:     ৳1,420,000
```

**Why this matters:**
- Know your true available cash
- Plan big purchases
- Avoid cash shortages

#### **2. Profit Margin**

**Profit Margin = (Profit ÷ Revenue) × 100**

```
Example:
Revenue:  ৳850,000
Profit:   ৳400,000

Profit Margin = (400,000 ÷ 850,000) × 100
              = 47%

Meaning: For every ৳100 in sales, you keep ৳47 as profit
```

**Is 47% good?**
- Depends on your industry
- Generally, 20-30% is good
- 40%+ is excellent
- Below 10% needs attention

#### **3. Budget Utilization**

**Budget Used = (Actual ÷ Budget) × 100**

```
Example:
Budgeted:  ৳100,000
Spent:      ৳70,000

Budget Used = (70,000 ÷ 100,000) × 100
            = 70%

Meaning: You've used 70% of your budget
You have 30% remaining for the rest of the month
```

### **What You Can Do from Dashboard**

#### **1. Quick Actions**

The dashboard has quick action buttons:

```
┌────────────────────────────────────────┐
│  [+ New Payment]  [+ Receive Payment]  │
│  [+ Record Expense] [+ New Bill]       │
│  [View Reports]    [Full Dashboard]    │
└────────────────────────────────────────┘
```

**What each does:**
- **[+ New Payment]** - Record a payment you made
- **[+ Receive Payment]** - Record money you received
- **[+ Record Expense]** - Add a new expense
- **[+ New Bill]** - Add a new bill to pay later
- **[View Reports]** - Go to financial reports
- **[Full Dashboard]** - See more detailed view

#### **2. Click to Details**

**Click any card to see details:**

- Click "Total Balance" → See all bank accounts
- Click "To Receive" → See accounts receivable
- Click "To Pay" → See accounts payable
- Click "Expenses" → See expense breakdown

#### **3. Change Date Range**

```
[Today ▼] [This Week ▼] [This Month ▼] [This Year ▼]
```

**Why use different ranges:**
- **Today** - See daily operations
- **This Week** - Plan weekly activities
- **This Month** - Monthly performance
- **This Year** - Yearly overview

### **Dashboard Scenarios**

#### **Scenario 1: Good Financial Health**

```
What you see:
💰 Total Balance: ৳2,500,000
📥 To Receive: ৳200,000
📤 To Pay: ৳100,000
📈 Profit: +৳500,000
📊 Budget: 60% used

What it means:
✅ Strong cash position
✅ Collecting more than paying
✅ Making good profit
✅ Budget under control

What to do:
✅ Keep doing what you're doing
✅ Consider investing extra cash
✅ Plan for growth
```

#### **Scenario 2: Need Attention**

```
What you see:
💰 Total Balance: ৳200,000
📥 To Receive: ৳500,000
📤 To Pay: ৳400,000
📈 Profit: -৳50,000 (loss!)
📊 Budget: 95% used (almost over!)

What it means:
⚠️ Low cash balance
⚠️ Need to collect payments fast
⚠️ Losing money this month
⚠️ Budget almost exhausted

What to do:
🔴 Call customers for payments
🔴 Cut unnecessary expenses
🔴 Review why you're losing money
🔴 Adjust budget or get approval for more
```

### **Dashboard Best Practices**

💡 **Check every morning**
- Start your day by reviewing the dashboard
- Spot problems early
- Plan your day

💡 **Watch for trends**
- Is profit going up or down?
- Are expenses increasing?
- Compare with last month

💡 **Use it for decisions**
- Before making big purchases
- Before hiring new staff
- Before expanding

⚠️ **Don't ignore warnings**
- Red numbers need attention
- Overdue tasks should be addressed
- Negative trends need investigation

---

## **CHAPTER 2: BANK ACCOUNTS**

### **URL:** `/finance/bank-accounts`

### **What are Bank Accounts?**

**Bank Account = Where your business money is stored**

Think of it as:
> "Digital wallet for your business money"

**Real-world examples:**
- Dutch-Bangla Bank Current Account
- City Bank Savings Account
- Brac Bank Account for online payments
- Cash box (hand cash)

### **Why Track Bank Accounts in the System?**

**Benefits:**
- Know exact balance in each account
- Stop guessing how much money you have
- Track all deposits and withdrawals
- Reconcile with bank statements
- Make better decisions about which account to use

**Without tracking:**
❌ You might think you have money but don't
❌ Overdraw accounts and pay penalties
❌ Lose track of transfers between accounts
❌ Can't match with bank statements
❌ Make wrong business decisions

### **What You See**

The Bank Accounts page shows all your accounts in one place:

```
┌────────────────────────────────────────────────────────────────┐
│  🏦 BANK ACCOUNTS                        [+ Add Bank Account]  │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search accounts...]    [Filter: All ▼]    [Export ↓]     │
├──────┬──────────────┬──────────────┬────────────┬──────────────┤
│ Bank │ Account Name │ Account No   │   Balance  │   Status     │
├──────┼──────────────┼──────────────┼────────────┼──────────────┤
│ 🏛️  │ Current      │ 1234567890   │ ৳850,000   │    Active    │
│ DBBL │              │              │            │              │
├──────┼──────────────┼──────────────┼────────────┼──────────────┤
│ 🏛️  │ Salary       │ 9876543210   │ ৳320,000   │    Active    │
│ City │ Account      │              │            │              │
│ Bank │              │              │            │              │
├──────┼──────────────┼──────────────┼────────────┼──────────────┤
│ 🏛️  │ Online Sales │ 5555666677   │ ৳180,000   │    Active    │
│ Brac │ Account      │              │            │              │
├──────┼──────────────┼──────────────┼────────────┼──────────────┤
│ 💵   │ Cash Box     │ N/A          │ ৳45,000    │    Active    │
├──────┴──────────────┴──────────────┴────────────┴──────────────┤
│                     Total: ৳1,395,000                         │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Bank Account Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Bank Name** | Which bank? | Dutch-Bangla Bank |
| **Account Name** | What do you call it? | "Current Account" or "Main Account" |
| **Account Number** | Bank's account number | 1234567890 |
| **Account Type** | Savings, Current, etc. | Current Account |
| **Balance** | Current money in account | ৳850,000 |
| **Currency** | Which currency? | BDT (৳), USD ($) |
| **Status** | Active or Inactive | Active (in use) |

### **Account Types Explained**

| Type | When to Use | Features |
|------|-------------|----------|
| **Current Account** | Daily business transactions | No interest, unlimited withdrawals |
| **Savings Account** | Store money not used often | Earns interest, limited withdrawals |
| **Fixed Deposit** | Lock money for fixed time | Higher interest, can't withdraw early |
| **Cash** | Physical cash hand | Small expenses, petty cash |

### **What You Can Do**

#### **1. Add New Bank Account**

**When to add:**
- Opened a new bank account
- Want to track cash box
- Started using new payment service (bKash, Nagad, etc.)

**Step-by-Step:**

1. Click **[+ Add Bank Account]** button
2. Fill in the form:

```
┌────────────────────────────────────────────┐
│          ADD BANK ACCOUNT                  │
├────────────────────────────────────────────┤
│ Bank Name: [Select from list ▼]            │
│ Options:                                   │
│  • Dutch-Bangla Bank (DBBL)                │
│  • City Bank                               │
│  • Brac Bank                               │
│  • Eastern Bank                            │
│  • Other (enter manually)                  │
│                                            │
│ Account Name: _____________________        │
│ (e.g., "Current Account" or "Main A/C")    │
│                                            │
│ Account Number: _____________________      │
│ (Enter exact bank account number)          │
│                                            │
│ Account Type: [Select ▼]                   │
│  • Current Account                         │
│  • Savings Account                         │
│  • Fixed Deposit                           │
│  • Cash                                    │
│                                            │
│ Currency: [Select ▼]                       │
│  • BDT (৳)                                │
│  • USD ($)                                 │
│  • EUR (€)                                 │
│                                            │
│ Opening Balance: ৳ ___________________      │
│ (Current balance in this account)          │
│                                            │
│ Branch: _____________________              │
│ (Optional - Bank branch name)              │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Save Account]      │
└────────────────────────────────────────────┘
```

**Example 1: Adding Current Account**

```
Scenario: You just opened a DBBL Current Account

Step-by-Step:

1. Bank Name: Select "Dutch-Bangla Bank (DBBL)"
2. Account Name: "Current Account"
3. Account Number: 1234567890
4. Account Type: Select "Current Account"
5. Currency: Select "BDT (৳)"
6. Opening Balance: 500000 (your initial deposit)
7. Branch: "Gulshan Branch"
8. Is Active: Check the box
9. Click "Save Account"

Result:
✅ Account added to system
✅ Initial balance recorded as opening entry
✅ Ready to use for transactions
```

**Example 2: Adding Cash Box**

```
Scenario: Track petty cash in the office

Step-by-Step:

1. Bank Name: Select "Other" and type "Cash"
2. Account Name: "Petty Cash"
3. Account Number: Leave blank or type "N/A"
4. Account Type: Select "Cash"
5. Currency: Select "BDT (৳)"
6. Opening Balance: 50000 (count the cash)
7. Branch: Leave blank
8. Is Active: Check the box
9. Click "Save Account"

Result:
✅ Cash box tracked in system
✅ Can record cash expenses
✅ Easy to reconcile
```

**Example 3: Adding bKash Account**

```
Scenario: Track bKash merchant account

Step-by-Step:

1. Bank Name: Select "Other" and type "bKash"
2. Account Name: "Merchant Account"
3. Account Number: 01712345678
4. Account Type: Select "Current Account"
5. Currency: Select "BDT (৳)"
6. Opening Balance: 25000 (current balance)
7. Branch: Leave blank
8. Is Active: Check the box
9. Click "Save Account"

Result:
✅ Mobile financial service tracked
✅ Can record bKash transactions
✅ Reconcile with bKash statement
```

#### **2. View Account Details**

Click any account to see detailed information:

```
┌────────────────────────────────────────────┐
│  DUTCH-BANGLA BANK - CURRENT ACCOUNT       │
├────────────────────────────────────────────┤
│ Account Number: 1234567890                 │
│ Account Type: Current Account              │
│ Currency: BDT (৳)                         │
│ Branch: Gulshan Branch                     │
│                                            │
│ Current Balance: ৳850,000                  │
│ Status: Active                             │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│ Recent Transactions:                       │
│ 📅 15 Jan 2024 | Deposit | ৳100,000        │
│ 📅 14 Jan 2024 | Withdrawal | ৳50,000      │
│ 📅 12 Jan 2024 | Transfer from Brac | ৳75K │
│                                            │
│ [View All Transactions] [Edit] [Close]    │
└────────────────────────────────────────────┘
```

#### **3. Edit Bank Account**

**When to edit:**
- Account name change
- Branch change
- Account status change (active → inactive)
- Currency update

**How to edit:**
1. Click the account you want to edit
2. Click **[Edit]** button
3. Make changes
4. Click **[Save Account]**

⚠️ **Warning:** You cannot change account number after creation. If wrong, delete and recreate.

#### **4. Deactivate Bank Account**

**When to deactivate:**
- Account closed
- No longer using that account
- Bank merged or changed

**How to deactivate:**
1. Click the account
2. Click **[Edit]**
3. Uncheck **"Is Active"**
4. Click **[Save Account]**

**What happens:**
- Account shows as "Inactive"
- Removed from totals
- Old transactions still visible
- Can reactivate anytime by checking "Is Active" again

#### **5. Delete Bank Account**

⚠️ **BE VERY CAREFUL WITH DELETE!**

**When you can delete:**
- Just created, made mistake
- No transactions recorded

**When you CANNOT delete:**
- Has transactions (system will prevent)
- Was used in the past

**Better option:** Make inactive instead of deleting

### **Bank Account Best Practices**

💡 **Keep Accounts Updated**
- Check balances regularly
- Update when balance changes significantly
- Reconcile with bank statements monthly

💡 **Use Clear Names**
- "Current Account" is better than "A/C 1"
- "Salary Account" is better than "City Bank"
- "Petty Cash" is better than "Cash"

💡 **Track All Money**
- Every bank account should be in system
- Including mobile financial services (bKash, Nagad)
- Don't forget cash boxes

⚠️ **Security**
- Bank account numbers are sensitive
- Only authorized staff should access
- Regular audits

💡 **Organization**
- Group similar accounts
- Use one account for main operations
- Keep separate accounts for specific purposes

### **Common Scenarios**

#### **Scenario 1: Multiple Accounts**

```
You have:
- DBBL Current Account (main operations)
- City Bank Salary Account (staff salaries)
- Brac Bank Online Account (e-commerce)
- bKash Merchant (mobile payments)
- Petty Cash (small expenses)

Why separate accounts?
✅ Better tracking
✅ Easy reconciliation
✅ Clear purpose for each
✅ Better control
```

#### **Scenario 2: Transferring Money Between Accounts**

```
Transfer ৳100,000 from DBBL to Brac Bank:

This is done in Transactions (Chapter 3), not here.
Bank Accounts is just for viewing and managing accounts.

The actual money transfer is recorded as a transaction.
```

#### **Scenario 3: Closing an Account**

```
You want to close City Bank Salary Account:

Step 1: Transfer all money out (record as Transaction)
Step 2: Wait for bank to close
Step 3: In system, edit account
Step 4: Uncheck "Is Active"
Step 5: Save

Result:
✅ Account marked inactive
✅ History preserved
✅ Removed from active totals
```

---

## **CHAPTER 3: TRANSACTIONS**

### **URL:** `/finance/transactions`

### **What are Transactions?**

**Transaction = Any money movement in or out of your accounts**

Think of it as:
> "Every time money moves, it's a transaction"

**Real-world examples:**
- Customer pays you ৳50,000 → Transaction
- You pay rent ৳25,000 → Transaction
- Transfer money between banks → Transaction
- Withdraw cash from bank → Transaction

### **Why Record Every Transaction?**

**Benefits:**
- Complete money trail
- Know exactly where money went
- Match with bank statements
- Tax compliance
- Business insights

**Without recording:**
❌ No idea where money went
❌ Can't balance accounts
❌ Tax problems
❌ Business decisions based on guesses

### **Types of Transactions**

| Type | Direction | What It Means | Example |
|------|-----------|---------------|---------|
| **Income** | Money IN | Customer paid you | Received ৳50,000 from ABC Corp |
| **Expense** | Money OUT | You paid someone | Paid ৳25,000 rent |
| **Transfer** | Both ways | Money between accounts | Transferred ৳100,000 DBBL → Brac |
| **Deposit** | Money IN | Added money to account | Deposited ৳200,000 cash to bank |
| **Withdrawal** | Money OUT | Took money out | Withdrew ৳50,000 from ATM |

### **What You See**

The Transactions page shows all money movements:

```
┌────────────────────────────────────────────────────────────────┐
│  💸 TRANSACTIONS                            [+ Add Transaction] │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Date: This Month ▼] [Type: All ▼] [Export]   │
├──────┬──────────┬───────────────┬────────────┬──────────────┤
│ Date │ Type     │ Description   │    Amount  │   Account    │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│15Jan │ Income   │ ABC Corp Pay  │ + ৳50,000  │  DBBL Curr.  │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│15Jan │ Expense  │ Office Rent   │ - ৳25,000  │  DBBL Curr.  │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│14Jan │ Transfer │ To Brac Bank  │ - ৳100,000 │  DBBL Curr.  │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│14Jan │ Transfer │ From DBBL     │ + ৳100,000 │  Brac Bank   │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│13Jan │ Deposit  │ Cash Deposit  │ + ৳75,000  │  DBBL Curr.  │
├──────┼──────────┼───────────────┼────────────┼──────────────┤
│13Jan │ Withdraw │ Cash Withdrawn │ - ৳20,000 │  DBBL Curr.  │
├──────┴──────────┴───────────────┴────────────┴──────────────┤
│                     Net: + ৳80,000 This Month                 │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Transaction Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Date** | When transaction happened | 15 Jan 2024 |
| **Type** | Income, Expense, Transfer, etc. | Income |
| **Description** | What was it for? | "ABC Corp Payment - Invoice #123" |
| **Amount** | How much money? | ৳50,000 |
| **Account** | Which bank account? | DBBL Current |
| **Category** | Which expense/income category? | Sales Revenue, Rent, etc. |
| **Reference** | Invoice/check number | INV-123, CHK-456 |

### **What You Can Do**

#### **1. Add New Transaction**

**URL:** `/finance/transactions/create`

**When to add:**
- Received money from customer
- Paid a bill
- Transferred between accounts
- Any money movement

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD TRANSACTION                   │
├────────────────────────────────────────────┤
│ Transaction Type: [Select ▼]               │
│  • Income (money coming in)                │
│  • Expense (money going out)               │
│  • Transfer (between accounts)             │
│  • Deposit (add to account)                │
│  • Withdrawal (take from account)          │
│                                            │
│ Date: __/__/____                           │
│ (When did this happen?)                    │
│                                            │
│ Account: [Select Account ▼]                │
│  • DBBL Current Account - ৳850,000         │
│  • City Bank Salary - ৳320,000             │
│  • Brac Bank Online - ৳180,000             │
│  • Petty Cash - ৳45,000                    │
│                                            │
│ Amount: ৳ ___________________               │
│ (How much?)                                │
│                                            │
│ Category: [Select ▼]                       │
│  • Sales Revenue                           │
│  • Rent Expense                            │
│  • Salary Expense                          │
│  • Utility Expense                         │
│  • Marketing Expense                       │
│  • Other                                   │
│                                            │
│ Description: _____________________         │
│ (Details about this transaction)           │
│                                            │
│ Reference: _____________________           │
│ (Optional - Invoice/Check number)          │
│                                            │
│ Attachments: [Choose File]                 │
│ (Optional - Receipt, invoice, etc.)        │
│                                            │
│              [Cancel]  [Save Transaction]  │
└────────────────────────────────────────────┘
```

**Example 1: Recording Income**

```
Scenario: ABC Corp paid you ৳50,000 for Invoice #1234

Step-by-Step:

1. Transaction Type: Select "Income"
2. Date: 15/01/2024
3. Account: Select "DBBL Current Account"
4. Amount: 50000
5. Category: Select "Sales Revenue"
6. Description: "Payment from ABC Corp - Invoice #1234"
7. Reference: INV-1234
8. Attachments: Upload payment receipt (optional)
9. Click "Save Transaction"

Result:
✅ Transaction recorded
✅ Account balance updated (+ ৳50,000)
✅ Ready to match with bank statement
```

**Example 2: Recording Expense**

```
Scenario: Paid office rent ৳25,000 by check

Step-by-Step:

1. Transaction Type: Select "Expense"
2. Date: 15/01/2024
3. Account: Select "DBBL Current Account"
4. Amount: 25000
5. Category: Select "Rent Expense"
6. Description: "Office rent for January 2024"
7. Reference: CHK-789
8. Attachments: Upload rent receipt (optional)
9. Click "Save Transaction"

Result:
✅ Transaction recorded
✅ Account balance updated (- ৳25,000)
✅ Expense tracked for reports
```

**Example 3: Transfer Between Accounts**

```
Scenario: Transfer ৳100,000 from DBBL to Brac Bank

Step-by-Step:

1. Transaction Type: Select "Transfer"
2. Date: 14/01/2024
3. From Account: Select "DBBL Current Account"
4. To Account: Select "Brac Bank Online"
5. Amount: 100000
6. Description: "Transfer for online payments"
7. Reference: TRF-001
8. Click "Save Transaction"

Result:
✅ TWO transactions created automatically:
   - DBBL: - ৳100,000
   - Brac: + ৳100,000
✅ Both accounts updated
✅ Clear money trail
```

**Example 4: Cash Deposit**

```
Scenario: Deposited ৳75,000 cash to bank

Step-by-Step:

1. Transaction Type: Select "Deposit"
2. Date: 13/01/2024
3. Account: Select "DBBL Current Account"
4. Amount: 75000
5. Description: "Cash deposit from sales"
6. Reference: DP-123
7. Click "Save Transaction"

Result:
✅ Transaction recorded
✅ Account balance increased (+ ৳75,000)
✅ Cash tracked
```

#### **2. View Transaction Details**

Click any transaction to see details:

```
┌────────────────────────────────────────────┐
│  TRANSACTION DETAILS                       │
├────────────────────────────────────────────┤
│ Type: Income                               │
│ Date: 15 January 2024                      │
│ Account: DBBL Current Account              │
│                                            │
│ Amount: ৳50,000                            │
│ Category: Sales Revenue                    │
│                                            │
│ Description:                               │
│ Payment from ABC Corp for services         │
│ Invoice #1234 for January billing          │
│                                            │
│ Reference: INV-1234                        │
│ Created by: Admin User                     │
│ Created at: 15/01/2024 3:45 PM            │
│                                            │
│ Attachments:                               │
│ 📄 Payment_Receipt_ABC_Corp.pdf            │
│                                            │
│ [Edit] [Delete] [Print] [Close]            │
└────────────────────────────────────────────┘
```

#### **3. Edit Transaction**

**When to edit:**
- Wrong amount entered
- Wrong category selected
- Description needs updating
- Date correction

**How to edit:**
1. Click the transaction
2. Click **[Edit]**
3. Make changes
4. Click **[Save Transaction]**

⚠️ **Warning:** Editing changes account balances. Be careful!

#### **4. Delete Transaction**

⚠️ **BE VERY CAREFUL!**

**When you can delete:**
- Just created, made mistake
- Duplicate entry

**When you should NOT delete:**
- Old transactions (make correcting entry instead)
- Already reconciled

**How to delete:**
1. Click the transaction
2. Click **[Delete]**
3. Confirm deletion

💡 **Better approach for old mistakes:** Make a correcting journal entry instead of deleting.

#### **5. Search and Filter**

**Search:** Find specific transaction
```
Type: "ABC Corp"
Shows all transactions with "ABC Corp" in description
```

**Filter by Date:**
```
[Today] [This Week] [This Month] [This Year] [Custom Range]
```

**Filter by Type:**
```
[All] [Income Only] [Expense Only] [Transfers Only]
```

**Filter by Account:**
```
[All Accounts] [DBBL Current] [City Bank] [Cash Only]
```

**Filter by Category:**
```
[All Categories] [Sales] [Rent] [Salary] [Marketing]
```

### **Transaction Best Practices**

💡 **Record Immediately**
- Don't wait until end of day
- Record as soon as money moves
- More accurate, less forgetting

💡 **Use Clear Descriptions**
- Bad: "Payment"
- Good: "Payment from ABC Corp - INV#1234"
- Bad: "Expense"
- Good: "Office rent - January 2024"

💡 **Attach Documents**
- Scan receipts
- Save invoices
- Upload bank statements
- Proof for audits

💡 **Use References**
- Invoice numbers
- Check numbers
- Transaction IDs
- Easy to find later

⚠️ **Never Delete Old Transactions**
- Creates gaps in records
- Tax problems
- Audit issues
- Make correcting entry instead

💡 **Reconcile Regularly**
- Match with bank statements
- Fix discrepancies immediately
- Monthly minimum

### **Common Scenarios**

#### **Scenario 1: Recording Daily Sales**

```
End of day cash sales: ৳15,000

Option 1: Record as one transaction
✅ Faster
✅ Good for small amounts

Option 2: Record each sale separately
✅ Detailed
✅ Better for analysis
❌ Time-consuming

Recommendation: One daily transaction for cash sales
```

#### **Scenario 2: Customer Pays Multiple Invoices**

```
ABC Corp pays ৳150,000 for 3 invoices (#100, #101, #102)

How to record:

Option 1: One transaction
Description: "Payment for INV#100, #101, #102"
Reference: INV#100,101,102
✅ Simpler

Option 2: Three separate transactions
✅ Matches each invoice
❌ More work

Recommendation: One transaction with all invoice numbers
```

#### **Scenario 3: Found a Mistake in Old Transaction**

```
You recorded ৳50,000 but should have been ৳5,000

WRONG way:
Delete the old transaction
❌ Creates gap in records
❌ Reconciliation breaks

CORRECT way:
Make a correcting journal entry (Chapter 8)
✅ Preserves history
✅ Audit trail intact
✅ Proper accounting practice
```

---

## **CHAPTER 4: CHART OF ACCOUNTS**

### **URL:** `/finance/chart-of-accounts`

### **What is the Chart of Accounts?**

**Chart of Accounts = A list of all categories you use to organize money**

Think of it as:
> "A filing system for your business finances"

**Simple example:**
Just like you have folders for:
- Documents
- Pictures
- Music

You have account categories for:
- Sales Revenue (money coming in from sales)
- Rent Expense (money spent on rent)
- Salary Expense (money spent on salaries)
- Bank Account (where money is kept)

### **Why Do You Need a Chart of Accounts?**

**Benefits:**
- Organized financial records
- Proper accounting reports
- Tax compliance
- Business insights
- Easy to find transactions

**Without it:**
❌ Messy records
❌ Can't generate proper reports
❌ Tax problems
❌ No idea where money is going

### **Account Categories Explained**

**The Chart of Accounts has 5 main types:**

| Type | What It Means | Normal Balance | Examples |
|------|---------------|----------------|----------|
| **Assets** | Things you own | Debit (+) | Cash, Bank, Inventory, Equipment |
| **Liabilities** | Things you owe | Credit (-) | Loans, Accounts Payable, Taxes Payable |
| **Equity** | Owner's investment | Credit (-) | Owner's Capital, Retained Earnings |
| **Income** | Money earned | Credit (-) | Sales Revenue, Service Income, Interest |
| **Expenses** | Money spent | Debit (+) | Rent, Salaries, Utilities, Marketing |

**Simple rule to remember:**
- **Assets & Expenses** = Normal Debit Balance
- **Liabilities, Equity & Income** = Normal Credit Balance

### **Account Hierarchy**

Accounts are organized in levels:

```
Level 1 (Category):     Assets
  Level 2 (Sub):        Current Assets
    Level 3 (Account):      Cash
    Level 3 (Account):      Bank Accounts
    Level 3 (Account):      Accounts Receivable
```

**Why hierarchy matters:**
- Better organization
- Grouped reporting
- Easy to find accounts
- Professional financial statements

### **What You See**

The Chart of Accounts page shows all your accounts:

```
┌────────────────────────────────────────────────────────────────┐
│  📒 CHART OF ACCOUNTS                     [+ Add Account]      │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Type: All ▼] [Show Inactive ☐] [Export]     │
├──────────┬──────────────────┬───────────┬────────┬────────────┤
│   Code   │ Account Name     │   Type    │ Balance│   Status   │
├──────────┼──────────────────┼───────────┼────────┼────────────┤
│ 1000     │ ASSETS           │ Category  │        │   Active   │
│  1100    │  Current Assets  │ Sub       │        │   Active   │
│   1101   │   Cash           │ Account   │ ৳45,000│   Active   │
│   1102   │   Bank Accounts  │ Account   │৳850,000│   Active   │
│   1103   │   Accounts Rec.  │ Account   │৳350,000│   Active   │
│  1200    │  Fixed Assets    │ Sub       │        │   Active   │
│   1201   │   Equipment      │ Account   │৳250,000│   Active   │
│   1202   │   Vehicles       │ Account   │৳800,000│   Active   │
├──────────┼──────────────────┼───────────┼────────┼────────────┤
│ 2000     │ LIABILITIES      │ Category  │        │   Active   │
│  2100    │  Current Liab.   │ Sub       │        │   Active   │
│   2101   │   Accounts Pay.  │ Account   │৳180,000│   Active   │
│   2102   │   Loans          │ Account   │৳500,000│   Active   │
├──────────┼──────────────────┼───────────┼────────┼────────────┤
│ 3000     │ INCOME           │ Category  │        │   Active   │
│  3100    │  Operating Inc.  │ Sub       │        │   Active   │
│   3101   │   Sales Revenue  │ Account   │৳1,200K │   Active   │
│   3102   │   Service Income │ Account   │ ৳75,000│   Active   │
├──────────┼──────────────────┼───────────┼────────┼────────────┤
│ 4000     │ EXPENSES         │ Category  │        │   Active   │
│  4100    │  Operating Exp.  │ Sub       │        │   Active   │
│   4101   │   Rent Expense   │ Account   │ ৳25,000│   Active   │
│   4102   │   Salary Exp.    │ Account   │ ৳500K  │   Active   │
│   4103   │   Utility Exp.   │ Account   │ ৳15,000│   Active   │
│   4104   │   Marketing Exp. │ Account   │ ৳100K  │   Active   │
└──────────┴──────────────────┴───────────┴────────┴────────────┘
```

### **Understanding Account Codes**

**Account codes help organize:**

| Code Range | Type | Examples |
|------------|------|----------|
| 1000-1999 | Assets | 1000 Assets, 1100 Current Assets |
| 2000-2999 | Liabilities | 2000 Liabilities, 2100 Current Liabilities |
| 3000-3999 | Equity | 3000 Equity, 3100 Owner's Capital |
| 4000-4999 | Income | 4000 Income, 4100 Sales Revenue |
| 5000-5999 | Expenses | 5000 Expenses, 5100 Operating Expenses |

**Why use codes:**
- Easy to identify account type
- Sorting makes sense
- Professional standard
- Quick reference

### **Default Chart of Accounts**

The system comes with a standard Chart of Accounts:

**Assets (1000)**
- Cash (1101)
- Bank Accounts (1102)
- Accounts Receivable (1103)
- Inventory (1104)
- Fixed Assets (1201)

**Liabilities (2000)**
- Accounts Payable (2101)
- Loans (2102)
- Tax Payable (2103)

**Income (3000)**
- Sales Revenue (3101)
- Service Income (3102)
- Other Income (3103)

**Expenses (4000)**
- Cost of Goods Sold (4101)
- Rent Expense (4102)
- Salary Expense (4103)
- Utility Expense (4104)
- Marketing Expense (4105)
- Other Expenses (4199)

### **What You Can Do**

#### **1. Add New Account**

**When to add:**
- Need new expense category
- New income source
- Specific tracking requirement

**Step-by-Step:**

1. Click **[+ Add Account]** button
2. Fill in the form:

```
┌────────────────────────────────────────────┐
│          ADD ACCOUNT                       │
├────────────────────────────────────────────┤
│ Account Code: ________                     │
│ (e.g., 4106 for new expense account)       │
│                                            │
│ Account Name: _____________________        │
│ (e.g., "Travel Expense")                   │
│                                            │
│ Account Type: [Select ▼]                   │
│  • Asset                                   │
│  • Liability                               │
│  • Equity                                  │
│  • Income                                  │
│  • Expense                                 │
│                                            │
│ Parent Account: [Select ▼]                 │
│  • None (Top Level)                        │
│  • Assets                                  │
│  • Current Assets                          │
│  • Operating Expenses                      │
│                                            │
│ Description: _____________________         │
│ (Optional - What is this account for?)     │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Save Account]      │
└────────────────────────────────────────────┘
```

**Example 1: Adding Travel Expense Account**

```
Scenario: Want to track travel expenses separately

Step-by-Step:

1. Account Code: 4106 (next in expense series)
2. Account Name: "Travel Expense"
3. Account Type: Select "Expense"
4. Parent Account: Select "Operating Expenses"
5. Description: "Travel, accommodation, and transport expenses"
6. Is Active: Check the box
7. Click "Save Account"

Result:
✅ New expense account created
✅ Appears under Operating Expenses
✅ Can select when recording travel expenses
✅ Shows separately in reports
```

**Example 2: Adding Income Account**

```
Scenario: Started consulting services, want to track separately

Step-by-Step:

1. Account Code: 3103
2. Account Name: "Consulting Income"
3. Account Type: Select "Income"
4. Parent Account: Select "Operating Income"
5. Description: "Income from consulting services"
6. Is Active: Check the box
7. Click "Save Account"

Result:
✅ New income account created
✅ Consulting income tracked separately from sales
✅ Better business insights
```

#### **2. View Account Details**

Click any account to see:

```
┌────────────────────────────────────────────┐
│  ACCOUNT DETAILS                           │
├────────────────────────────────────────────┤
│ Code: 4102                                 │
│ Name: Salary Expense                       │
│ Type: Expense                              │
│ Parent: Operating Expenses                 │
│                                            │
│ Current Balance: ৳500,000                  │
│ (Total this year)                          │
│                                            │
│ Transactions: 25 entries                   │
│ Last transaction: 15/01/2024               │
│                                            │
│ Description:                               │
│ Staff salaries, wages, and benefits        │
│                                            │
│ [Edit] [Make Inactive] [View Transactions] │
└────────────────────────────────────────────┘
```

#### **3. Edit Account**

**When to edit:**
- Name change
- Description update
- Move to different parent

**How to edit:**
1. Click the account
2. Click **[Edit]**
3. Make changes
4. Click **[Save Account]**

⚠️ **Warning:** Don't change Account Type after transactions recorded. It can mess up reports.

#### **4. Make Account Inactive**

**When to make inactive:**
- No longer using that account
- Business change
- Account replaced

**How to make inactive:**
1. Click the account
2. Click **[Make Inactive]**
3. Confirm

**What happens:**
- Account marked "Inactive"
- Removed from dropdowns
- Old transactions preserved
- Can reactivate anytime

⚠️ **Don't delete accounts with transactions!** Make inactive instead.

### **Chart of Accounts Best Practices**

💡 **Keep It Simple**
- Don't create too many accounts
- Group similar items
- Start with default accounts
- Add only what you need

💡 **Use Clear Names**
- "Salary Expense" not "Sal"
- "Rent Expense" not "Rent"
- Complete, descriptive names

💡 **Follow Standard Coding**
- Use code ranges suggested
- Leave gaps for future accounts
- Keep logical order

💡 **Don't Change Often**
- Once set, try not to change
- Creates confusion in reports
- Hard to compare year to year

⚠️ **Consult Accountant**
- Before major changes
- For custom accounts
- Tax implications

### **Common Scenarios**

#### **Scenario 1: Organizing by Department**

```
You want to track expenses by department:

Option 1: Create separate accounts
- Salary Expense - Sales
- Salary Expense - Marketing
- Salary Expense - Admin
✅ Detailed tracking
❌ Many accounts

Option 2: Use categories/tags (better)
- Keep one Salary Expense account
- Use department tags in transactions
✅ Simpler
✅ Flexible reporting
```

#### **Scenario 2: Too Many Accounts**

```
You have 50+ expense accounts. It's confusing.

Solution: Consolidate
- Combine similar accounts
- Use descriptions for details
- Simplify chart of accounts
```

#### **Scenario 3: Need Custom Account**

```
You have unique business need for specific tracking.

Example: Restaurant wants "Food Waste Expense"

1. Add account: 5199 - Food Waste Expense
2. Use when recording waste
3. Track separately
4. Can reduce waste by monitoring

✅ Custom account solves specific need
```

---

## **CHAPTER 5: CURRENCIES & EXCHANGE RATES**

### **URL:** `/finance/currencies`

### **What are Currencies?**

**Currency = The type of money you use (Bangladeshi Taka, US Dollar, Euro, etc.)**

Think of it as:
> "Different countries use different money"

**Real-world examples:**
- **BDT (৳)** - Bangladeshi Taka - Used in Bangladesh
- **USD ($)** - US Dollar - Used in USA and international trade
- **EUR (€)** - Euro - Used in European Union
- **GBP (£)** - British Pound - Used in UK
- **SAR (﷼)** - Saudi Riyal - Used in Saudi Arabia

### **Why Manage Multiple Currencies?**

**Benefits:**
- Handle international business
- Record foreign transactions accurately
- Track exchange rate changes
- Report in your base currency
- Manage multi-currency bank accounts

**Without multi-currency:**
❌ Can't record foreign transactions properly
❌ Exchange rate losses/gains not tracked
❌ Inaccurate financial reports
❌ Can't do business internationally

### **Base Currency vs. Foreign Currency**

| Type | What It Means | Example |
|------|---------------|---------|
| **Base Currency** | Your main business currency | BDT (৳) for Bangladesh |
| **Foreign Currency** | Other currencies you use | USD ($), EUR (€) |
| **Exchange Rate** | How much one currency is worth | 1 USD = 110 BDT |

**Example:**
```
Your business is in Bangladesh, so your base currency is BDT (৳)
You buy goods from USA priced in USD ($)

Base Currency: BDT (৳) - All reports show in BDT
Foreign Currency: USD ($) - Some transactions in USD
Exchange Rate: 1 USD = 110 BDT (example)

When you record a $1,000 purchase:
- Amount in USD: $1,000
- Amount in BDT: ৳110,000 (using exchange rate)
- Both amounts recorded for tracking
```

### **What You See**

The Currencies page shows all your configured currencies:

```
┌────────────────────────────────────────────────────────────────┐
│  💱 CURRENCIES                              [+ Add Currency]    │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Active: All ▼] [Export]                     │
├────────┬──────────────┬──────────┬─────────────┬──────────────┤
│  Code  │   Name       │  Symbol  │Exch. Rate  │   Status     │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  BDT   │ Bangladeshi  │   ৳     │   1.00      │  Default ✓   │
│        │ Taka         │          │  (Base)     │    Active    │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  USD   │ US Dollar    │   $      │  110.50     │    Active    │
│        │              │          │  per 1 USD  │              │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  EUR   │ Euro         │   €      │  120.75     │    Active    │
│        │              │          │  per 1 EUR  │              │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  GBP   │ British      │   £      │  140.25     │    Active    │
│        │ Pound        │          │  per 1 GBP  │              │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  SAR   │ Saudi        │  ﷼       │   29.45     │    Active    │
│        │ Riyal        │          │  per 1 SAR  │              │
├────────┼──────────────┼──────────┼─────────────┼──────────────┤
│  INR   │ Indian Rupee │  ₹       │    1.32     │  Inactive    │
│        │              │          │  per 1 INR  │              │
├────────┴──────────────┴──────────┴─────────────┴──────────────┤
│           Total: 6 currencies (5 active, 1 inactive)           │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Currency Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Code** | 3-letter currency code | USD, EUR, BDT, GBP |
| **Name** | Full currency name | US Dollar, Bangladeshi Taka |
| **Symbol** | Currency symbol (ট্কাল, $, €, £) | ৳, $, €, £ |
| **Symbol Position** | Where symbol appears | Left ($100) or Right (100৳) |
| **Exchange Rate** | Value vs base currency | 1 USD = 110.50 BDT |
| **Decimal Places** | Digits after decimal point | USD: 2 (100.50), BDT: 2 (100.50) |
| **Default/Base** | Main business currency | BDT for Bangladesh |
| **Active** | Currently in use | Yes/No |

### **Currency Display Examples**

| Symbol Position | Example | Meaning |
|----------------|---------|---------|
| **Left** | $100.50 | Symbol before amount |
| **Right** | 100.50৳ | Symbol after amount |
| **Right with space** | 100.50 € | Symbol with space |

### **What You Can Do**

#### **1. Add New Currency**

**URL:** `/finance/currencies/create`

**When to add:**
- Starting international business
- Opening foreign bank account
- Need to record foreign transactions
- New customer/supplier uses different currency

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD CURRENCY                      │
├────────────────────────────────────────────┤
│ Currency Code: ___                         │
│ (3-letter code, e.g., USD, EUR)           │
│                                            │
│ Currency Name: _____________________        │
│ (Full name, e.g., US Dollar)              │
│                                            │
│ Symbol: ______                             │
│ (Currency symbol, e.g., $)                 │
│                                            │
│ Symbol Position: [Select ▼]                │
│  • Left ($100)                             │
│  • Right (100৳)                           │
│                                            │
│ Decimal Places: [Select ▼]                 │
│  • 0 (Japanese Yen: 100)                   │
│  • 2 (USD, BDT: 100.50)                    │
│  • 3 (Bahraini Dinar: 100.500)             │
│                                            │
│ Exchange Rate: ৳ _________                 │
│ (How much BDT = 1 unit of this currency)   │
│                                            │
│ Is Active: ☑                               │
│                                            │
│ Notes: _____________________                │
│ (Optional - Any additional info)           │
│                                            │
│              [Cancel]  [Save Currency]     │
└────────────────────────────────────────────┘
```

**Example 1: Adding US Dollar**

```
Scenario: Your business will buy goods from USA

Step-by-Step:

1. Currency Code: USD
2. Currency Name: US Dollar
3. Symbol: $
4. Symbol Position: Select "Left"
5. Decimal Places: Select "2"
6. Exchange Rate: 110.50 (meaning 1 USD = ৳110.50)
7. Is Active: Check the box
8. Notes: "Used for USA imports"
9. Click "Save Currency"

Result:
✅ USD currency added
✅ Can record USD transactions
✅ System will convert to BDT automatically
✅ Exchange rate: $1 = ৳110.50
```

**Example 2: Adding Euro**

```
Scenario: You have customers in Europe

Step-by-Step:

1. Currency Code: EUR
2. Currency Name: Euro
3. Symbol: €
4. Symbol Position: Select "Right"
5. Decimal Places: Select "2"
6. Exchange Rate: 120.75 (meaning 1 EUR = ৳120.75)
7. Is Active: Check the box
8. Notes: "European customers"
9. Click "Save Currency"

Result:
✅ EUR currency added
✅ Can invoice in EUR
✅ Auto-convert to BDT for reports
```

**Example 3: Adding Saudi Riyal**

```
Scenario: You do business in Saudi Arabia

Step-by-Step:

1. Currency Code: SAR
2. Currency Name: Saudi Riyal
3. Symbol: ﷼ or SAR
4. Symbol Position: Select "Left"
5. Decimal Places: Select "2"
6. Exchange Rate: 29.45 (meaning 1 SAR = ৳29.45)
7. Is Active: Check the box
8. Notes: "Middle East operations"
9. Click "Save Currency"

Result:
✅ SAR currency added
✅ Ready for Saudi transactions
```

#### **2. Set Base Currency**

**What is Base Currency?**
- Your main business currency
- All financial reports show in this currency
- Exchange rates are relative to this currency
- Normally your local currency

**How to set:**
- Usually set during initial setup
- Can change later (but be careful!)
- Only ONE currency can be base/default

**Example:**
```
Business in Bangladesh:
✅ Base Currency: BDT (৳)
✅ Other currencies: USD, EUR, GBP
✅ All reports show in BDT
✅ Transactions recorded in both currencies

Base currency CANNOT have an exchange rate
- It's always 1.0 (reference point)
- Other currencies' rates are relative to base
```

#### **3. Update Exchange Rate**

**When to update:**
- Exchange rates change daily
- Before recording foreign transactions
- For accurate reporting
- At least monthly, better weekly

**Step-by-Step:**

1. Click the currency
2. Click **[Update Exchange Rate]**
3. Enter new rate:

```
┌────────────────────────────────────────────┐
│       UPDATE EXCHANGE RATE                 │
├────────────────────────────────────────────┤
│ Currency: US Dollar (USD)                  │
│                                            │
│ Current Rate: 1 USD = ৳110.50             │
│                                            │
│ New Rate: 1 USD = ৳ _________              │
│                                            │
│ Effective Date: __/__/____                 │
│ (When does this rate apply?)               │
│                                            │
│ Notes: _____________________                │
│ (Why did rate change?)                     │
│                                            │
│              [Cancel]  [Update Rate]       │
└────────────────────────────────────────────┘
```

**Example: Updating USD Rate**

```
Scenario: USD rate changed from 110.50 to 112.00

Step-by-Step:

1. Click USD currency
2. Click "Update Exchange Rate"
3. New Rate: 112.00
4. Effective Date: 15/01/2024
5. Notes: "Central bank rate increased"
6. Click "Update Rate"

Result:
✅ Exchange rate updated
✅ New transactions use new rate
✅ Old transactions keep old rate
✅ Accurate tracking of rate changes
```

⚠️ **Warning:** You CANNOT change the exchange rate of the base/default currency.

#### **4. Convert Between Currencies**

**URL:** `/finance/currencies/convert`

**When to convert:**
- Recording foreign transaction
- Check value in different currency
- Calculate foreign exchange gain/loss
- Reporting for foreign stakeholders

**How it works:**

The system automatically converts when you record transactions in foreign currency.

**Example:**
```
You buy goods for $1,000 USD

System automatically:
1. Records transaction: $1,000 USD
2. Converts to BDT: $1,000 × 110.50 = ৳110,500
3. Records both amounts
4. Reports show in BDT (৳110,500)
5. Original USD amount preserved
```

**Manual Conversion (if needed):**

You can also convert manually:

```
Convert $500 to BDT:
Amount: $500
From: USD
To: BDT
Rate: 110.50

Calculation: $500 × 110.50 = ৳55,250

Result:
Original: $500.00 USD
Converted: ৳55,250.00 BDT
```

#### **5. Deactivate Currency**

**When to deactivate:**
- No longer using that currency
- Business relationship ended
- Too many inactive currencies cluttering list

**How to deactivate:**
1. Click the currency
2. Click **[Edit]**
3. Uncheck **"Is Active"**
4. Click **[Save Currency]**

**What happens:**
- Currency marked "Inactive"
- Removed from dropdowns
- Old transactions still visible
- Can reactivate anytime

⚠️ **Warning:** Cannot deactivate base/default currency.

#### **6. Delete Currency**

⚠️ **BE VERY CAREFUL!**

**When you can delete:**
- Just created, made mistake
- No transactions recorded

**When you CANNOT delete:**
- Base/default currency
- Has transactions (system will prevent)

**Better option:** Make inactive instead of deleting

### **Multi-Currency Transaction Examples**

#### **Example 1: Recording USD Purchase**

```
Scenario: Bought materials from USA for $2,000

Exchange rate: 1 USD = ৳110.50

Step-by-Step (in Expenses module):

1. Date: 15/01/2024
2. Currency: Select "USD" (instead of BDT)
3. Amount: 2000 (in USD)
4. System shows: "This equals ৳221,000 BDT"
5. Category: Select expense category
6. Description: "Materials from USA supplier"
7. Account: Select bank account
8. Click "Save Expense"

Result:
✅ Expense recorded: $2,000 USD
✅ Also recorded: ৳221,000 BDT
✅ Both amounts tracked
✅ Reports show in BDT
✅ Original USD preserved
```

#### **Example 2: Invoicing in EUR**

```
Scenario: Sold goods to German customer for €5,000

Exchange rate: 1 EUR = ৳120.75

Step-by-Step (in Accounts Receivable):

1. Customer: German customer
2. Currency: Select "EUR"
3. Amount: 5000 (in EUR)
4. System shows: "This equals ৳603,750 BDT"
5. Invoice date, due date, etc.
6. Click "Save Invoice"

Result:
✅ Invoice created: €5,000 EUR
✅ Also recorded: ৳603,750 BDT
✅ Customer sees invoice in EUR
✅ Your reports show in BDT
```

#### **Example 3: Multi-Currency Bank Account**

```
Scenario: You have a USD bank account

Setup (in Bank Accounts):

1. Bank Name: "City Bank"
2. Account Name: "USD Current Account"
3. Account Number: 1234567890
4. Currency: Select "USD"
5. Opening Balance: $10,000
6. Save

Recording transaction:

When you deposit $5,000:
- Account balance: $15,000 USD
- Also shows: ৳1,657,500 BDT (for reporting)

Result:
✅ Account tracked in USD
✅ Reports converted to BDT
✅ Easy reconciliation
```

### **Exchange Rate Gain/Loss**

**What happens when exchange rates change?**

```
Example:

January 15: You owe supplier $1,000
Rate: 1 USD = ৳110.50
Debt in BDT: ৳110,500

February 15: You pay the $1,000
Rate: 1 USD = ৳112.00
Payment in BDT: ৳112,000

Difference: ৳112,000 - ৳110,500 = ৳1,500

This ৳1,500 is "Exchange Loss" - you paid more due to rate change

OR if rate goes down:

February 15: Rate: 1 USD = ৳109.00
Payment in BDT: ৳109,000

Difference: ৳109,000 - ৳110,500 = -৳1,500

This -৳1,500 is "Exchange Gain" - you paid less due to rate change
```

**The system tracks this automatically!**

### **Currency Best Practices**

💡 **Keep Base Currency Simple**
- Use your local currency
- Don't change base currency often
- All reports in one currency

💡 **Update Rates Regularly**
- Weekly or monthly minimum
- Before recording foreign transactions
- Use official central bank rates
- Document rate source

💡 **Separate Currency Accounts**
- Keep foreign currency in separate accounts
- Easier reconciliation
- Clear tracking

💡 **Document Everything**
- Note exchange rate used
- Keep receipts in original currency
- Record conversion calculations

⚠️ **Watch Exchange Rate Risk**
- Rates can change significantly
- Affects your costs/profits
- Consider hedging for large amounts
- Monitor rate trends

💡 **Reconcile Foreign Accounts**
- Match with foreign bank statements
- Track rate differences
- Record gains/losses properly

### **Common Scenarios**

#### **Scenario 1: Import Payment**

```
You imported goods for $10,000 USD

Invoice date: January 1
Exchange rate: 1 USD = ৳110.00
Recorded debt: ৳1,100,000

Payment date: February 1
Exchange rate: 1 USD = ৳112.00
Actual payment: ৳1,120,000

Extra cost: ৳20,000 (exchange loss)

Accounting entry at payment:
  Debit: Accounts Payable $10,000
  Debit: Exchange Loss ৳20,000
  Credit: Bank ৳1,120,000

✅ Properly records the loss
✅ Clear audit trail
✅ Accurate financial statements
```

#### **Scenario 2: Export Sale**

```
You sold goods for €5,000 EUR

Invoice date: January 1
Exchange rate: 1 EUR = ৳120.00
Recorded income: ৳600,000

Payment received: February 1
Exchange rate: 1 EUR = ৳122.00
Actual received: ৳610,000

Extra gain: ৳10,000 (exchange gain)

Accounting entry at payment:
  Debit: Bank ৳610,000
  Credit: Accounts Receivable €5,000 (৳600,000)
  Credit: Exchange Gain ৳10,000

✅ Records the gain
✅ Proper accounting treatment
```

#### **Scenario 3: Too Many Currencies**

```
You have 15 currencies configured, only use 3 regularly

Problem:
- Confusing dropdowns
- Hard to find right currency
- Rates need updating for all

Solution:
1. Identify active currencies (BDT, USD, EUR)
2. Keep these 3 active
3. Deactivate others
4. Old transactions still visible
5. Cleaner interface

✅ Easier to use
✅ Less maintenance
✅ History preserved
```

---

## **CHAPTER 6: EXPENSES**

### **URL:** `/finance/expenses`

### **What are Expenses?**

**Expense = Money you spend to run your business**

Think of it as:
> "Everything that costs money to keep your business running"

**Real-world examples:**
- Rent for office space
- Salaries for staff
- Electricity bill
- Office supplies
- Marketing costs
- Travel expenses

### **Why Track Expenses?**

**Benefits:**
- Know where your money goes
- Control spending
- Reduce unnecessary costs
- Tax deductions
- Profit calculations

**Without tracking:**
❌ No idea what you're spending
❌ Can't control costs
❌ Missing tax deductions
❌ Can't calculate true profit

### **Expense vs. Other Money Out**

| Type | What It Means | Example | Record Where? |
|------|---------------|---------|---------------|
| **Expense** | Business running cost | Rent, salaries, utilities | Expenses Module |
| **Accounts Payable** | Bill to pay later | Supplier invoice | Accounts Payable (Chapter 6) |
| **Transfer** | Money between accounts | Bank A → Bank B | Transactions (Chapter 3) |

**Simple rule:**
- Already paid → Record as Expense
- Will pay later → Record as Accounts Payable

### **What You See**

The Expenses page shows all your business expenses:

```
┌────────────────────────────────────────────────────────────────┐
│  💰 EXPENSES                                 [+ Add Expense]   │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Date: This Month ▼] [Category: All ▼] [Exp]  │
├──────┬──────────────┬────────────────┬────────────┬──────────┤
│ Date │ Category     │ Description    │   Amount   │  Status  │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│15Jan │ Rent         │ Office Rent    │  ৳25,000   │  Paid    │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│14Jan │ Salary       │ Staff Salary   │ ৳500,000   │  Paid    │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│13Jan │ Utilities    │ Electricity    │  ৳15,000   │  Paid    │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│12Jan │ Marketing    │ Facebook Ads    │  ৳30,000   │  Paid    │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│11Jan │ Travel       │ Dhaka Trip     │  ৳12,500   │  Paid    │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│10Jan │ Office Supply│ Printer Paper   │   ৳3,200   │  Paid    │
├──────┴──────────────┴────────────────┴────────────┴──────────┤
│                  Total: ৳585,700 This Month                  │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Expense Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Date** | When expense happened | 15 Jan 2024 |
| **Category** | Type of expense | Rent, Salary, Utilities |
| **Description** | What was it for? | "Office rent for January 2024" |
| **Amount** | How much spent? | ৳25,000 |
| **Payment Method** | How did you pay? | Cash, Bank, bKash, Check |
| **Vendor** | Who did you pay? | Building owner, Utility company |
| **Status** | Paid or Pending? | Paid = done, Pending = to pay |
| **Receipt** | Proof of payment | Scanned receipt, invoice |

### **Common Expense Categories**

| Category | What It Includes | Examples |
|----------|------------------|----------|
| **Rent** | Office, warehouse space | Monthly rent, advance rent |
| **Salary** | Staff wages, salaries | Monthly salary, bonuses, overtime |
| **Utilities** | Electricity, water, gas, internet | DESA bill, WASA bill, broadband |
| **Marketing** | Advertising, promotions | Facebook ads, billboards, printing |
| **Travel** | Business trips | Tickets, hotel, meals, transport |
| **Office Supplies** | Daily office needs | Paper, pens, printer ink |
| **Professional Fees** | Lawyer, accountant, consultant | Legal advice, audit fees |
| **Insurance** | Business insurance | Fire, theft, liability |
| **Repairs & Maintenance** | Fixing things | Office repair, equipment service |
| **Communication** | Phone, internet | Mobile bill, internet bill |
| **Vehicle Expense** | Car/van costs | Fuel, maintenance, insurance |
| **Entertainment** | Client meetings | Business lunch, dinner |

### **What You Can Do**

#### **1. Add New Expense**

**URL:** `/finance/expenses/create`

**When to add:**
- Paid for something business-related
- Used company money for business expense
- Reimbursed employee for business expense

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD EXPENSE                       │
├────────────────────────────────────────────┤
│ Date: __/__/____                           │
│ (When did you pay?)                        │
│                                            │
│ Category: [Select ▼]                       │
│  • Rent Expense                            │
│  • Salary Expense                          │
│  • Utility Expense                         │
│  • Marketing Expense                       │
│  • Travel Expense                          │
│  • Office Supplies                         │
│  • Other Expense                           │
│                                            │
│ Amount: ৳ ___________________               │
│ (How much did you pay?)                    │
│                                            │
│ Payment Method: [Select ▼]                 │
│  • Cash                                    │
│  • Bank Transfer                           │
│  • Check                                   │
│  • bKash                                   │
│  • Credit Card                             │
│                                            │
│ Account: [Select ▼]                        │
│  • DBBL Current Account                    │
│  • City Bank Salary                        │
│  • Petty Cash                              │
│                                            │
│ Vendor/Payee: _____________________         │
│ (Who did you pay? - Optional)              │
│                                            │
│ Description: _____________________         │
│ (What was this expense for?)               │
│                                            │
│ Reference: _____________________            │
│ (Optional - Bill number, receipt #)        │
│                                            │
│ Has Receipt: ☑                             │
│                                            │
│ Attach Receipt: [Choose File]              │
│ (Optional - Upload receipt/bill)           │
│                                            │
│ Recurring Expense: ☐                       │
│ (Check if this repeats monthly)            │
│                                            │
│              [Cancel]  [Save Expense]      │
└────────────────────────────────────────────┘
```

**Example 1: Recording Rent Payment**

```
Scenario: Paid office rent ৳25,000 by check

Step-by-Step:

1. Date: 15/01/2024
2. Category: Select "Rent Expense"
3. Amount: 25000
4. Payment Method: Select "Check"
5. Account: Select "DBBL Current Account"
6. Vendor/Payee: "ABC Building Ltd."
7. Description: "Office rent for January 2024"
8. Reference: CHK-789
9. Has Receipt: Check the box
10. Attach Receipt: Upload rent receipt
11. Recurring Expense: Check the box (monthly)
12. Click "Save Expense"

Result:
✅ Expense recorded
✅ Account balance updated (- ৳25,000)
✅ Ready for tax deduction
✅ Will remind you next month
```

**Example 2: Recording Utility Bill**

```
Scenario: Paid electricity bill ৳15,000

Step-by-Step:

1. Date: 13/01/2024
2. Category: Select "Utility Expense"
3. Amount: 15000
4. Payment Method: Select "Bank Transfer"
5. Account: Select "DBBL Current Account"
6. Vendor/Payee: "DESCO"
7. Description: "Electricity bill - Dec 2023"
8. Reference: "DESCO Bill #12345"
9. Has Receipt: Check the box
10. Attach Receipt: Upload DESCO bill
11. Recurring Expense: Check the box (monthly)
12. Click "Save Expense"

Result:
✅ Utility expense tracked
✅ Payment recorded
✅ Easy to track trends
```

**Example 3: Recording Travel Expense**

```
Scenario: Business trip to Dhaka, total cost ৳12,500

Step-by-Step:

1. Date: 11/01/2024
2. Category: Select "Travel Expense"
3. Amount: 12500
4. Payment Method: Select "Cash"
5. Account: Select "Petty Cash"
6. Vendor/Payee: "Various"
7. Description: "Business trip to Dhaka - Meeting with clients"
8. Reference: Leave blank
9. Has Receipt: Check the box
10. Attach Receipt: Upload all receipts (bus, hotel, meals)
11. Recurring Expense: Leave blank
12. Click "Save Expense"

Result:
✅ Travel expense tracked
✅ Proof attached
✅ Tax deductible
```

**Example 4: Employee Reimbursement**

```
Scenario: Employee bought office supplies ৳3,200, needs reimbursement

Step-by-Step:

1. Date: 10/01/2024
2. Category: Select "Office Supplies"
3. Amount: 3200
4. Payment Method: Select "Cash"
5. Account: Select "Petty Cash"
6. Vendor/Payee: "Employee Name - Karim"
7. Description: "Office supplies - Printer paper, pens"
8. Reference: Leave blank
9. Has Receipt: Check the box
10. Attach Receipt: Upload receipts from employee
11. Recurring Expense: Leave blank
12. Click "Save Expense"

Result:
✅ Expense recorded
✅ Employee reimbursed
✅ Proper documentation
```

#### **2. View Expense Details**

Click any expense to see details:

```
┌────────────────────────────────────────────┐
│  EXPENSE DETAILS                           │
├────────────────────────────────────────────┤
│ Date: 15 January 2024                      │
│ Category: Rent Expense                     │
│ Amount: ৳25,000                            │
│                                            │
│ Payment Method: Check                      │
│ Account: DBBL Current Account              │
│ Check Number: CHK-789                      │
│                                            │
│ Vendor: ABC Building Ltd.                  │
│ Description:                              │
│ Office rent for January 2024              │
│ Gulshan Avenue, Dhaka                      │
│                                            │
│ Reference: Rent Receipt #R-123             │
│ Recurring: Yes (Monthly)                   │
│                                            │
│ Attachments:                               │
│ 📄 Rent_Receipt_Jan2024.pdf                │
│                                            │
│ Created by: Admin User                     │
│ Created at: 15/01/2024 10:30 AM           │
│                                            │
│ [Edit] [Delete] [Print] [Close]            │
└────────────────────────────────────────────┘
```

#### **3. Edit Expense**

**When to edit:**
- Wrong amount
- Wrong category
- Update description
- Add missing receipt

**How to edit:**
1. Click the expense
2. Click **[Edit]**
3. Make changes
4. Click **[Save Expense]**

⚠️ **Warning:** Editing changes expense totals.

#### **4. Delete Expense**

⚠️ **BE CAREFUL!**

**When you can delete:**
- Just created, made mistake
- Duplicate entry

**When you should NOT delete:**
- Old expenses (affects reports)
- Already used for tax

**How to delete:**
1. Click the expense
2. Click **[Delete]**
3. Confirm

#### **5. Recurring Expenses**

**What are recurring expenses?**
- Expenses that happen regularly
- Same amount each time
- Rent, salaries, subscriptions, etc.

**How to set up:**
When adding expense, check **"Recurring Expense"** box

**What happens:**
- System reminds you when due
- Easy to create next month's expense
- Never miss a payment

**Examples of recurring expenses:**
- Monthly rent
- Monthly salaries
- Internet bill
- Software subscription
- Insurance premium

### **Expense Best Practices**

💡 **Record Immediately**
- Don't wait until end of month
- Record as soon as you pay
- Less forgetting

💡 **Always Get Receipts**
- Proof of payment
- Required for tax
- Easy if audited

💡 **Use Correct Categories**
- Makes reporting accurate
- Easy to see spending patterns
- Better business insights

💡 **Describe Clearly**
- Bad: "Expense"
- Good: "Office rent for January 2024"
- Include dates, details

💡 **Separate Personal & Business**
- Never mix personal expenses
- Open separate business accounts
- Proper tax deductions

⚠️ **Don't Lose Receipts**
- Scan immediately
- Upload to system
- Keep paper copies too

### **Common Scenarios**

#### **Scenario 1: Daily Small Expenses**

```
Small expenses throughout the day:
- Tea/Coffee: ৳200
- Taxi fare: ৳350
- Office supplies: ৳450

Option 1: Record each separately
✅ Detailed
❌ Time-consuming

Option 2: Record as one daily expense
✅ Faster
✅ Good for small amounts
Description: "Daily petty cash expenses - tea, taxi, supplies"
Amount: ৳1,000

Recommendation: One daily entry for small expenses
```

#### **Scenario 2: Large One-Time Expense**

```
Bought office equipment for ৳150,000

Should you record as expense?

If equipment lasts < 1 year: Record as expense
If equipment lasts > 1 year: Should be asset (depreciation)

Check with accountant for proper treatment
```

#### **Scenario 3: Mixed Personal/Business**

```
Used personal car for business trip. Fuel cost ৳5,000.
Total mileage this month: 1,000 km
Business mileage: 300 km

How to record?

Business portion = (300 ÷ 1,000) × 5,000 = ৳1,500

Record expense: ৳1,500 as business travel expense
Keep mileage log for proof
```

#### **Scenario 4: Employee Uses Personal Money**

```
Employee paid ৳3,500 for client lunch with own money

Step 1: Employee submits receipt
Step 2: Record expense in system
Step 3: Reimburse employee
Step 4: Attach receipt to expense

Correct approach:
✅ Expense category: Entertainment
✅ Amount: ৳3,500
✅ Payment method: Cash (from petty cash)
✅ Description: "Client lunch with ABC Corp - 3 people"
✅ Attach receipt
```

---

## **CHAPTER 7: ACCOUNTS PAYABLE**

### **URL:** `/finance/accounts-payable`

### **What is Accounts Payable?**

**Accounts Payable = Money you owe to suppliers/vendors**

Think of it as:
> "Bills you need to pay later"

**Real-world examples:**
- Supplier sends goods, you pay in 30 days
- Utility bill due next week
- Rent paid at the end of month
- Consultant invoice due in 15 days

### **Why Track Accounts Payable?**

**Benefits:**
- Never miss a payment
- Take advantage of credit terms
- Manage cash flow better
- Good supplier relationships
- Avoid late fees

**Without tracking:**
❌ Forget to pay bills
❌ Late payment fees
❌ Suppliers stop giving credit
❌ Cash flow problems

### **Accounts Payable vs. Expenses**

| | Accounts Payable | Expense |
|--|------------------|---------|
| **What?** | Bill to pay later | Already paid |
| **When?** | Will pay in future | Already paid |
| **Status?** | Pending/Owed | Paid |
| **Record Where?** | Accounts Payable | Expenses |

**Simple workflow:**
```
1. Receive bill → Record in Accounts Payable (Pending)
2. When due → Pay the bill
3. After paying → Record as Expense (Paid)
```

### **What You See**

The Accounts Payable page shows bills you need to pay:

```
┌────────────────────────────────────────────────────────────────┐
│  📤 ACCOUNTS PAYABLE                       [+ Add Bill]         │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Status: All ▼] [Due: This Week ▼] [Export]  │
├──────────┬────────────┬──────────────┬───────────┬────────────┤
│   Due    │  Vendor    │   Description│   Amount  │   Status   │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 20Jan    │ XYZ Supp.  │ Materials    │  ৳75,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 25Jan    │ ABC Corp   │ Services     │  ৳45,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 01Feb    │ Utility Co │ Electricity  │  ৳18,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 05Feb    │ Landlord   │ Office Rent  │  ৳25,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 10Jan ✓  │ PQR Ltd    │ Consulting   │  ৳30,000  │    Paid    │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 08Jan ✓  │ DEF Supp.  │ Inventory    │ ৳120,000  │    Paid    │
├──────────┴────────────┴──────────────┴───────────┴────────────┤
│               Total Pending: ৳163,000  |  Paid: ৳150,000     │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Accounts Payable Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Vendor** | Who you owe | Supplier name |
| **Invoice #** | Bill number | INV-1234 |
| **Invoice Date** | When bill was issued | 10 Jan 2024 |
| **Due Date** | When you must pay | 25 Jan 2024 |
| **Amount** | How much you owe | ৳75,000 |
| **Status** | Pending or Paid | Pending = not paid yet |
| **Days Overdue** | How many days late | 5 days overdue |
| **Payment Terms** | When to pay | Net 30 = pay in 30 days |

### **Bill Status Explained**

| Status | What It Means | Can You Edit? |
|--------|---------------|---------------|
| **Pending** | Bill not paid yet | Yes |
| **Partial** | Paid some amount | Yes |
| **Paid** | Fully paid | No (read-only) |
| **Overdue** | Past due date | Yes |

### **What You Can Do**

#### **1. Add New Bill (Accounts Payable)**

**URL:** `/finance/accounts-payable/create`

**When to add:**
- Received supplier invoice
- Got a bill to pay later
- Purchased on credit

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD BILL (ACCOUNTS PAYABLE)       │
├────────────────────────────────────────────┤
│ Vendor: [Select or Type]                   │
│ (Who sent this bill?)                      │
│                                            │
│ Invoice Number: _____________________       │
│ (Bill number from vendor)                  │
│                                            │
│ Invoice Date: __/__/____                   │
│ (When was the bill issued?)                │
│                                            │
│ Due Date: __/__/____                       │
│ (When must you pay?)                       │
│                                            │
│ Category: [Select ▼]                       │
│  • Inventory/Materials                     │
│  • Services                                │
│  • Rent                                    │
│  • Utilities                               │
│  • Other                                   │
│                                            │
│ Amount: ৳ ___________________               │
│ (How much do you owe?)                     │
│                                            │
│ Description: _____________________         │
│ (What is this bill for?)                   │
│                                            │
│ Payment Terms: [Select ▼]                  │
│  • Net 15 (Pay in 15 days)                │
│  • Net 30 (Pay in 30 days)                │
│  • Net 60 (Pay in 60 days)                │
│  • Due on Date                             │
│                                            │
│ Attach Invoice: [Choose File]              │
│ (Upload the bill/invoice)                  │
│                                            │
│ Notes: _____________________                │
│ (Any additional information)               │
│                                            │
│              [Cancel]  [Save Bill]         │
└────────────────────────────────────────────┘
```

**Example 1: Recording Supplier Bill**

```
Scenario: XYZ Suppliers sent materials, bill ৳75,000 due in 30 days

Step-by-Step:

1. Vendor: Type "XYZ Suppliers Ltd."
2. Invoice Number: "INV-2024-0156"
3. Invoice Date: 15/01/2024
4. Due Date: 14/02/2024 (30 days from invoice)
5. Category: Select "Inventory/Materials"
6. Amount: 75000
7. Description: "Raw materials - Order #PO-123"
8. Payment Terms: Select "Net 30"
9. Attach Invoice: Upload XYZ's invoice
10. Notes: "Materials for February production"
11. Click "Save Bill"

Result:
✅ Bill recorded in Accounts Payable
✅ Due date tracked
✅ Will remind you when to pay
✅ Cash flow planned
```

**Example 2: Recording Service Invoice**

```
Scenario: Consultant sent invoice ৳45,000 for services

Step-by-Step:

1. Vendor: Type "ABC Consulting"
2. Invoice Number: "AC-2024-0089"
3. Invoice Date: 10/01/2024
4. Due Date: 25/01/2024
5. Category: Select "Services"
6. Amount: 45000
7. Description: "Consulting services - January 2024"
8. Payment Terms: Select "Net 15"
9. Attach Invoice: Upload consultant's invoice
10. Notes: "Business strategy consultation"
11. Click "Save Bill"

Result:
✅ Bill recorded
✅ Due in 15 days
✅ Ready to pay on time
```

**Example 3: Recording Utility Bill**

```
Scenario: Received electricity bill ৳18,000 due next month

Step-by-Step:

1. Vendor: Type "DESCO"
2. Invoice Number: "DESL-12345678"
3. Invoice Date: 01/01/2024
4. Due Date: 01/02/2024
5. Category: Select "Utilities"
6. Amount: 18000
7. Description: "Electricity bill - Dec 2023"
8. Payment Terms: Select "Due on Date"
9. Attach Invoice: Upload DESCO bill
10. Notes: Leave blank
11. Click "Save Bill"

Result:
✅ Utility bill tracked
✅ Won't forget to pay
✅ Can pay on due date
```

#### **2. Pay a Bill**

**When to pay:**
- On or before due date
- When you have cash available
- To take advantage of discounts

**Step-by-Step:**

1. Click the bill you want to pay
2. Click **[Record Payment]**
3. Fill in payment details:

```
┌────────────────────────────────────────────┐
│          RECORD PAYMENT                    │
├────────────────────────────────────────────┤
│ Bill: INV-2024-0156                        │
│ Vendor: XYZ Suppliers Ltd.                 │
│ Total Amount: ৳75,000                      │
│                                            │
│ Payment Date: __/__/____                   │
│ (When are you paying?)                     │
│                                            │
│ Payment Amount: ৳ _____________            │
│ (How much are you paying now?)             │
│                                            │
│ Payment Method: [Select ▼]                 │
│  • Bank Transfer                           │
│  • Check                                   │
│  • Cash                                    │
│  • bKash                                   │
│                                            │
│ Account: [Select ▼]                        │
│  • DBBL Current Account                    │
│  • City Bank Salary                        │
│  • Brac Bank Online                        │
│                                            │
│ Reference: _____________________            │
│ (Check number, transaction ID)             │
│                                            │
│ Notes: _____________________                │
│ (Any payment notes)                        │
│                                            │
│              [Cancel]  [Record Payment]    │
└────────────────────────────────────────────┘
```

**Example: Paying Supplier Bill**

```
Scenario: Pay XYZ Suppliers ৳75,000 by bank transfer

Step-by-Step:

1. Click the bill from XYZ Suppliers
2. Click "Record Payment"
3. Payment Date: 14/02/2024
4. Payment Amount: 75000 (full amount)
5. Payment Method: Select "Bank Transfer"
6. Account: Select "DBBL Current Account"
7. Reference: "TRF-XYZ-0156"
8. Notes: "Full payment for INV-2024-0156"
9. Click "Record Payment"

Result:
✅ Payment recorded
✅ Account balance updated (- ৳75,000)
✅ Bill status changed to "Paid"
✅ Accounts Payable reduced
✅ Expense automatically created
```

#### **3. Partial Payment**

**When to pay partially:**
- Paying in installments
- Cash flow management
- Supplier agreement

**Example:**

```
Scenario: You owe ৳75,000 but can only pay ৳50,000 now

Step-by-Step:

1. Click the bill
2. Click "Record Payment"
3. Payment Amount: 50000 (partial)
4. Complete payment details
5. Click "Record Payment"

Result:
✅ Partial payment recorded
✅ Bill status: "Partial"
✅ Remaining: ৳25,000
✅ Can pay remaining later
```

#### **4. View Bill Details**

Click any bill to see full details:

```
┌────────────────────────────────────────────┐
│  BILL DETAILS                              │
├────────────────────────────────────────────┤
│ Vendor: XYZ Suppliers Ltd.                 │
│ Invoice #: INV-2024-0156                   │
│                                            │
│ Invoice Date: 15 January 2024              │
│ Due Date: 14 February 2024                 │
│ Days Until Due: 5 days                    │
│                                            │
│ Total Amount: ৳75,000                      │
│ Paid: ৳0                                  │
│ Balance: ৳75,000                          │
│ Status: Pending                            │
│                                            │
│ Description:                              │
│ Raw materials for February production     │
│ Order #PO-123                              │
│                                            │
│ Payment Terms: Net 30                     │
│ Category: Inventory/Materials              │
│                                            │
│ Attachments:                               │
│ 📄 INV-2024-0156_XYZ_Suppliers.pdf         │
│                                            │
│ Created by: Admin User                     │
│ Created at: 16/01/2024 11:30 AM           │
│                                            │
│ [Record Payment] [Edit] [Print] [Close]   │
└────────────────────────────────────────────┘
```

#### **5. Edit Bill**

**When to edit:**
- Wrong amount
- Wrong due date
- Update details
- Add attachments

**How to edit:**
1. Click the bill
2. Click **[Edit]**
3. Make changes
4. Click **[Save Bill]**

⚠️ **Can't edit paid bills.** Make correcting entry instead.

### **Accounts Payable Best Practices**

💡 **Record Bills Immediately**
- Don't wait until due date
- Record when received
- Better cash flow planning

💡 **Pay On Time**
- Build good relationships
- Avoid late fees
- Maintain credit rating

💡 **Take Advantage of Terms**
- If Net 30, pay on day 30 (not before)
- Keep cash in your account longer
- Better cash flow

💡 **Review Regularly**
- Check weekly what's due
- Plan payments
- Avoid surprises

⚠️ **Verify Before Paying**
- Check you received goods/services
- Verify amount is correct
- Match with purchase order

💡 **Communicate with Vendors**
- If you'll be late, tell them
- Negotiate better terms
- Build relationships

### **Common Scenarios**

#### **Scenario 1: Managing Due Dates**

```
You have 3 bills due this week:
- Monday: ৳30,000
- Wednesday: ৳45,000
- Friday: ৳20,000

Total needed: ৳95,000

Your balance: ৳80,000

What to do?
✅ Pay Monday and Wednesday bills (৳75,000)
✅ Call Friday vendor, request extension
✅ Pay Friday when more money comes in

Result: Good communication, no late payments
```

#### **Scenario 2: Early Payment Discount**

```
Vendor offers 2% discount if paid in 10 days
Bill amount: ৳100,000
Terms: 2/10 Net 30

Option 1: Pay in 10 days
Discount: 2% of ৳100,000 = ৳2,000
You pay: ৳98,000
Save: ৳2,000

Option 2: Pay in 30 days
You pay: ৳100,000
No discount

Decision: If you have cash, pay early and save ৳2,000
```

#### **Scenario 3: Disputed Bill**

```
Vendor sent bill for ৳80,000
But you only received goods worth ৳60,000

What to do?

WRONG: Just pay and complain later
CORRECT:
1. Record bill for correct amount: ৳60,000
2. Contact vendor about discrepancy
3. Ask for revised invoice
4. Pay correct amount when resolved

✅ Proper documentation
✅ No overpayment
✅ Clear communication
```

---

## **CHAPTER 8: ACCOUNTS RECEIVABLE**

### **URL:** `/finance/accounts-receivable`

### **What is Accounts Receivable?**

**Accounts Receivable = Money customers owe you**

Think of it as:
> "Payments you need to collect from customers"

**Real-world examples:**
- You delivered goods, customer pays in 30 days
- Completed service work, invoice due next week
- Sold on credit to regular customer
- Customer paid advance for future order

### **Why Track Accounts Receivable?**

**Benefits:**
- Know who owes you money
- Never forget to collect
- Better cash flow planning
- Follow up on late payments
- Maintain customer credit limits

**Without tracking:**
❌ Forget who owes you
❌ Cash flow problems
❌ Bad debts (uncollected money)
❌ Can't plan expenses

### **Accounts Receivable vs. Income**

| | Accounts Receivable | Income |
|--|---------------------|--------|
| **What?** | Invoice sent, waiting for payment | Money received |
| **When?** | Will receive in future | Already received |
| **Status?** | Pending/Owed | Collected |
| **Record Where?** | Accounts Receivable | Transactions/Income |

**Simple workflow:**
```
1. Send invoice → Record in Accounts Receivable (Pending)
2. Customer pays → Collect payment
3. After collecting → Record as Income (Received)
```

### **What You See**

The Accounts Receivable page shows money to collect:

```
┌────────────────────────────────────────────────────────────────┐
│  📥 ACCOUNTS RECEIVABLE                    [+ Add Invoice]      │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Status: All ▼] [Due: This Week ▼] [Export]  │
├──────────┬────────────┬──────────────┬───────────┬────────────┤
│   Due    │  Customer  │   Description│   Amount  │   Status   │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 20Jan    │ ABC Corp   │ Invoice #100  │  ৳50,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 25Jan    │ XYZ Ltd    │ Invoice #101  │  ৳75,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 01Feb    │ PQR Stores │ Invoice #102  │  ৳35,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 05Feb    │ LMN Traders│ Invoice #103  │  ৳90,000  │   Pending  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 10Jan ✓  │ DEF Corp   │ Invoice #099  │  ৳40,000  │  Received  │
├──────────┼────────────┼──────────────┼───────────┼────────────┤
│ 08Jan ✓  │ GHI Ltd    │ Invoice #098  │  ৳60,000  │  Received  │
├──────────┴────────────┴──────────────┴───────────┴────────────┤
│            Total Pending: ৳250,000  |  Received: ৳100,000     │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Accounts Receivable Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Customer** | Who owes you | Customer name |
| **Invoice #** | Your invoice number | INV-100 |
| **Invoice Date** | When invoice was sent | 10 Jan 2024 |
| **Due Date** | When customer must pay | 25 Jan 2024 |
| **Amount** | How much they owe | ৳50,000 |
| **Status** | Pending or Received | Pending = not collected yet |
| **Days Overdue** | How many days late | 5 days overdue |
| **Payment Terms** | When customer should pay | Net 30 = pay in 30 days |

### **Invoice Status Explained**

| Status | What It Means | Can You Edit? |
|--------|---------------|---------------|
| **Pending** | Not paid yet | Yes |
| **Partial** | Paid some amount | Yes |
| **Received** | Fully paid | No (read-only) |
| **Overdue** | Past due date | Yes |

### **What You Can Do**

#### **1. Add New Invoice (Accounts Receivable)**

**URL:** `/finance/accounts-receivable/create`

**When to add:**
- Sent invoice to customer
- Sold goods on credit
- Completed service work
- Need to track payment collection

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD INVOICE (ACCOUNTS RECEIVABLE)  │
├────────────────────────────────────────────┤
│ Customer: [Select or Type]                  │
│ (Who are you invoicing?)                    │
│                                            │
│ Invoice Number: _____________________        │
│ (Your invoice number)                       │
│                                            │
│ Invoice Date: __/__/____                   │
│ (When did you send the invoice?)            │
│                                            │
│ Due Date: __/__/____                       │
│ (When should customer pay?)                 │
│                                            │
│ Category: [Select ▼]                       │
│  • Sales of Goods                          │
│  • Services                                │
│  • Consulting                              │
│  • Other                                   │
│                                            │
│ Amount: ৳ ___________________               │
│ (How much do they owe?)                     │
│                                            │
│ Description: _____________________         │
│ (What is this invoice for?)                 │
│                                            │
│ Payment Terms: [Select ▼]                  │
│  • Net 15 (Pay in 15 days)                │
│  • Net 30 (Pay in 30 days)                │
│  • Net 60 (Pay in 60 days)                │
│  • Due on Date                             │
│                                            │
│ Attach Invoice: [Choose File]              │
│ (Upload the invoice you sent)               │
│                                            │
│ Notes: _____________________                │
│ (Any additional information)               │
│                                            │
│              [Cancel]  [Save Invoice]      │
└────────────────────────────────────────────┘
```

**Example 1: Recording Sales Invoice**

```
Scenario: Sold goods to ABC Corp, sent invoice ৳50,000 due in 30 days

Step-by-Step:

1. Customer: Type "ABC Corporation"
2. Invoice Number: "INV-2024-0100"
3. Invoice Date: 15/01/2024
4. Due Date: 14/02/2024 (30 days from invoice)
5. Category: Select "Sales of Goods"
6. Amount: 50000
7. Description: "Products - Order #SO-456"
8. Payment Terms: Select "Net 30"
9. Attach Invoice: Upload invoice sent to ABC
10. Notes: "Payment to DBBL Account"
11. Click "Save Invoice"

Result:
✅ Invoice recorded in Accounts Receivable
✅ Due date tracked
✅ Will remind you to follow up
✅ Expected cash flow planned
```

**Example 2: Recording Service Invoice**

```
Scenario: Completed consulting for XYZ Ltd, invoice ৳75,000

Step-by-Step:

1. Customer: Type "XYZ Limited"
2. Invoice Number: "INV-2024-0101"
3. Invoice Date: 10/01/2024
4. Due Date: 25/01/2024
5. Category: Select "Services"
6. Amount: 75000
7. Description: "Consulting services - January 2024"
8. Payment Terms: Select "Net 15"
9. Attach Invoice: Upload consulting invoice
10. Notes: "Business strategy consulting"
11. Click "Save Invoice"

Result:
✅ Invoice recorded
✅ Due in 15 days
✅ Ready to follow up
```

**Example 3: Recording Installment Sale**

```
Scenario: Sold equipment ৳300,000, customer pays in 3 installments

Option 1: Record as 3 separate invoices
✅ Clear tracking
❌ More work

Option 2: Record one invoice, track partial payments
✅ Simpler
✅ Better for this case

Step-by-Step:

1. Customer: Type "Customer Name"
2. Invoice Number: "INV-2024-0103"
3. Invoice Date: 01/01/2024
4. Due Date: 01/04/2024 (final installment)
5. Category: Select "Sales of Goods"
6. Amount: 300000 (full amount)
7. Description: "Equipment - 3 monthly installments of ৳100,000 each"
8. Payment Terms: Select "Net 90"
9. Attach Invoice: Upload
10. Notes: "Installment 1 due Feb 1, Installment 2 due Mar 1, Installment 3 due Apr 1"
11. Click "Save Invoice"

Result:
✅ Full amount tracked
✅ Can record partial payments
✅ Clear balance remaining
```

#### **2. Record Payment Received**

**When to record:**
- Customer paid by bank transfer
- Customer paid by check
- Customer paid cash
- Customer paid via bKash

**Step-by-Step:**

1. Click the invoice
2. Click **[Record Payment]**
3. Fill in payment details:

```
┌────────────────────────────────────────────┐
│          RECORD PAYMENT RECEIVED            │
├────────────────────────────────────────────┤
│ Invoice: INV-2024-0100                     │
│ Customer: ABC Corporation                  │
│ Total Amount: ৳50,000                      │
│                                            │
│ Payment Date: __/__/____                   │
│ (When did you receive payment?)            │
│                                            │
│ Payment Amount: ৳ _____________            │
│ (How much did they pay now?)               │
│                                            │
│ Payment Method: [Select ▼]                 │
│  • Bank Transfer                           │
│  • Check                                   │
│  • Cash                                    │
│  • bKash                                   │
│                                            │
│ Account: [Select ▼]                        │
│  • DBBL Current Account                    │
│  • City Bank Salary                        │
│  • Brac Bank Online                        │
│  • bKash Merchant                          │
│                                            │
│ Reference: _____________________            │
│ (Check number, transaction ID)             │
│                                            │
│ Notes: _____________________                │
│ (Any payment notes)                        │
│                                            │
│              [Cancel]  [Record Payment]    │
└────────────────────────────────────────────┘
```

**Example: Recording Customer Payment**

```
Scenario: ABC Corp paid ৳50,000 by bank transfer

Step-by-Step:

1. Click the invoice from ABC Corp
2. Click "Record Payment"
3. Payment Date: 14/02/2024
4. Payment Amount: 50000 (full amount)
5. Payment Method: Select "Bank Transfer"
6. Account: Select "DBBL Current Account"
7. Reference: "TRF-ABC-0100"
8. Notes: "Full payment for INV-2024-0100"
9. Click "Record Payment"

Result:
✅ Payment recorded
✅ Account balance updated (+ ৳50,000)
✅ Invoice status changed to "Received"
✅ Accounts Receivable reduced
✅ Income automatically recorded
```

#### **3. Partial Payment**

**When customers pay partially:**
- Installment payments
- Customer pays what they can now
- Payment arrangements

**Example:**

```
Scenario: Customer owes ৳75,000 but paid ৳50,000 now

Step-by-Step:

1. Click the invoice
2. Click "Record Payment"
3. Payment Amount: 50000 (partial)
4. Complete payment details
5. Click "Record Payment"

Result:
✅ Partial payment recorded
✅ Invoice status: "Partial"
✅ Remaining: ৳25,000
✅ Can record remaining payment later
```

#### **4. View Invoice Details**

Click any invoice to see full details:

```
┌────────────────────────────────────────────┐
│  INVOICE DETAILS                           │
├────────────────────────────────────────────┤
│ Customer: ABC Corporation                  │
│ Invoice #: INV-2024-0100                   │
│                                            │
│ Invoice Date: 15 January 2024              │
│ Due Date: 14 February 2024                 │
│ Days Until Due: 5 days                    │
│                                            │
│ Total Amount: ৳50,000                      │
│ Received: ৳0                              │
│ Balance: ৳50,000                          │
│ Status: Pending                            │
│                                            │
│ Description:                              │
│ Products - Order #SO-456                  │
│                                            │
│ Payment Terms: Net 30                     │
│ Category: Sales of Goods                   │
│                                            │
│ Attachments:                               │
│ 📄 INV-2024-0100_ABC_Corp.pdf              │
│                                            │
│ Created by: Admin User                     │
│ Created at: 16/01/2024 2:30 PM            │
│                                            │
│ [Record Payment] [Send Reminder] [Edit]   │
│ [Print] [Close]                           │
└────────────────────────────────────────────┘
```

#### **5. Send Payment Reminder**

**When to remind:**
- Due date approaching
- Payment overdue
- Customer forgot

**How to send:**
1. Click the invoice
2. Click **[Send Reminder]**
3. Choose reminder type:
   - Friendly reminder (before due)
   - Overdue notice (after due)
   - Final notice (very overdue)

#### **6. Edit Invoice**

**When to edit:**
- Wrong amount
- Wrong due date
- Update customer details
- Add attachments

**How to edit:**
1. Click the invoice
2. Click **[Edit]**
3. Make changes
4. Click **[Save Invoice]**

⚠️ **Can't edit received invoices.** Make correcting entry instead.

### **Accounts Receivable Best Practices**

💡 **Send Invoices Immediately**
- Don't wait until end of month
- Send as soon as work is done
- Faster payment

💡 **Clear Payment Terms**
- Always state due date clearly
- Include late payment policy
- Bank details on invoice

💡 **Follow Up Promptly**
- Contact customers before due date
- Send reminders
- Don't be shy about asking for money

💡 **Monitor Aging**
- Track how long invoices are outstanding
- Contact customers with old invoices
- Write off bad debts if necessary

💡 **Set Credit Limits**
- Don't sell too much on credit
- Check customer payment history
- Reduce risk of bad debts

⚠️ **Verify Before Sending**
- Check invoice is correct
- Verify customer details
- Match with delivery/purchase order

### **Common Scenarios**

#### **Scenario 1: Customer Always Pays Late**

```
Customer XYZ Ltd always pays 15 days late

Current invoice: ৳75,000 due Jan 25
Expected payment: Feb 10

How to handle?

Option 1: Adjust terms
- Change from Net 30 to Net 15
- Invoice earlier in the month

Option 2: Accept and plan
- Record expected date as Feb 10
- Plan cash flow accordingly
- Follow up regularly

Option 3: Stop credit
- Request advance payment
- Cash on delivery only
- Reduce risk

Choose based on relationship and customer value
```

#### **Scenario 2: Customer Can't Pay Full Amount**

```
Customer owes ৳100,000 but says can only pay ৳60,000 now

What to do?

WRONG: Refuse partial payment
CORRECT:
1. Accept the ৳60,000 payment
2. Record partial payment
3. Create new invoice for remaining ৳40,000
4. Arrange new payment schedule
5. Get written agreement

✅ Some money is better than none
✅ Maintains customer relationship
✅ Clear documentation
```

#### **Scenario 3: Disputed Invoice**

```
Customer refuses to pay, says amount is wrong

You billed: ৳80,000
Customer says: Should be ৳60,000

What to do?

Step 1: Check your records
- Verify quantities delivered
- Check prices agreed
- Review contract/order

Step 2: Discuss with customer
- Explain your calculation
- Listen to their side
- Find the discrepancy

Step 3: Resolve
- If you're wrong: Send credit note, issue new invoice
- If they're wrong: Provide proof, request payment
- If unclear: Compromise, split the difference

✅ Professional approach
✅ Preserves relationship
✅ Fair resolution
```

#### **Scenario 4: Bad Debt (Uncollectible)**

```
Customer owes ৳50,000 for 6+ months
Not responding to calls/emails
Looks like you won't get paid

What to do?

Step 1: Try everything first
- Multiple reminders
- Call, email, visit
- Payment plan offer

Step 2: Write off as bad debt
- Record as bad debt expense
- Remove from Accounts Receivable
- For tax purposes

Step 3: Learn lesson
- Don't sell to this customer on credit
- Check customer creditworthiness
- Improve terms for new customers

⚠️ Last resort after all collection efforts failed
```

---

## **CHAPTER 9: JOURNAL ENTRIES**

### **URL:** `/finance/journal-entries`

### **What are Journal Entries?**

**Journal Entry = Manual accounting record to fix mistakes or make adjustments**

Think of it as:
> "Accounting tool to correct errors or record special transactions"

**Real-world examples:**
- Fix wrong category in old transaction
- Record depreciation
- Year-end adjustments
- Accrue expenses
- Correct accounting errors

### **Why Use Journal Entries?**

**When to use:**
- Fix mistakes in old records
- Record depreciation
- Make year-end adjustments
- Accrue expenses/revenue
- Allocate expenses

**⚠️ WARNING:**
- Journal entries are for accounting adjustments
- NOT for日常 transactions (use Transactions module)
- Require accounting knowledge
- Consult accountant if unsure

### **Debits and Credits (Brief Overview)**

**Simple rule:**

| Account Type | Debit (Dr) | Credit (Cr) |
|--------------|------------|-------------|
| **Assets** | Increase (+) | Decrease (-) |
| **Liabilities** | Decrease (-) | Increase (+) |
| **Equity** | Decrease (-) | Increase (+) |
| **Income** | Decrease (-) | Increase (+) |
| **Expenses** | Increase (+) | Decrease (-) |

**Every journal entry must balance:**
- Total Debits = Total Credits
- If not equal, entry is wrong

**Example:**
```
You recorded ৳50,000 expense but should have been ৳5,000

Wrong expense recorded: ৳50,000 (debit)
Correct amount: ৳5,000

Correcting entry:
  Debit: Expense - ৳5,000 (correct amount)
  Credit: Expense - ৳50,000 (remove wrong amount)
  Debit: Cash/Bank - ৳45,000 (refund difference)

OR simpler approach:
  Credit: Expense - ৳45,000 (reduce expense by ৳45,000)
  Debit: Cash/Bank - ৳45,000 (refund)
```

### **What You See**

The Journal Entries page shows all manual entries:

```
┌────────────────────────────────────────────────────────────────┐
│  📝 JOURNAL ENTRIES                          [+ Add Entry]      │
├────────────────────────────────────────────────────────────────┤
│  🔍 [Search...] [Date: This Month ▼] [Type: All ▼] [Export]  │
├──────┬──────────────┬────────────────┬────────────┬──────────┤
│ Date │ Entry #      │ Description    │   Debit   │  Credit  │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│15Jan │ JE-2024-001 │ Depreciation   │  ৳25,000  │  ৳25,000 │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│14Jan │ JE-2024-002 │ Correcting Err │  ৳40,000  │  ৳40,000 │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│13Jan │ JE-2024-003 │ Year-End Adj   │ ৳150,000  │ ৳150,000 │
├──────┼──────────────┼────────────────┼────────────┼──────────┤
│12Jan │ JE-2024-004 │ Accruals       │  ৳75,000  │  ৳75,000 │
├──────┴──────────────┴────────────────┴────────────┴──────────┤
│                  Total: ৳290,000  |  ৳290,000              │
└────────────────────────────────────────────────────────────────┘
```

### **Understanding Journal Entry Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Entry #** | Unique journal entry number | JE-2024-001 |
| **Date** | When entry is recorded | 15 Jan 2024 |
| **Debit** | Left side of entry | Asset/Expense increase |
| **Credit** | Right side of entry | Liability/Income increase |
| **Balanced** | Debits = Credits | Required for valid entry |
| **Reference** | Related document | Invoice #, Check # |

### **Common Journal Entry Types**

| Type | Purpose | Example |
|------|---------|---------|
| **Correcting Entry** | Fix mistake in old record | Wrong expense category |
| **Depreciation** | Record asset depreciation | Equipment, vehicles |
| **Accrual** | Record incurred but unpaid | Salary, rent accrual |
| **Prepayment** | Allocate prepaid expense | Insurance paid in advance |
| **Year-End** | Close accounts, adjust balances | Annual closing entries |
| **Reclassification** | Move amount between accounts | Expense to different category |

### **What You Can Do**

#### **1. Add Journal Entry**

**URL:** `/finance/journal-entries/create`

**⚠️ IMPORTANT:**
- Understand debits and credits first
- Know which accounts to use
- Verify entry balances
- Consult accountant if unsure

**Step-by-Step Form:**

```
┌────────────────────────────────────────────┐
│          ADD JOURNAL ENTRY                 │
├────────────────────────────────────────────┤
│ Entry Date: __/__/____                     │
│ (When does this entry apply?)              │
│                                            │
│ Reference: _____________________            │
│ (Optional - Related document number)       │
│                                            │
│ Description: _____________________         │
│ (Why are you making this entry?)           │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│ LINE ITEMS (Add at least 2)               │
│                                            │
│ Line 1:                                    │
│   Account: [Select Account ▼]              │
│   • Debit ☐  Credit ☐                     │
│   Amount: ৳ _____________                  │
│   Memo: _____________________               │
│                                            │
│ [+ Add Another Line]                       │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│ Total Debit: ৳ _______                    │
│ Total Credit: ৳ _______                   │
│ Status: ⚠️ Not Balanced                   │
│                                            │
│ Attachments: [Choose File]                 │
│                                            │
│              [Cancel]  [Save Entry]        │
└────────────────────────────────────────────┘
```

**Example 1: Correcting Entry - Wrong Expense Category**

```
Scenario: You recorded ৳20,000 as "Rent Expense" but it should be
"Utility Expense" (it was electricity bill payment)

Wrong:
  Rent Expense: ৳20,000 (debit) - WRONG!

Correction:
  Need to debit Utility Expense: ৳20,000
  Need to credit Rent Expense: ৳20,000

Step-by-Step:

1. Entry Date: 15/01/2024 (date of original transaction)
2. Reference: "CORR-001"
3. Description: "Correcting entry - Move ৳20,000 from Rent to Utility"

4. Line 1:
   Account: Utility Expense
   Debit: ☑ (checked)
   Amount: 20000
   Memo: "Correct category for electricity bill"

5. Click [+ Add Another Line]

6. Line 2:
   Account: Rent Expense
   Credit: ☑ (checked)
   Amount: 20000
   Memo: "Remove from wrong category"

7. Verify:
   Total Debit: ৳20,000
   Total Credit: ৳20,000
   Status: ✅ Balanced

8. Attachments: Upload original payment receipt
9. Click "Save Entry"

Result:
✅ Utility Expense increased by ৳20,000
✅ Rent Expense decreased by ৳20,000
✅ Accounts now correct
✅ Audit trail preserved
```

**Example 2: Depreciation Entry**

```
Scenario: Record monthly depreciation for office equipment
Cost: ৳600,000
Useful life: 5 years (60 months)
Monthly depreciation: ৳10,000

Accounting entry:
  Debit: Depreciation Expense ৳10,000
  Credit: Accumulated Depreciation ৳10,000

Step-by-Step:

1. Entry Date: 31/01/2024 (end of month)
2. Reference: "DEPR-01-2024"
3. Description: "Monthly depreciation - Office equipment"

4. Line 1:
   Account: Depreciation Expense
   Debit: ☑ (checked)
   Amount: 10000
   Memo: "Office equipment depreciation"

5. Click [+ Add Another Line]

6. Line 2:
   Account: Accumulated Depreciation - Equipment
   Credit: ☑ (checked)
   Amount: 10000
   Memo: "Monthly depreciation"

7. Verify: Balanced (৳10,000 each)
8. Click "Save Entry"

Result:
✅ Depreciation expense recorded
✅ Equipment book value reduced
✅ Proper accounting treatment
✅ Tax deduction recorded
```

**Example 3: Accrual Entry**

```
Scenario: Salary for last week of January ৳100,000 will be paid
in February, but needs to be recorded in January expenses

Accrual entry:
  Debit: Salary Expense ৳100,000 (January expense)
  Credit: Accrued Salaries ৳100,000 (Liability)

Step-by-Step:

1. Entry Date: 31/01/2024 (end of January)
2. Reference: "ACCRU-SAL-01"
3. Description: "Accrue salaries for last week of January"

4. Line 1:
   Account: Salary Expense
   Debit: ☑ (checked)
   Amount: 100000
   Memo: "January salaries to be paid in February"

5. Click [+ Add Another Line]

6. Line 2:
   Account: Accrued Salaries (or Salaries Payable)
   Credit: ☑ (checked)
   Amount: 100000
   Memo: "Accrued liability"

7. Verify: Balanced
8. Click "Save Entry"

Result:
✅ January expenses include all January salaries
✅ Liability recorded for amount to be paid
✅ Financial statements accurate
✅ When paid in February, reverse this entry
```

#### **2. View Journal Entry Details**

Click any entry to see details:

```
┌────────────────────────────────────────────┐
│  JOURNAL ENTRY DETAILS                     │
├────────────────────────────────────────────┤
│ Entry #: JE-2024-001                      │
│ Date: 15 January 2024                      │
│ Reference: CORR-001                        │
│                                            │
│ Description:                              │
│ Correcting entry - Move ৳20,000 from Rent  │
│ to Utility Expense                         │
│                                            │
│ LINE ITEMS:                                │
│ ─────────────────────────────────────────  │
│ 1. Utility Expense          Dr  ৳20,000   │
│    Correct category for electricity       │
│                                            │
│ 2. Rent Expense             Cr  ৳20,000   │
│    Remove from wrong category             │
│ ─────────────────────────────────────────  │
│       TOTAL                Dr  ৳20,000   │
│                            Cr  ৳20,000   │
│                                            │
│ Created by: Accountant                     │
│ Created at: 15/01/2024 4:30 PM            │
│                                            │
│ Attachments:                               │
│ 📄 Original_Payment_Receipt.pdf            │
│ 📄 Correction_Explanation.pdf              │
│                                            │
│ [Edit] [Delete] [Print] [Close]           │
└────────────────────────────────────────────┘
```

#### **3. Edit Journal Entry**

**When to edit:**
- Just created, noticed mistake
- Wrong amounts
- Wrong accounts

**How to edit:**
1. Click the entry
2. Click **[Edit]**
3. Make changes
4. Click **[Save Entry]**

⚠️ **Can edit only recent entries.** Old entries should be corrected with new entry.

#### **4. Delete Journal Entry**

⚠️ **BE VERY CAREFUL!**

**When you can delete:**
- Just created, wrong entry
- Before month-end close

**When you should NOT delete:**
- Old entries (affects closed periods)
- Entries already used in reports

**Better approach:** Make reversing entry instead of deleting

### **Journal Entry Best Practices**

💡 **Understand Before You Enter**
- Learn basic accounting
- Know debits/credits
- Consult accountant

💡 **Always Balance**
- Debits MUST equal credits
- System will warn if not balanced
- Unbalanced entries cause problems

💡 **Clear Descriptions**
- Explain WHY you made the entry
- Include reference documents
- Future auditors will thank you

💡 **Document Everything**
- Attach supporting documents
- Explain calculations
- Keep audit trail

💡 **Date Correctly**
- Use date of original transaction (for corrections)
- Use end of period (for accruals)
- Consistent accounting periods

⚠️ **Don't Use for Regular Transactions**
- Regular income/expenses → Use Transactions module
- Journal entries are for adjustments only

### **Common Scenarios**

#### **Scenario 1: Fixing Wrong Amount**

```
You recorded expense as ৳50,000 but should have been ৳5,000

WRONG: Delete the old transaction
CORRECT: Make correcting journal entry

Option A: Reduce the expense
  Credit: Expense Account ৳45,000
  Debit: Cash/Bank ৳45,000 (refund)

Option B: Reverse and re-enter
  Credit: Expense Account ৳50,000 (remove original)
  Debit: Cash/Bank ৳50,000 (reverse payment)
  Debit: Expense Account ৳5,000 (correct amount)
  Credit: Cash/Bank ৳5,000 (correct payment)

Option A is simpler - use it
```

#### **Scenario 2: Year-End Closing**

```
End of year, need to close expense accounts and transfer to
retained earnings

Typical entry:
  Debit: Income Summary ৳5,000,000 (total expenses)
    Credit: All expense accounts ৳5,000,000 (close them)

  Debit: All income accounts ৳8,000,000 (close them)
    Credit: Income Summary ৳8,000,000

  Debit: Income Summary ৳3,000,000 (profit)
    Credit: Retained Earnings ৳3,000,000

This:
✅ Closes temporary accounts
✅ Transfers net income to equity
✅ Prepares for new year

⚠️ Consult accountant for year-end entries
```

#### **Scenario 3: Prepaid Expense Allocation**

```
You paid ৳120,000 for 1-year insurance in January
This should be allocated over 12 months

Monthly allocation: ৳10,000 per month

January entry (already paid, just allocation):
  Debit: Insurance Expense ৳10,000
  Credit: Prepaid Insurance ৳10,000

Repeat monthly for 12 months

Result:
✅ Expense recognized monthly
✅ Proper matching principle
✅ Accurate financial statements
```

---

## CHAPTER 10: BUDGETS

### **URL:** `/finance/budgets`

### **What is a Budget?**

**Budget = A plan for how much money you expect to spend and earn**

Think of it as:
> "A spending plan for your business"

**Simple example:**
- You plan to spend 50,000৳ on marketing next month
- That's a "budget" for marketing
- At the end of the month, you compare what you actually spent vs what you planned

**Why have budgets?**
- Control spending
- Plan for the future
- Know if you're overspending
- Make better decisions
- Set goals for the business

### **What You See**

The Budgets page shows all your budget plans and how you're doing against them.

```
┌──────────┬──────────────────┬─────────────┬────────────┬──────────┬────────────┐
│   Name   │      Account    │   Budgeted  │   Actual   │ Variance│   Status   │
├──────────┼──────────────────┼─────────────┼────────────┼──────────┼────────────┤
│Marketing │ Marketing Expense│  100,000    │   85,000   │ +15,000  │   Active   │
│Rent      │ Rent Expense     │   25,000    │   25,000   │    0     │   Active   │
│Salaries  │ Salary Expense   │  500,000    │  520,000   │ -20,000  │   Active   │
│Utilities │ Utility Expense  │   50,000    │   45,000   │ + 5,000  │   Active   │
└──────────┴──────────────────┴─────────────┴────────────┴──────────┴────────────┘
```

### **Understanding Budget Terms**

| Term | What It Means | Example |
|------|---------------|---------|
| **Budgeted** | Planned amount | Plan to spend 100,000৳ |
| **Actual** | What you really spent | Actually spent 85,000৳ |
| **Variance** | Difference | Difference is +15,000৳ |
| **Positive Variance** | Good! Spent less than planned | +15,000 (under budget) |
| **Negative Variance** | Bad! Spent more than planned | -20,000 (over budget) |

**Reading the table:**

```
Marketing: Budget 100,000 | Actual 85,000 | Variance +15,000
Meaning: You planned to spend 100,000, but only spent 85,000.
Result: You saved 15,000! This is good.

Salaries: Budget 500,000 | Actual 520,000 | Variance -20,000
Meaning: You planned to spend 500,000, but spent 520,000.
Result: You overspent by 20,000! This is bad.
```

### **Budget Status Explained**

| Status | What It Means | Can You Edit? |
|--------|---------------|---------------|
| **Draft** | Still planning, not active yet | Yes, fully editable |
| **Active** | Currently being used | Limited editing |
| **Closed** | Period finished, locked | No editing (read-only) |

### **What You Can Do**

#### **1. Create New Budget**

**URL:** `/finance/budgets/create`

**When to create budget:**
- Starting a new fiscal year
- Planning for next month/quarter
- Setting spending limits
- Creating financial goals

**What You See (Create Budget Form):**

```
┌────────────────────────────────────────────┐
│          CREATE NEW BUDGET                 │
├────────────────────────────────────────────┤
│ Budget Name: _____________________          │
│ (e.g., "January 2024 Budget")             │
│                                            │
│ Account: [Select Account ▼]               │
│ (Which expense category?)                  │
│ Options:                                   │
│  • Rent Expense                            │
│  • Salary Expense                          │
│  • Marketing Expense                       │
│  • Utility Expense                         │
│  • Office Expense                          │
│                                            │
│ Budgeted Amount: ৳ _____________________    │
│ (How much do you plan to spend?)           │
│                                            │
│ Start Date: __/__/____                     │
│ (When does this budget start?)             │
│                                            │
│ End Date: __/__/____                       │
│ (When does this budget end?)               │
│                                            │
│ Period: [Dropdown ▼]                       │
│ Options:                                   │
│  • Monthly                                 │
│  • Quarterly                               │
│  • Yearly                                  │
│  • Custom                                  │
│                                            │
│ Notes: _____________________                │
│ (Any additional information)               │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Create Budget]     │
└────────────────────────────────────────────┘
```

**Example 1: Creating Monthly Marketing Budget**

```
Scenario: Plan marketing spending for January 2024

Step-by-Step:

1. Budget Name: "January 2024 Marketing Budget"
2. Account: Select "Marketing Expense"
3. Budgeted Amount: 100000
4. Start Date: 01/01/2024
5. End Date: 31/01/2024
6. Period: Select "Monthly"
7. Notes: "Facebook ads, Google ads, influencer marketing"
8. Is Active: Check the box
9. Click "Create Budget"

Result:
- Budget created for marketing
- Plan: Don't spend more than 100,000৳
- Can track actual spending vs budget
- Will show variance report
```

**Example 2: Creating Quarterly Office Budget**

```
Scenario: Plan office expenses for Q1 2024 (Jan-Mar)

Step-by-Step:

1. Budget Name: "Q1 2024 Office Expenses"
2. Account: Select "Office Expense"
3. Budgeted Amount: 75000 (25,000 per month × 3 months)
4. Start Date: 01/01/2024
5. End Date: 31/03/2024
6. Period: Select "Quarterly"
7. Notes: "Supplies, stationery, minor equipment"
8. Is Active: Check the box
9. Click "Create Budget"

Result:
- Quarterly budget created
- Average 25,000৳ per month
- Tracks total for 3 months
```

**Example 3: Creating Annual Salary Budget**

```
Scenario: Plan salary expenses for entire fiscal year

Step-by-Step:

1. Budget Name: "FY 2024-2025 Salary Budget"
2. Account: Select "Salary Expense"
3. Budgeted Amount: 6000000 (500,000 per month × 12 months)
4. Start Date: 01/07/2024
5. End Date: 30/06/2025
6. Period: Select "Yearly"
7. Notes: "15 staff × average 33,333/month"
8. Is Active: Check the box
9. Click "Create Budget"

Result:
- Annual salary budget created
- Helps with cash flow planning
- Track monthly vs annual
```

#### **2. View Budget vs Actual**

**Why compare?**
- See if you're on track
- Catch overspending early
- Make adjustments
- Learn from patterns

**What You See:**

```
┌───────────────────────────────────────────────────────┐
│       BUDGET VS ACTUAL - Marketing Expense            │
│       January 2024                                    │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Budgeted Amount:      100,000৳                       │
│  Actual Spent:         85,000৳                        │
│  Remaining:           15,000৳                         │
│  Percentage Used:     85%                             │
│                                                        │
│  Progress Bar:                                     │
│  [████████████████████░░░░] 85%                      │
│                                                        │
│  Variance:          +15,000৳ (Under budget)          │
│  Status:            ✅ On Track                       │
│                                                        │
└───────────────────────────────────────────────────────┘
```

**Understanding Variance:**

**Positive Variance (+15,000):**
- You spent LESS than planned
- This is GOOD
- You saved money
- Either:
  - You negotiated better prices
  - You spent less than expected
  - You didn't do everything planned

**Negative Variance (-20,000):**
- You spent MORE than planned
- This is BAD
- You overspent
- Either:
  - Prices increased
  - You did more than planned
  - Didn't control spending

**Zero Variance (0):**
- You spent EXACTLY what you planned
- Perfect!
- Rare in real life

#### **3. Budget Statistics**

**URL:** `/finance/budgets/statistics`

**What statistics show:**

```
┌─────────────────────────────────────────────────────┐
│          BUDGET STATISTICS                          │
│          January 2024                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Total Budgets:           15                         │
│  Active Budgets:          12                         │
│  Closed Budgets:           3                         │
│                                                      │
│  Total Budgeted Amount:   2,500,000৳                │
│  Total Actual Spent:      2,350,000৳                │
│                                                      │
│  Total Variance:          +150,000৳                  │
│  (Under budget overall - Good!)                      │
│                                                      │
│  Over Budget Items:       2                          │
│  Under Budget Items:      10                         │
│  On Budget Items:        0                          │
│                                                      │
│  Budget Performance:      94%                        │
│  (You've used 94% of total budget)                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Why statistics matter:**
- Overall health of spending
- Which areas need attention
- Track improvement over time
- Make better budgets next period

### **Budget vs Actual Report**

**URL:** `/finance/budgets/variance-report`

**What is variance report?**
Detailed comparison of all budgets vs actual spending.

**What You See:**

```
┌─────────────────────────────────────────────────────────────┐
│              VARIANCE REPORT                                │
│              January 2024                                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Account              │ Budget   │ Actual  │ Variance  │ %    │
├──────────────────────┼──────────┼─────────┼───────────┼──────┤
│  Marketing Expense   │ 100,000  │  85,000 │ +15,000   │ 85%  │
│  Rent Expense        │  25,000  │  25,000 │     0     │100%  │
│  Salary Expense      │ 500,000  │ 520,000 │ -20,000   │104%  │
│  Utility Expense     │  50,000  │  45,000 │ + 5,000   │ 90%  │
│  Office Expense      │  30,000  │  32,000 │ - 2,000   │107%  │
│  Travel Expense      │  20,000  │  18,000 │ + 2,000   │ 90%  │
│  Delivery Expense    │  40,000  │  42,000 │ - 2,000   │105%  │
│  Communication      │  15,000  │  15,000 │     0     │100%  │
├──────────────────────┼──────────┼─────────┼───────────┼──────┤
│  TOTALS              │ 780,000  │ 782,000 │ - 2,000   │100%  │
└─────────────────────────────────────────────────────────────┘
```

**How to read this report:**

**Marketing (85%):**
- Budget: 100,000
- Actual: 85,000
- Under budget by 15,000
- Only used 85% of budget
- ✅ Good performance

**Salary (104%):**
- Budget: 500,000
- Actual: 520,000
- Over budget by 20,000
- Used 104% of budget
- ⚠️ Over budget - investigate why

**Total (100%):**
- Overall exactly on budget
- Some areas over, some under
- Net effect: balanced

### **Analyzing Budget Variance**

**Why did we go over/under budget?**

**Questions to ask:**

**1. Under Budget (Good):**
- Did prices decrease?
- Did we not do everything planned?
- Did we find cheaper alternatives?
- Was budget too high?

**2. Over Budget (Bad):**
- Did prices increase?
- Did we do more than planned?
- Did unexpected expenses occur?
- Was budget too low?
- Was there waste/spending?

**3. On Budget (Perfect):**
- Was planning accurate?
- Did we control spending well?
- Can we repeat this?

### **Budget Best Practices**

💡 **Best Practices:**

1. **Be Realistic**
   - Don't set budgets too low
   - Consider historical spending
   - Account for inflation
   - Include buffer for unexpected

2. **Review Monthly**
   - Check budget vs actual
   - Adjust if needed
   - Catch problems early
   - Learn from variances

3. **Get Team Input**
   - Ask department heads
   - They know their needs
   - Creates ownership
   - More accurate budgets

4. **Use Past Data**
   - Look at last year's spending
   - Identify trends
   - Plan for seasonal changes
   - Better forecasting

5. **Allow Flexibility**
   - Some categories will go over
   - Others will be under
   - Total should balance
   - Adjust within year

⚠️ **Warnings:**

1. **Don't Set Too Tight**
   - Unrealistic budgets get ignored
   - Creates frustration
   - Staff may hide spending
   - Set achievable targets

2. **Don't Ignore Variances**
   - Investigate all over-budget items
   - Understand why under budget
   - Take corrective action
   - Learn and improve

3. **Don't Set and Forget**
   - Budgets need monitoring
   - Review regularly
   - Update when needed
   - Track progress

---

---

## CHAPTER 11: COST CENTERS

### **URL:** `/finance/cost-centers`

### **What is a Cost Center?**

**Cost Center = A department or section that tracks its own expenses**

Think of it as:
> "Separate expense tracking for each department"

**Simple example:**
- Marketing department spends money on ads
- Sales department spends money on travel
- IT department spends money on software
- Each is a "cost center"

**Why use cost centers?**
- See which departments spend most
- Hold departments accountable
- Allocate budgets by department
- Calculate profitability per department
- Identify inefficiencies

### **Cost Center vs Budget**

| Aspect | Budget | Cost Center |
|--------|--------|-------------|
| **What it tracks** | Expense categories | Departments |
| **Example** | Marketing Expense account | Marketing Department |
| **Focus** | Type of spending | Who is spending |
| **Purpose** | Control spending amounts | Track by department |

**Can use both together:**
- Budget: "Marketing Expense - 100,000৳ total"
- Cost Center: "Track marketing spending by Marketing Department"

### **What You See**

```
┌───────────┬──────────────┬─────────────┬──────────────┬────────────┬────────────┐
│   Code    │     Name     │  Budgeted   │   Actual     │  Remaining │   Status   │
├───────────┼──────────────┼─────────────┼──────────────┼────────────┼────────────┤
│ CC-MKT    │ Marketing    │  100,000    │   85,000     │   15,000   │   Active   │
│ CC-SLS    │ Sales        │   50,000    │   52,000     │   -2,000   │   Active   │
│ CC-IT     │ IT           │   30,000    │   28,000     │    2,000   │   Active   │
│ CC-HR     │ HR           │   20,000    │   20,000     │       0    │   Active   │
│ CC-OPS    │ Operations   │  200,000    │  195,000     │    5,000   │   Active   │
└───────────┴──────────────┴─────────────┴──────────────┴────────────┴────────────┘
```

### **What You Can Do**

#### **1. Create Cost Center**

**URL:** `/finance/cost-centers/create`

**When to create:**
- New department formed
- Want to track department expenses
- Need department-level reporting
- Allocate budgets to departments

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│       CREATE NEW COST CENTER               │
├────────────────────────────────────────────┤
│ Cost Center Code: _________                │
│ (Short code, e.g., "CC-MKT")               │
│                                            │
│ Cost Center Name: _____________________      │
│ (e.g., "Marketing Department")              │
│                                            │
│ Parent: [Dropdown ▼]                        │
│ (Optional - for hierarchy)                  │
│                                            │
│ Manager: [Dropdown ▼]                        │
│ (Who is responsible?)                       │
│                                            │
│ Budgeted Amount: ৳ _____________________    │
│ (Allocated budget)                          │
│                                            │
│ Start Date: __/__/____                     │
│ (Budget start date)                         │
│                                            │
│ End Date: __/__/____                       │
│ (Budget end date)                           │
│                                            │
│ Description: _____________________           │
│ (What does this department do?)             │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Create]            │
└────────────────────────────────────────────┘
```

**Example 1: Creating Marketing Cost Center**

```
Scenario: Create cost center for Marketing Department

Step-by-Step:

1. Cost Center Code: CC-MKT
2. Cost Center Name: Marketing Department
3. Parent: (leave blank)
4. Manager: Select "Rahim (Marketing Head)"
5. Budgeted Amount: 100000
6. Start Date: 01/01/2024
7. End Date: 31/12/2024
8. Description: "Handles all marketing, advertising, and promotions"
9. Is Active: Check the box
10. Click "Create"

Result:
- Marketing cost center created
- All marketing expenses can be tagged to this center
- Track spending against 100,000৳ budget
- Manager Rahim is responsible
```

**Example 2: Creating IT Cost Center**

```
Scenario: Create cost center for IT Department

Step-by-Step:

1. Cost Center Code: CC-IT
2. Cost Center Name: IT Department
3. Parent: (leave blank)
4. Manager: Select "Karim (IT Manager)"
5. Budgeted Amount: 30000
6. Start Date: 01/01/2024
7. End Date: 31/12/2024
8. Description: "Software, hardware, technical support"
9. Is Active: Check the box
10. Click "Create"

Result:
- IT cost center created
- Software purchases tagged to IT
- Hardware purchases tagged to IT
- Track IT spending separately
```

#### **2. Allocate Budget to Cost Center**

**Why allocate budgets?**
- Department spending limits
- Hold departments accountable
- Prevent overspending
- Track department performance

**How to allocate:**

```
Step 1: Find the cost center
Step 2: Click "Allocate Budget"
Step 3: Enter amount

Budget Allocation Form:
┌──────────────────────────────────────────┐
│     ALLOCATE BUDGET                       │
├──────────────────────────────────────────┤
│ Cost Center: Marketing Department         │
│                                          │
│ Current Budget: 100,000৳                  │
│                                          │
│ Additional Allocation: ৳ _________        │
│ (Adding more budget?)                     │
│                                          │
│ Reason: _____________________              │
│ (Why allocating more?)                    │
│                                          │
│        [Cancel]  [Allocate Budget]        │
└──────────────────────────────────────────┘

Result:
- Budget increased
- Department can spend more
- Track why allocation was made
```

**Example: Additional Budget Allocation**

```
Scenario: Marketing needs extra budget for year-end campaign

Current budget: 100,000৳
Additional: 50,000৳
Reason: "Year-end promotional campaign"

After allocation:
- New budget: 150,000৳
- Marketing can spend more
- Reason documented for audit trail
```

#### **3. View Cost Center Expenses**

**See what each department is spending**

**What You See:**

```
┌─────────────────────────────────────────────────────┐
│     EXPENSES - Marketing Department                  │
│     January 2024                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Date        │ Description          │ Amount        │
├──────────────┼──────────────────────┼───────────────┤
│  Jan 05      │ Facebook Ads         │  30,000       │
│  Jan 10      │ Google Ads           │  25,000       │
│  Jan 15      │ Influencer Marketing  │  20,000       │
│  Jan 20      │ Print Materials       │  10,000       │
│  Jan 25      │ Event Sponsorship    │   5,000       │
├──────────────┴──────────────────────┴───────────────┤
│  TOTAL                              │  90,000       │
└─────────────────────────────────────────────────────┘

Budget: 100,000৳
Spent: 90,000৳ (90%)
Remaining: 10,000৳
```

#### **4. Cost Center Statistics**

**URL:** `/finance/cost-centers/statistics`

**What statistics show:**

```
┌─────────────────────────────────────────────────────┐
│          COST CENTER STATISTICS                     │
│          January 2024                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Total Cost Centers:       5                        │
│  Active:                   5                        │
│  Inactive:                 0                        │
│                                                      │
│  Total Budget Allocated:   400,000৳                │
│  Total Actual Spent:      380,000৳                 │
│  Total Remaining:          20,000৳                 │
│                                                      │
│  Over Budget Centers:     1 (Sales)                │
│  Under Budget Centers:    4 (Others)               │
│                                                      │
│  Highest Spending:        Operations (195,000৳)    │
│  Lowest Spending:         HR (20,000৳)             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Cost Center Best Practices**

💡 **Best Practices:**

1. **Clear Department Definition**
   - Each cost center = one department
   - No overlapping responsibilities
   - Clear reporting lines

2. **Appropriate Budget Levels**
   - Based on historical spending
   - Consider department needs
   - Include growth plans
   - Seasonal variations

3. **Regular Review**
   - Monthly spending review
   - Compare with budget
   - Adjust if necessary
   - Hold managers accountable

4. **Manager Responsibility**
   - One manager per cost center
   - They control spending
   - They report on performance
   - They are accountable

⚠️ **Warnings:**

1. **Don't Create Too Many**
   - Too many = hard to manage
   - Group related activities
   - Keep it simple

2. **Don't Overlap**
   - One expense = one cost center
   - Avoid double-counting
   - Clear ownership

3. **Don't Ignore**
   - Review cost center reports
   - Address over-budget situations
   - Understand variances

---

## CHAPTER 12: PROJECTS

### **URL:** `/finance/projects`

### **What is Project Accounting?**

**Project Accounting = Tracking finances for specific projects**

Think of it as:
> "Each project has its own mini profit/loss statement"

**Simple example:**
- Website development project
- Client: ABC Corp
- Budget: 500,000৳
- Income: 800,000৳
- Expenses: 600,000৳
- Profit: 200,000৳

**Why track projects separately?**
- Know which projects are profitable
- Bid accurately on future projects
- Identify problem projects early
- Track project progress financially
- Make better project decisions

### **Project vs Cost Center**

| Aspect | Cost Center | Project |
|--------|-------------|---------|
| **Duration** | Ongoing | Temporary |
| **Purpose** | Department tracking | Client/Job tracking |
| **Example** | Marketing Department | Website for ABC Corp |
| **Budget** | Annual | Project-specific |

### **What You See**

```
┌───────────┬──────────────────┬───────────┬──────────┬──────────┬────────────┐
│   Code    │      Name        │  Budget   │  Actual   │  Profit  │   Status   │
├───────────┼──────────────────┼───────────┼──────────┼──────────┼────────────┤
│ PRJ-001   │ Website Redesign │  500,000  │  600,000 │ 200,000  │  Active    │
│ PRJ-002   │ Mobile App       │ 1,200,000 │  900,000 │      -200,000│  Active    │
│ PRJ-003   │ E-commerce Setup  │  800,000  │  750,000 │  50,000  │ Completed  │
│ PRJ-004   │ CRM Integration   │  300,000  │  150,000 │ Pending  │  In Progress│
└───────────┴──────────────────┴───────────┴──────────┴──────────┴────────────┘
```

### **Understanding Project Status**

| Status | What It Means |
|--------|---------------|
| **Planning** | Project being planned, not started |
| **In Progress** | Currently working on project |
| **On Hold** | Temporarily paused |
| **Completed** | Finished successfully |
| **Cancelled** | Terminated before completion |

### **What You Can Do**

#### **1. Create New Project**

**URL:** `/finance/projects/create`

**When to create:**
- Starting new client project
- Internal project initiated
- Need to track project profitability
- Job-based work

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│          CREATE NEW PROJECT                │
├────────────────────────────────────────────┤
│ Project Code: _________                    │
│ (e.g., "PRJ-001")                          │
│                                            │
│ Project Name: _____________________         │
│ (e.g., "Website Development for ABC Corp") │
│                                            │
│ Customer: [Dropdown ▼]                      │
│ (Which client?)                             │
│                                            │
│ Start Date: __/__/____                     │
│                                            │
│ End Date: __/__/____                       │
│ (Expected completion)                       │
│                                            │
│ Budgeted Amount: ৳ _____________________    │
│ (Expected expenses)                         │
│                                            │
│ Expected Revenue: ৳ _____________________  │
│ (How much will client pay?)                 │
│                                            │
│ Manager: [Dropdown ▼]                       │
│ (Who is responsible?)                       │
│                                            │
│ Description: _____________________          │
│ (Project details)                           │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Create Project]     │
└────────────────────────────────────────────┘
```

**Example 1: Creating Website Project**

```
Scenario: New website development project for client

Step-by-Step:

1. Project Code: PRJ-001
2. Project Name: "Website Redesign - ABC Corp"
3. Customer: Select "ABC Corporation"
4. Start Date: 01/01/2024
5. End Date: 31/03/2024 (3 months)
6. Budgeted Amount: 500000 (expected expenses)
7. Expected Revenue: 800000 (client will pay)
8. Manager: Select "Project Manager - Rahim"
9. Description: "Complete website redesign with e-commerce functionality"
10. Is Active: Check the box
11. Click "Create Project"

Result:
- Project created
- Expected profit: 300,000৳ (800K - 500K)
- Track all project expenses
- Track all project revenue
- Monitor profitability
```

**Example 2: Creating Internal Project**

```
Scenario: Internal office renovation project

Step-by-Step:

1. Project Code: PRJ-INT-001
2. Project Name: "Office Renovation 2024"
3. Customer: Select "Internal" (or leave blank)
4. Start Date: 01/02/2024
5. End Date: 28/02/2024
6. Budgeted Amount: 200000
7. Expected Revenue: 0 (internal project)
8. Manager: Select "Operations Manager"
9. Description: "Office renovation, new furniture, painting"
10. Is Active: Check the box
11. Click "Create Project"

Result:
- Internal project created
- Track renovation costs
- No revenue (expense only)
- Compare actual vs budget
```

#### **2. Track Project Expenses**

**Record expenses to specific project**

```
When recording expense:
1. Create expense as normal
2. Select project from dropdown
3. Save

Example:
Expense: Software License - 25,000৳
Project: PRJ-001 (Website Redesign)

Result:
- Expense recorded
- Charged to project
- Project actual expenses: +25,000৳
- Project profitability updated
```

#### **3. Calculate Project Profitability**

**URL:** `/finance/projects/{id}/profitability`

**What profitability shows:**

```
┌─────────────────────────────────────────────────────┐
│     PROJECT PROFITABILITY REPORT                    │
│     Project: PRJ-001 - Website Redesign              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Budgeted Revenue:              800,000৳            │
│  Actual Revenue:                800,000৳            │
│                                                      │
│  Budgeted Expenses:            500,000৳            │
│  Actual Expenses:              600,000৳            │
│  ┌────────────────────────────────────────┐        │
│  │ Developer Salaries     │  300,000    │        │
│  │ Software Licenses      │   50,000    │        │
│  │ Hosting & Domain       │   10,000    │        │
│  │ Project Management     │   40,000    │        │
│  │ Other Expenses          │  200,000    │        │
│  └────────────────────────────────────────┘        │
│                                                      │
│  ACTUAL PROFIT:                 200,000৳            │
│  Profit Margin:                   25%               │
│                                                      │
│  Status: ✅ Profitable                             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Understanding Profit Margin:**

```
Profit Margin = (Profit / Revenue) × 100

Example:
Profit: 200,000৳
Revenue: 800,000৳
Margin: (200,000 / 800,000) × 100 = 25%

Meaning: For every 100৳ earned, 25৳ is profit
```

#### **4. Update Project Progress**

**Track project completion**

```
Step 1: Find project
Step 2: Click "Update Progress"
Step 3: Enter percentage

Progress Update Form:
┌──────────────────────────────────────────┐
│     UPDATE PROJECT PROGRESS               │
├──────────────────────────────────────────┤
│ Project: Website Redesign                 │
│                                          │
│ Current Progress: 75%                     │
│ [━━━━━━━━━━━━━━━━━━░░░░░]               │
│                                          │
│ New Progress: ━━━━━━━━○━━━━━━ 80%       │
│                                          │
│ Notes: _____________________              │
│ (What's been completed?)                  │
│                                          │
│        [Cancel]  [Update Progress]        │
└──────────────────────────────────────────┘

Result:
- Progress updated
- Financial forecast adjusted
- Stakeholders informed
```

### **Project Best Practices**

💡 **Best Practices:**

1. **Clear Project Scope**
   - Define what's included
   - Define what's excluded
   - Avoid scope creep
   - Document changes

2. **Accurate Budgeting**
   - Include all costs
   - Add contingency buffer
   - Consider timeline
   - Account for risks

3. **Regular Tracking**
   - Update expenses weekly
   - Monitor progress
   - Compare budget vs actual
   - Adjust forecasts

4. **Profitability Reviews**
   - Review monthly
   - Identify issues early
   - Take corrective action
   - Document lessons learned

⚠️ **Warnings:**

1. **Don't Mix Projects**
   - One expense = one project
   - Don't allocate across multiple projects
   - Creates confusion

2. **Don't Forget Indirect Costs**
   - Include project management time
   - Include overhead allocation
   - Include shared resources
   - True cost is higher than direct costs

3. **Don't Ignore Red Flags**
   - Budget overruns
   - Timeline delays
   - Scope changes
   - Address immediately

---

## CHAPTER 13: FISCAL YEARS

### **URL:** `/finance/fiscal-years`

### **What is a Fiscal Year?**

**Fiscal Year = Financial year for your business**

Think of it as:
> "A 12-month period for financial reporting"

**Simple example:**
- Calendar year: January to December
- Fiscal year: July to June (common in Bangladesh)
- Your business can choose any 12-month period

**Why have fiscal years?**
- Organized financial reporting
- Tax filing requirements
- Year-over-year comparisons
- Budget cycles
- Business planning

**Fiscal Year vs Calendar Year:**

| Type | Period | Common For |
|------|--------|------------|
| **Calendar Year** | Jan-Dec | Small businesses |
| **Fiscal Year** | Jul-Jun (Bangladesh) | Corporations, govt |
| **Custom** | Any 12 months | Seasonal businesses |

### **What You See**

```
┌──────────────┬──────────────┬──────────────┬────────────┬────────────┐
│     Name     │  Start Date  │   End Date   │   Status   │  Actions   │
├──────────────┼──────────────┼──────────────┼────────────┼────────────┤
│ FY 2023-2024 │  01-Jul-2023 │  30-Jun-2024 │   Closed   │ [View]     │
│ FY 2024-2025 │  01-Jul-2024 │  30-Jun-2025 │   Active   │[View][Edit]│
│ FY 2025-2026 │  01-Jul-2025 │  30-Jun-2026 │   Upcoming │ [View]     │
└──────────────┴──────────────┴──────────────┴────────────┴────────────┘
```

### **Fiscal Year Status Explained**

| Status | What It Means | Can You Record? |
|--------|---------------|-----------------|
| **Upcoming** | Future period, not started | No |
| **Active** | Current period, recording | Yes |
| **Closed** | Finished, locked | No (read-only) |

### **What You Can Do**

#### **1. Create Fiscal Year**

**URL:** `/finance/fiscal-years/create`

**When to create:**
- Business setup
- Before first year ends
- Planning future years

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│       CREATE NEW FISCAL YEAR               │
├────────────────────────────────────────────┤
│ Year Name: _____________________             │
│ (e.g., "FY 2024-2025")                    │
│                                            │
│ Start Date: __/__/____                     │
│ (First day of fiscal year)                 │
│                                            │
│ End Date: __/__/____                       │
│ (Last day of fiscal year)                   │
│                                            │
│ Is Active: ☑                               │
│ (Activate this year now?)                   │
│                                            │
│ Notes: _____________________                │
│                                            │
│              [Cancel]  [Create]            │
└────────────────────────────────────────────┘
```

**Example 1: Creating Fiscal Year**

```
Scenario: Setup fiscal year 2024-2025

Step-by-Step:

1. Year Name: "FY 2024-2025"
2. Start Date: 01/07/2024
3. End Date: 30/06/2025
4. Is Active: Check (if this is current year)
5. Notes: "Standard fiscal year July to June"
6. Click "Create"

Result:
- Fiscal year created
- 12-month period defined
- All transactions will be tagged to this year
- Reports will use this period
```

#### **2. Close Fiscal Year**

**⚠️ IMPORTANT:**
> Closing a fiscal year is PERMANENT. You cannot edit transactions after closing.

**When to close:**
- Year-end procedures complete
- All transactions recorded
- Reconciliation done
- Reports generated
- Accountant approval

**How to close:**

```
Step 1: Go to fiscal year
Step 2: Click "Close Year"
Step 3: Confirm

Close Year Confirmation:
┌──────────────────────────────────────────┐
│         CLOSE FISCAL YEAR                 │
├──────────────────────────────────────────┤
│ Year: FY 2024-2025                        │
│                                          │
⚠️  WARNING:                               │
│                                          │
│ You are about to close the entire fiscal  │
│ year. After closing:                      │
│                                          │
│ • NO new transactions can be recorded     │
│ • NO existing transactions can be edited  │
│ • Year is LOCKED permanently              │
│                                          │
│ Make sure:                                │
│ ✓ All transactions are recorded          │
│ ✓ Bank reconciliation is complete        │
│ ✓ Reports are generated                  │
│ ✓ Backup is taken                        │
│                                          │
│ Enter "CLOSE" to confirm: _________      │
│                                          │
│        [Cancel]  [Close Year]             │
└──────────────────────────────────────────┘

Result:
- Fiscal year closed
- Cannot add/edit transactions
- All reports finalized
- Opening balances carried forward
```

#### **3. Reopen Fiscal Year**

**When to reopen:**
- Found mistake after closing
- Auditor requires adjustment
- Forgotten transaction discovered

**How to reopen:**

```
Step 1: Find closed fiscal year
Step 2: Click "Reopen"
Step 3: Confirm

Result:
- Fiscal year reopened
- Can add/edit transactions
- Previous closing reversed
```

⚠️ **Warning:**
> Reopening should be rare. Only do when absolutely necessary.

#### **4. View Fiscal Year Summary**

**URL:** `/finance/fiscal-years/{id}/summary`

**What summary shows:**

```
┌─────────────────────────────────────────────────────┐
│     FISCAL YEAR SUMMARY                              │
│     FY 2024-2025                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Period: July 1, 2024 - June 30, 2025              │
│  Status: Active                                     │
│                                                      │
│  Total Transactions:         1,250                   │
│  Total Revenue:              5,000,000৳             │
│  Total Expenses:             3,500,000৳             │
│  Net Profit:                 1,500,000৳             │
│                                                      │
│  By Month:                                           │
│  ┌──────────┬─────────┬───────────┬──────────┐      │
│  │ Month    │ Revenue │ Expenses  │  Profit  │      │
│  ├──────────┼─────────┼───────────┼──────────┤      │
│  │ Jul 2024 │ 400,000 │  280,000  │ 120,000  │      │
│  │ Aug 2024 │ 420,000 │  290,000  │ 130,000  │      │
│  │ Sep 2024 │ 450,000 │  300,000  │ 150,000  │      │
│  │ ...      │   ...   │    ...    │   ...    │      │
│  └──────────┴─────────┴───────────┴──────────┘      │
│                                                      │
│  Best Month: March (Profit: 200,000৳)              │
│  Worst Month: January (Profit: 80,000৳)            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Fiscal Year Best Practices**

💡 **Best Practices:**

1. **Consistent Period**
   - Use same period every year
   - Don't change fiscal year dates
   - Industry-standard if possible

2. **Year-End Procedures**
   - Complete reconciliation
   - Generate all reports
   - Take backups
   - Get accountant approval

3. **Plan Ahead**
   - Create next year before current ends
   - No gaps between years
   - Smooth transition

4. **Review Before Closing**
   - Check all transactions
   - Verify balances
   - Run trial balance
   - Ensure everything recorded

⚠️ **Warnings:**

1. **Don't Close Too Early**
   - All transactions recorded?
   - Reconciliation complete?
   - Reports generated?
   - Once closed, cannot edit

2. **Don't Overlap Years**
   - One transaction = one fiscal year
   - Clear boundaries
   - No gaps, no overlaps

3. **Don't Change Dates**
   - Set once, use forever
   - Changing creates confusion
   - Affects year-over-year comparison

---

## CHAPTER 14: FIXED ASSETS

### **URL:** `/finance/fixed-assets`

### **What are Fixed Assets?**

**Fixed Assets = Long-term valuable items your business owns**

Think of it as:
> "Big expensive items that last for years, not consumed immediately"

**Examples:**
- Buildings
- Vehicles
- Machinery
- Equipment
- Computers
- Furniture

**What's NOT a fixed asset:**
- Office supplies (used quickly)
- Inventory (for resale)
- Small tools (under threshold)

**Why track fixed assets?**
- Know what you own
- Calculate depreciation
- Insurance requirements
- Asset valuation
- Replacement planning

### **Depreciation Explained**

**Depreciation = Loss of value over time**

**Simple example:**
- Buy computer for 50,000৳
- Lasts 5 years
- Loses 10,000৳ value each year
- After 5 years, worth 0৳

**Why calculate depreciation?**
- Expense spread over useful life
- Tax deduction
- True asset value on balance sheet
- Plan for replacement

### **What You See**

```
┌──────┬─────────────────┬────────────┬────────────┬──────────┬────────────┐
│  ID  │     Name        │   Cost      │Depreciated │ Net Value │   Status   │
├──────┼─────────────────┼────────────┼────────────┼──────────┼────────────┤
│ FA001│ Office Laptop   │  50,000    │  30,000    │  20,000  │  In Use    │
│ FA002│ Delivery Van    │ 800,000    │ 400,000    │ 400,000  │  In Use    │
│ FA003│ Office Furniture│ 200,000    │ 180,000    │  20,000  │  In Use    │
│ FA004│ Old Printer     │  15,000    │  15,000    │       0  │ Fully Depr.│
│ FA005│ AC Unit         │  40,000    │   8,000    │  32,000  │  In Use    │
└──────┴─────────────────┴────────────┴────────────┴──────────┴────────────┘
```

### **Understanding Asset Values**

| Term | What It Means | Example |
|------|---------------|---------|
| **Cost** | Purchase price | Bought for 50,000৳ |
| **Depreciated** | Total depreciation to date | Depreciated 30,000৳ over 3 years |
| **Net Value** | Current worth | 50,000 - 30,000 = 20,000৳ |
| **Fully Depreciated** | Depreciated to zero | Worth 0৳ on books |

### **Asset Lifecycle**

```
1. PURCHASE
   ↓
   Asset bought and added to system
   Cost recorded

2. IN USE
   ↓
   Being used in business
   Depreciation calculated each period

3. PARTIALLY DEPRECIATED
   ↓
   Some value remaining
   Still in use

4. FULLY DEPRECIATED
   ↓
   Net value = 0
   May still be in use

5. DISPOSAL
   ↓
   Sold, scrapped, or discarded
   Removed from asset register
```

### **What You Can Do**

#### **1. Add Fixed Asset**

**URL:** `/finance/fixed-assets/create`

**When to add:**
- Purchased new equipment
- Acquired vehicles
- Bought property
- Any long-term asset

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│          ADD FIXED ASSET                   │
├────────────────────────────────────────────┤
│ Asset Name: _____________________            │
│ (e.g., "Office Laptop - Dell XPS")         │
│                                            │
│ Category: [Dropdown ▼]                     │
│ Options:                                   │
│  • Computers & IT Equipment                │
│  • Furniture & Fixtures                    │
│  • Vehicles                                │
│  • Machinery                               │
│  • Buildings                               │
│  • Equipment                               │
│                                            │
│ Purchase Date: __/__/____                  │
│ (When did you buy it?)                     │
│                                            │
│ Purchase Cost: ৳ _____________________      │
│ (How much did you pay?)                    │
│                                            │
│ Useful Life (years): ___                   │
│ (How long will it last?)                   │
│                                            │
│ Salvage Value: ৳ _____________________      │
│ (Value at end of life - can be 0)         │
│                                            │
│ Depreciation Method: [Dropdown ▼]          │
│ Options:                                   │
│  • Straight Line (even amount each year)   │
│  • Reducing Balance (more in early years)   │
│                                            │
│ Location: _____________________             │
│ (Where is this asset?)                      │
│                                            │
│ Responsible: [Dropdown ▼]                   │
│ (Who is using/maintaining it?)              │
│                                            │
│ Notes: _____________________                │
│                                            │
│ Is Active: ☑                               │
│                                            │
│              [Cancel]  [Add Asset]         │
└────────────────────────────────────────────┘
```

**Example 1: Adding Computer**

```
Scenario: Bought laptop for office use

Step-by-Step:

1. Asset Name: "Office Laptop - Dell XPS 15"
2. Category: Select "Computers & IT Equipment"
3. Purchase Date: 15/01/2024
4. Purchase Cost: 50000
5. Useful Life: 5 years
6. Salvage Value: 0
7. Depreciation Method: Straight Line
8. Location: "Head Office - 2nd Floor"
9. Responsible: Select "Rahim (IT Manager)"
10. Notes: "Assigned to Sales Department"
11. Is Active: Check the box
12. Click "Add Asset"

Result:
- Asset added to register
- Cost: 50,000৳
- Annual depreciation: 10,000৳ (50,000 ÷ 5 years)
- Monthly depreciation: 833৳

Depreciation schedule:
Year 1: 10,000৳ | Net value: 40,000৳
Year 2: 10,000৳ | Net value: 30,000৳
Year 3: 10,000৳ | Net value: 20,000৳
Year 4: 10,000৳ | Net value: 10,000৳
Year 5: 10,000৳ | Net value: 0৳
```

**Example 2: Adding Vehicle**

```
Scenario: Bought delivery van for business

Step-by-Step:

1. Asset Name: "Delivery Van - Toyota HiAce"
2. Category: Select "Vehicles"
3. Purchase Date: 01/01/2024
4. Purchase Cost: 800000
5. Useful Life: 10 years
6. Salvage Value: 50000 (expected resale value)
7. Depreciation Method: Straight Line
8. Location: "Warehouse"
9. Responsible: Select "Transport Manager"
10. Notes: "Used for deliveries in Dhaka area"
11. Is Active: Check the box
12. Click "Add Asset"

Result:
- Asset added
- Cost: 800,000৳
- Salvage: 50,000৳
- Depreciable amount: 750,000৳ (800,000 - 50,000)
- Annual depreciation: 75,000৳ (750,000 ÷ 10 years)
```

**Example 3: Adding Office Furniture**

```
Scenario: Bought office furniture

Step-by-Step:

1. Asset Name: "Office Furniture Set"
2. Category: Select "Furniture & Fixtures"
3. Purchase Date: 10/01/2024
4. Purchase Cost: 200000
5. Useful Life: 10 years
6. Salvage Value: 0
7. Depreciation Method: Straight Line
8. Location: "Head Office"
9. Responsible: Select "Admin Manager"
10. Notes: "Desks, chairs, cabinets for 10 staff"
11. Is Active: Check the box
12. Click "Add Asset"

Result:
- Asset added
- Annual depreciation: 20,000৳
- Monthly: 1,667৳
```

#### **2. Update Depreciation**

**Record depreciation regularly**

```
Step 1: Go to Fixed Assets
Step 2: Click "Update Depreciation All"
Step 3: Select period

Depreciation Update:
┌──────────────────────────────────────────┐
│     UPDATE DEPRECIATION                   │
├──────────────────────────────────────────┤
│ Period: January 2024                      │
│                                          │
│ Assets to update: 15                     │
│                                          │
│ Total depreciation: 125,000৳              │
│                                          │
│ This will record depreciation expense     │
│ and update all asset net values.         │
│                                          │
│        [Cancel]  [Update Depreciation]    │
└──────────────────────────────────────────┘

Result:
- All assets updated
- Depreciation expense recorded
- Net values reduced
- Can be reversed if mistake
```

#### **3. Dispose Asset**

**When asset is sold, scrapped, or no longer used**

```
Step 1: Find asset
Step 2: Click "Dispose"
Step 3: Enter disposal details

Disposal Form:
┌──────────────────────────────────────────┐
│          DISPOSE ASSET                   │
├──────────────────────────────────────────┤
│ Asset: Office Laptop - Dell XPS           │
│ Net Value: 20,000৳                        │
│                                          │
│ Disposal Date: __/__/____                │
│                                          │
│ Disposal Type: [Dropdown ▼]               │
│  • Sold                                   │
│  • Scrapped                                │
│  • Lost/Stolen                             │
│  • Donated                                │
│                                          │
│ Sale Value: ৳ _________ (if sold)        │
│                                          │
│ Notes: _____________________              │
│                                          │
│        [Cancel]  [Dispose Asset]          │
└──────────────────────────────────────────┘

Example 1: Sold asset

Disposal Type: Sold
Sale Value: 25,000৳
Net Value: 20,000৳
Gain: 5,000৳ (Sold for more than book value)

Result:
- Asset removed from register
- Gain recorded: 5,000৳
- Cash/bank increased: 25,000৳

Example 2: Scrapped asset

Disposal Type: Scrapped
Sale Value: 0
Net Value: 20,000৳
Loss: 20,000৳ (Asset worth 20,000, got nothing)

Result:
- Asset removed
- Loss recorded: 20,000৳
- No cash received
```

### **Fixed Asset Best Practices**

💡 **Best Practices:**

1. **Track Everything**
   - Add asset immediately when purchased
   - Don't wait until year-end
   - Keep all documentation

2. **Correct Useful Life**
   - Based on experience
   - Industry standards
   - Asset quality
   - Usage patterns

3. **Regular Updates**
   - Update depreciation monthly/quarterly
   - Don't wait until year-end
   - Keeps records current

4. **Physical Verification**
   - Count assets annually
   - Verify location
   - Check condition
   - Update records

⚠️ **Warnings:**

1. **Don't Expense Large Items**
   - Must be fixed asset
   - If long-term and valuable
   - Don't record as expense

2. **Don't Forget Small Assets**
   - Have asset threshold (e.g., 5,000৳)
   - Below threshold = expense
   - Above threshold = fixed asset

3. **Don't Ignore Disposal**
   - Remove sold assets
   - Remove scrapped assets
   - Keep register current

---

## CHAPTER 15: CHEQUES

### **URL:** `/finance/cheques`

### **What are Cheques?**

**Cheque = Written instruction to bank to pay money**

Think of it as:
> "Paper promise to pay, but payment happens later"

**Types of cheques:**
- **Post-dated cheques:** Dated for future
- **Outstanding cheques:** Given but not yet cashed
- **Bounced cheques:** Returned unpaid (insufficient funds)

**Why track cheques separately?**
- Know which payments are pending
- Plan cash flow (money will leave later)
- Prevent bounced cheques
- Track cheque status

### **Cheque Lifecycle**

```
1. ISSUE
   ↓
   Cheque written and given to receiver

2. OUTSTANDING
   ↓
   Receiver has cheque, not yet deposited
   Money still in your account

3. DEPOSITED
   ↓
   Receiver deposits in their bank
   Money still in your account (clearing)

4. CLEARED
   ↓
   Bank transfers money
   Money leaves your account
   Cheque fulfilled

5. BOUNCED (if problem)
   ↓
   Bank returns cheque unpaid
   Insufficient funds or other issue
```

### **What You See**

```
┌──────┬──────────────┬─────────────┬────────────┬──────────┬────────────┐
│  No. │   Pay To    │   Amount    │   Date     │  Status  │  Actions   │
├──────┼──────────────┼─────────────┼────────────┼──────────┼────────────┤
│ 001  │ Rahman       │   15,000    │ 15-Jan-2024│ Outstanding│ [View][Cancel]│
│ 002  │ ABC Corp     │   50,000    │ 20-Jan-2024│ Deposited│ [View]     │
│ 003  │ Supplier Inc │  100,000    │ 25-Jan-2024│ Cleared  │ [View]     │
│ 004  │ XYZ Ltd      │   25,000    │ 01-Feb-2024│ Bounced  │ [View][Reissue]│
└──────┴──────────────┴─────────────┴────────────┴──────────┴────────────┘
```

### **Cheque Status Explained**

| Status | What It Means | Action Needed |
|--------|---------------|---------------|
| **Draft** | Cheque created but not given | Issue when ready |
| **Outstanding** | Given, not yet deposited | Monitor, ensure funds |
| **Deposited** | Receiver deposited | Wait for clearance |
| **Cleared** | Payment complete | No action |
| **Bounced** | Payment failed | Fix and reissue |
| **Cancelled** | Stopped before deposit | No longer valid |

### **What You Can Do**

#### **1. Record New Cheque**

**URL:** `/finance/cheques/create`

**When to record:**
- Issuing post-dated cheque
- Receiving post-dated cheque
- Tracking future payments

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│          RECORD NEW CHEQUE                 │
├────────────────────────────────────────────┤
│ Cheque Number: _________                   │
│ (Cheque number from leaf)                  │
│                                            │
│ Type: [Dropdown ▼]                          │
│  • Issue (you're giving cheque)            │
│  • Receive (you're getting cheque)          │
│                                            │
│ Pay To: _____________________                │
│ (Who is the cheque for?)                    │
│                                            │
│ Amount: ৳ _____________________              │
│                                            │
│ Cheque Date: __/__/____                    │
│ (Date written on cheque)                   │
│                                            │
│ Due Date: __/__/____                       │
│ (When can it be deposited?)                 │
│                                            │
│ Bank Account: [Dropdown ▼]                  │
│ (Which bank account?)                       │
│                                            │
│ Reference: _____________________             │
│ (Invoice number or reason)                  │
│                                            │
│ Notes: _____________________                 │
│                                            │
│              [Cancel]  [Record Cheque]      │
└────────────────────────────────────────────┘
```

**Example 1: Issuing Post-Dated Cheque**

```
Scenario: Pay supplier with post-dated cheque

Step-by-Step:

1. Cheque Number: 001
2. Type: Select "Issue"
3. Pay To: "ABC Corporation"
4. Amount: 50000
5. Cheque Date: 15/01/2024 (today)
6. Due Date: 15/02/2024 (can deposit after this date)
7. Bank Account: Select "Brac Bank"
8. Reference: "BILL-2024-123"
9. Notes: "Payment for invoice #123"
10. Click "Record Cheque"

Result:
- Cheque recorded
- Status: Outstanding
- Money still in account
- Reminder: Ensure funds on Feb 15
```

**Example 2: Receiving Post-Dated Cheque**

```
Scenario: Customer pays with post-dated cheque

Step-by-Step:

1. Cheque Number: 055
2. Type: Select "Receive"
3. Pay To: "Our Company" (we receive)
4. From: "Rahman (Customer)"
5. Amount: 25000
6. Cheque Date: 20/01/2024
7. Due Date: 20/02/2024
8. Bank Account: Select "Brac Bank"
9. Reference: "INV-2024-050"
10. Notes: "Post-dated for invoice #50"
11. Click "Record Cheque"

Result:
- Cheque recorded
- Expect money on Feb 20
- Can include in receivables
```

#### **2. Mark Cheque as Deposited**

**When receiver deposits cheque**

```
Step 1: Find outstanding cheque
Step 2: Click "Mark Deposited"
Step 3: Enter date

Result:
- Status: Outstanding → Deposited
- Bank notified
- Awaiting clearance
```

#### **3. Mark Cheque as Cleared**

**When bank completes payment**

```
Step 1: Find deposited cheque
Step 2: Click "Mark Cleared"
Step 3: Confirm

Result:
- Status: Deposited → Cleared
- Money deducted from account
- Cheque fulfilled
- Transaction recorded
```

#### **4. Handle Bounced Cheque**

**When cheque bounces (insufficient funds)**

```
Step 1: Find bounced cheque
Step 2: Click "Handle Bounce"
Step 3: Choose action

Bounce Handling:
┌──────────────────────────────────────────┐
│         HANDLE BOUNCED CHEQUE             │
├──────────────────────────────────────────┤
│ Cheque: #001 - 15,000৳                   │
│                                          │
│ Reason: Insufficient funds                │
│                                          │
│ Action: [Dropdown ▼]                      │
│  • Reissue (new cheque)                    │
│  • Pay by other method                     │
│  • Cancel payment                          │
│                                          │
│ New Cheque No: _________ (if reissuing)  │
│                                          │
│ Notes: _____________________              │
│                                          │
│        [Cancel]  [Handle Bounce]          │
└──────────────────────────────────────────┘

Result:
- Bounce recorded
- Bank charges may apply
- Relationship may be affected
- New payment arranged
```

#### **5. Cancel Cheque**

**Stop payment before it's deposited**

```
Step 1: Find outstanding cheque
Step 2: Click "Cancel Cheque"
Step 3: Confirm cancellation

Result:
- Cheque cancelled
- Payment stopped
- Cannot be deposited
- Bank may charge fee
```

### **Cheque Best Practices**

💡 **Best Practices:**

1. **Record Immediately**
   - Record when issued/received
   - Don't wait
   - Prevents forgetting

2. **Track Due Dates**
   - Know when cheques can be deposited
   - Ensure funds available
   - Prevent bounced cheques

3. **Regular Reconciliation**
   - Match with bank statement
   - Update statuses
   - Clear outstanding items

4. **Keep Copies**
   - Copy of issued cheques
   - Record of received cheques
   - Audit trail

⚠️ **Warnings:**

1. **Don't Issue Without Funds**
   - Ensure money in account on due date
   - Prevents bounced cheques
   - Protects reputation

2. **Don't Forget Post-Dated**
   - Set reminders
   - Monitor account balance
   - Transfer funds if needed

3. **Don't Ignore Status**
   - Update when deposited
   - Update when cleared
   - Handle bounces immediately

---

## CHAPTER 16: BANK RECONCILIATION

### **URL:** `/finance/reconciliations`

### **What is Bank Reconciliation?**

**Bank Reconciliation = Matching your records with bank statement**

Think of it as:
> "Making sure what you think you have matches what the bank says you have"

**Why do they differ?**
- Outstanding cheques (issued but not cleared)
- Deposits in transit (recorded but not yet in bank)
- Bank charges/deductions you didn't know about
- Direct deposits/credits
- Timing differences

**Example:**
```
Your books show: 500,000৳ in bank
Bank statement shows: 480,000৳ in bank

Difference: 20,000৳

Why?
- Cheque issued: 20,000৳ (not yet cleared)
  - You recorded it (money out in your books)
  - Bank hasn't processed it yet (still shows as available)

After reconciliation:
- Your books: 500,000৳
- Less outstanding cheque: 20,000৳
- Adjusted balance: 480,000৳
- Matches bank statement! ✅
```

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│          BANK RECONCILIATION                        │
│          Account: DBBL Bank - Current               │
│          As of: 31 January 2024                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Balance per Books:              500,000৳            │
│  Balance per Bank Statement:     480,000৳            │
│  Difference:                      20,000৳            │
│                                                      │
│  ───────────────────────────────────────────────   │
│                                                      │
│  RECONCILIATION ITEMS:                             │
│                                                      │
│  Outstanding Cheques:                              │
│  • CHQ-001:        15,000                          │
│  • CHQ-002:         5,000                          │
│  Total:            20,000                          │
│                                                      │
│  Deposits in Transit:                              │
│  • Cash Deposit:   10,000                          │
│  Total:            10,000                          │
│                                                      │
│  Bank Charges:                                     │
│  • Account Maint.:    500                          │
│  • Cheque Book:      200                          │
│  Total:               700                          │
│                                                      │
│  ───────────────────────────────────────────────   │
│                                                      │
│  Adjusted Book Balance:           480,000৳          │
│  Adjusted Bank Balance:           480,000৳          │
│                                                      │
│  ✓ RECONCILED - Balances match!                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **What You Can Do**

#### **1. Start New Reconciliation**

**URL:** `/finance/reconciliations/create`

**When to reconcile:**
- Monthly (recommended)
- When bank statement received
- Before financial reports
- When errors suspected

**What You See (Create Form):**

```
┌────────────────────────────────────────────┐
│      START NEW RECONCILIATION              │
├────────────────────────────────────────────┤
│ Bank Account: [Dropdown ▼]                  │
│ (Which account to reconcile?)               │
│                                            │
│ Statement Date: __/__/____                 │
│ (Bank statement date)                      │
│                                            │
│ Statement Balance: ৳ _____________________ │
│ (Ending balance from statement)            │
│                                            │
│ Book Balance: ৳ _________________________   │
│ (Your current balance)                      │
│                                            │
│              [Cancel]  [Start]              │
└────────────────────────────────────────────┘
```

**Example: Starting Reconciliation**

```
Scenario: Reconcile DBBL Bank account

Step-by-Step:

1. Bank Account: Select "DBBL Bank - Current"
2. Statement Date: 31/01/2024
3. Statement Balance: 480000 (from bank statement)
4. Book Balance: 500000 (from system)
5. Click "Start"

Result:
- Reconciliation started
- Difference identified: 20,000৳
- Need to find why they differ
```

#### **2. Add Reconciliation Items**

**Identify differences**

**Outstanding Cheques:**
```
Cheques you issued but bank hasn't cleared yet

Add:
• Cheque #001: 15,000৳ (issued Jan 25)
• Cheque #002: 5,000৳  (issued Jan 28)

Total: 20,000৳

These reduce bank balance (money will leave soon)
```

**Deposits in Transit:**
```
Deposits you recorded but bank hasn't credited yet

Add:
• Cash deposit: 10,000৳ (made Jan 31 evening)

This increases bank balance (money will appear soon)
```

**Bank Charges:**
```
Charges bank deducted but you didn't know about

Add:
• Account maintenance fee: 500৳
• Cheque book fee: 200৳

Total: 700৳

These reduce book balance (need to record)
```

#### **3. Complete Reconciliation**

**When balances match**

```
After adding all items:

Book Balance:           500,000
Less outstanding:        -20,000
Less bank charges:         -700
Adjusted Book Balance:   479,300

Bank Statement:         480,000
Less deposits in transit: +10,000
Adjusted Bank Balance:   490,000

Still doesn't match!
Difference: 10,700৳

Investigation found:
- Missing deposit record: 10,000
- Error found and corrected

After correction:
Adjusted Book Balance:   480,000
Adjusted Bank Balance:   480,000
✓ MATCHES!

Click "Complete Reconciliation"

Result:
- Reconciliation complete
- All items recorded
- Bank and books match
- Cannot be edited (locked)
```

### **Finding Reconciliation Differences**

**Common causes and solutions:**

| Difference | Possible Cause | Solution |
|------------|---------------|----------|
| Bank lower | Outstanding cheques | List all cheques not yet cleared |
| Bank lower | Bank charges | Add charges to your books |
| Bank higher | Deposits in transit | List deposits not yet credited |
| Bank higher | Direct deposits | Add to your books |
| Can't find | Errors | Check transaction history |
| Can't find | Transposition | Check numbers (6,250 vs 6,520) |

### **Reconciliation Best Practices**

💡 **Best Practices:**

1. **Reconcile Monthly**
   - Do it every month
   - Don't skip months
   - Catch errors early

2. **Start with Zero Differences**
   - Easier to find errors
   - Build good habit
   - Maintain accuracy

3. **Investigate Thoroughly**
   - Find every difference
   - Don't force it to match
   - Understand each item

4. **Document Everything**
   - List all outstanding items
   - Note bank charges
   - Keep explanations

⚠️ **Warnings:**

1. **Don't Force Match**
   - Understand each difference
   - Don't just adjust numbers
   - Find real reasons

2. **Don't Ignore Small Differences**
   - Even 100৳ matters
   - Could be error
   - Could compound

3. **Don't Skip Months**
   - Harder to catch up
   - Errors pile up
   - Creates confusion

---

## CHAPTER 17: VAT & TAX

### **URL:** `/finance/vat-tax`

### **What is VAT?**

**VAT = Value Added Tax**

Think of it as:
> "Tax on the value added at each stage of production"

**Simple explanation:**
- Manufacturer sells to wholesaler → charges VAT
- Wholesaler sells to retailer → charges VAT
- Retailer sells to customer → charges VAT
- Final customer pays the accumulated VAT

**In Bangladesh:**
- VAT rate: 15% (as of 2024)
- Most goods and services have VAT
- Some items are exempt (educational, medical, etc.)

### **What is VAT Ledger?**

**VAT Ledger = Record of all VAT collected and paid**

**Two sides of VAT:**

**1. VAT Collected (Output VAT)**
- VAT you charge customers on sales
- You collect this from customers
- You owe this to government

**2. VAT Paid (Input VAT)**
- VAT you pay on purchases
- You pay this to suppliers
- You can claim credit against output VAT

**Net VAT:**
```
VAT Collected from sales
minus VAT Paid on purchases
equals VAT payable to government

Example:
  Sales: 1,000,000৳ × 15% = 150,000৳ (VAT collected)
  Purchases: 600,000৳ × 15% = 90,000৳ (VAT paid)
  Net VAT: 150,000 - 90,000 = 60,000৳ (pay to government)
```

### **What You See**

```
┌──────┬──────────────────┬─────────────┬──────────┬────────────┬────────────┐
│  ID  │    Date         │   Type     │  Amount  │    Status │  Actions   │
├──────┼──────────────────┼─────────────┼──────────┼────────────┼────────────┤
│ VT01 │  15-Jan-2024   │   Input    │  12,000  │   Paid   │ [View]     │
│ VT02 │  20-Jan-2024   │   Output   │  22,500  │   Filed  │ [View]     │
│ VT03 │  25-Jan-2024   │   Input    │   6,000   │   Pending│ [View]     │
└──────┴──────────────────┴─────────────┴──────────┴────────────┴────────────┘
```

### **VAT Status Explained**

| Status | What It Means | Action |
|--------|---------------|--------|
| **Pending** | Recorded but not paid | Need to pay |
| **Paid** | Paid to government | Waiting to file return |
| **Filed** | Return filed | Can claim credit |
| **Reconciled** | Checked by government | Complete |

### **What You Can Do**

#### **1. Record VAT on Purchase**

**When you buy something with VAT**

```
Scenario: Bought office supplies with VAT

Purchase invoice:
- Net amount: 10,000৳
- VAT (15%): 1,500৳
- Total paid: 11,500৳

Record expense:
- Expense: 10,000৳ (to expense account)
- VAT: 1,500৳ (to VAT ledger)
- Total payment: 11,500৳ from bank

VAT ledger entry:
- Date: 20/01/2024
- Type: Input VAT
- Amount: 1,500
- Reference: "Purchase of office supplies"
- Status: Paid
```

#### **2. Record VAT on Sale**

**When you sell something with VAT**

```
Scenario: Sold products with VAT

Sales invoice:
- Net amount: 50,000৳
- VAT (15%): 7,500৳
- Total invoice: 57,500৳

Record sale:
- Revenue: 50,000৳ (to sales account)
- VAT: 7,500৳ (to VAT ledger)
- Total received: 57,500৳ from customer

VAT ledger entry:
- Date: 25/01/2024
- Type: Output VAT
- Amount: 7,500
- Reference: "Sales #123"
- Status: Pending (not yet paid to government)
```

#### **3. Mark VAT as Paid**

**When you pay VAT to government**

```
Step 1: Find pending VAT entry
Step 2: Click "Mark Paid"
Step 3: Enter payment details

VAT Payment Form:
┌──────────────────────────────────────────┐
│         MARK VAT AS PAID                    │
├──────────────────────────────────────────┤
│ VAT Entry: VT02 - 22,500৳                  │
│                                          │
│ Payment Date: __/__/____                  │
│                                          │
│ Payment Method: [Dropdown ▼]              │
│  • Bank Transfer                          │
│  • Bkash                                 │
│  • Cash                                  │
│                                          │
│ Reference: _____________________             │
│ (Tax deposit slip/challan number)        │
│                                          │
│        [Cancel]  [Mark as Paid]           │
└──────────────────────────────────────────┘

Result:
- Status: Pending → Paid
- VAT liability recorded
- Can be claimed as credit
```

#### **4. File VAT Return**

**Submit VAT return and claim credit**

```
Step 1: Go to VAT ledger
Step 2: Click "File Return"
Step 3: Select period

VAT Return Summary:
┌──────────────────────────────────────────┐
│         VAT RETURN SUMMARY                   │
├──────────────────────────────────────────┤
│ Period: January 2024                        │
│                                          │
│ Output VAT (Collected):                    │
│  • Total sales: 1,500,000৳                │
│  • VAT collected:   225,000৳                │
│                                          │
│ Input VAT (Paid):                          │
│  • Total purchases: 800,000৳               │
│  • VAT paid:       120,000৳                │
│                                          │
│ Net VAT Payable:                           │
│  • Output - Input: 225,000 - 120,000          │
│  • Net payable: 105,000৳                   │
│                                          │
│ Credit Available: 15,000৳                    │
│ (from previous period)                       │
│                                          │
│ Total Payable: 90,000৳                     │
│                                          │
│        [Cancel]  [File Return]            │
└──────────────────────────────────────────┘

Result:
- Return filed
- Payment arranged
- Credit carried forward if any
```

### **VAT Best Practices**

💡 **Best Practices:**

1. **Record VAT Separately**
   - Don't mix with net amounts
   - Always track VAT amount
   - Separate ledger entries

2. **Reconcile Quarterly**
   - Match with purchases
   - Match with sales
   - Verify calculations
   - Catch errors early

3. **File Returns On Time**
   - Avoid penalties
   - Maintain compliance
   - Keep good records

4. **Understand Exemptions**
   - Some items don't have VAT
   - Know what's exempt
   - Document properly

⚠️ **Warnings:**

1. **Don't Mix VAT Rates**
   - Use correct rate (usually 15%)
   - Some items have different rates
   - Stay updated on regulations

2. **Don't Forget to Claim Credits**
   - Input VAT is your money
   - Claim against output VAT
   - Don't leave money on table

3. **Don't Ignore Deadlines**
   - File by deadline
   - Pay by deadline
   - Avoid interest and penalties

---

## SECTION 10: FINANCIAL REPORTS

## CHAPTER 18: UNDERSTANDING REPORTS

### **Why Reports Matter**

**Financial reports tell the story of your business:**

1. **Profit & Loss** - Are you making money?
2. **Balance Sheet** - What do you own vs owe?
3. **Cash Flow** - Do you have enough cash to operate?
4. **Trial Balance** - Are your books correct?
5. **General Ledger** - Detailed history of all transactions

### **When to Run Which Report**

| Report | When to Run | Why |
|--------|-------------|-----|
| **Profit & Loss** | Monthly, quarterly, yearly | See profitability, make decisions |
| **Balance Sheet** | Quarterly, yearly | Check financial health |
| **Cash Flow** | Monthly, when cash is tight | Ensure enough cash |
| **Trial Balance** | Before other reports | Verify books are correct |
| **General Ledger** | When investigating | Trace specific transactions |
| **Custom Reports** | As needed | Specific business questions |

### **Exporting Reports**

**Available formats:**
- **PDF** - Best for printing, sharing, archiving
- **Excel** - Best for analysis, calculations, formatting
- **CSV** - Best for data processing, importing

---

## CHAPTER 19: PROFIT & LOSS STATEMENT

### **URL:** `/finance/reports/profit-loss`

### **What is Profit & Loss?**

**Profit & Loss (P&L) = Report showing revenue minus expenses**

Think of it as:
> "Did we make or lose money this period?"

**Simple formula:**
```
REVENUE (money in)
  minus
EXPENSES (money out)
  equals
PROFIT or LOSS

Revenue > Expenses = Profit ✅
Expenses > Revenue = Loss ❌
```

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     PROFIT & LOSS STATEMENT                          │
│     For the period: January 1-31, 2024              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  REVENUE                                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ Sales Revenue                    │ 4,500,000  │ │
│  │ Service Revenue                   │  500,000   │ │
│  │ Other Income                      │  100,000   │ │
│  │                                │           │ │
│  │ TOTAL REVENUE                   │ 5,100,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  LESS: COST OF GOODS SOLD                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ Opening Inventory               │  800,000  │ │
│  │ Add: Purchases                 │ 2,000,000  │ │
│  │ Less: Closing Inventory          │ (900,000) │ │
│  │ Cost of Goods Sold               │ 1,900,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  GROSS PROFIT                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Revenue:                         │ 5,100,000  │ │
│  │ Less: COGS:                       │ 1,900,000  │ │
│  │ Gross Profit:                    │ 3,200,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  OPERATING EXPENSES                               │
│  ┌───────────────────────────────────────────────┐ │
│  │ Rent Expense                    │   300,000  │ │
│  │ Salary Expense                  │   800,000  │ │
│  │ Utility Expense                  │    50,000  │ │
│  │ Marketing Expense               │   200,000  │ │
│  │ Office Expense                  │   100,000  │ │
│  │ Depreciation                    │   150,000  │ │
│  │ Other Expenses                   │   100,000  │ │
│  │                                │           │ │
│  │ Total Operating Expenses          │ 1,700,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  NET OPERATING PROFIT                               │
│  ┌───────────────────────────────────────────────┐ │
│  │ Gross Profit:                    │ 3,200,000  │ │
│  │ Less: Operating Expenses:          │ 1,700,000  │ │
│  │ Net Operating Profit:            │  1,500,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  OTHER INCOME/EXPENSE                              │
│  ┌───────────────────────────────────────────────┐ │
│  │ Interest Income                  │     10,000  │ │
│  │ Interest Expense                  │     20,000  │ │
│  │ Net Other:                        │    (10,000) │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  NET PROFIT BEFORE TAX                               │
│  ┌───────────────────────────────────────────────┐ │
│  │ Net Operating Profit:            │  1,500,000  │ │
│  │ Add: Net Other:                    │     10,000  │ │
│  │ Net Profit Before Tax:           │  1,490,000  │ │
│  └──────────────────────────────────────────────┘ │
│                                                      │
│  LESS: TAX PROVISION                                  │
│  ┌───────────────────────────────────────────────┐ │
│  │ Tax Provision                    │   370,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  NET PROFIT AFTER TAX                                │
│  ┌───────────────────────────────────────────────┐ │
│  │ Before Tax:                      │ 1,490,000  │ │
│  │ Less: Tax:                         │   370,000  │ │
│  │ Net Profit:                      │  1,120,000  │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **How to Read P&L**

**Section by section:**

**1. REVENUE (Top)**
```
All money coming into business:
- Sales from products
- Fees from services
- Other income
Question: Which is largest? Which is growing?
```

**2. COST OF GOODS SOLD (COGS)**
```
Direct costs to produce what you sold:
- Materials
- Labor
- Factory overhead
Question: As % of sales? Is it increasing?
```

**3. GROSS PROFIT**
```
Revenue - COGS = Gross Profit
This is your profit before operating expenses
Question: Is gross profit margin healthy? (ideally 30-50%)
```

**4. OPERATING EXPENSES**
```
All costs to run the business:
- Rent, salaries, utilities
- Marketing, office, etc.
Question: Which expense is largest? Any way to reduce?
```

**5. NET PROFIT**
```
What's left after all expenses
Question: Is this enough profit? How does it compare to last period?
```

### **P&L Analysis Examples**

**Example 1: Good Business Health**

```
Revenue: 5,100,000
COGS: 1,900,000 (37% of revenue)
Gross Profit: 3,200,000 (63% margin ✅)
Expenses: 1,700,000
Net Profit: 1,500,000 (29% margin ✅)

Analysis:
✅ Good gross profit margin (63%)
✅ Healthy net profit (29%)
✅ Positive cash flow likely
✅ Business is profitable
```

**Example 2: Concerning Business Health**

```
Revenue: 5,100,000
COGS: 3,500,000 (69% of revenue)
Gross Profit: 1,600,000 (31% margin ⚠️)
Expenses: 1,700,000
Net Loss: (100,000)

Analysis:
⚠️ Low gross profit margin (31%)
❌ Net loss
⚠️ COGS too high
⚠️ Need to increase prices or reduce COGS
```

### **P&L Best Practices**

💡 **Best Practices:**

1. **Compare Periods**
   - Compare with last month
   - Compare with same period last year
   - Identify trends

2. **Look Beyond Net Profit**
   - Gross profit margin important
   - Operating profit important
   - Understand each section

3. **Investigate Variances**
   - Why did revenue change?
   - Why did expenses increase?
   - Find root causes

⚠️ **Warnings:**

1. **Don't Focus Only on Net Profit**
   - Gross profit matters
   - Operating profit matters
   - Understand the drivers

---

## CHAPTER 20: BALANCE SHEET

### **URL:** `/finance/reports/balance-sheet`

### **What is Balance Sheet?**

**Balance Sheet = Snapshot of what you OWN and what you OWE**

Think of it as:
> "Financial photo of your business at a specific date"

**The Golden Formula:**
```
ASSETS = LIABILITIES + EQUITY

What you own = What you owe + Owner's share
```

**Why it's called "Balance":**
- Left side (assets) must equal right side (liabilities + equity)
- Must balance perfectly

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     BALANCE SHEET                                  │
│     As of: January 31, 2024                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ASSETS (What you OWN)                             │
│  ┌───────────────────────────────────────────────┐ │
│  │ CURRENT ASSETS                            │ │
│  │  ┌──────────────────────────────────────┐ │ │
│  │  │ Cash in Hand          │     50,000     │ │ │
│  │  │ Bank Accounts         │    425,000     │ │ │
│  │  │ Bkash                │     25,000     │ │ │
│  │  │ Inventory            │    500,000     │ │ │
│  │  │ Accounts Receivable   │    150,000     │ │ │
│  │  └──────────────────────────────────────┘ │ │
│  │  Total Current Assets:               1,150,000│ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ FIXED ASSETS                             │ │
│  │  • Office Equipment     │    300,000    │ │
│  │  • Vehicles            │    800,000    │ │
│  │  • Less: Depreciation   │    (400,000)   │ │
│  │  │ Net Fixed Assets:      │    700,000    │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  TOTAL ASSETS:                                1,850,000│
│                                                      │
│  LIABILITIES (What you OWE)                        │
│  ┌───────────────────────────────────────────────┐ │
│  │ CURRENT LIABILITIES                         │ │
│  │  ┌──────────────────────────────────────┐ │ │
│  │  │ Accounts Payable      │    100,000    │ │ │
│  │  │ Outstanding Expenses │     50,000     │ │ │
│  │  │ Tax Payable          │     75,000     │ │ │
│  │  └──────────────────────────────────────┘ │ │
│  │  Total Current:           │    225,000   │ │
│  │                                                  │
│  │  │                                │          │ │
│  │  LONG-TERM LIABILITIES                      │ │
│  │  • Bank Loan           │    500,000    │ │ │
│  │  │                                │          │ │
│  │  Total Long-Term:         │    500,000   │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  TOTAL LIABILITIES:                          725,000│
│                                                      │
│  EQUITY (Owner's Share)                           │
│  ┌───────────────────────────────────────────────┐ │
│  │ Owner's Capital        │  1,000,000   │ │
│  │ Retained Earnings    │     125,000   │ │
│  │  │                                │          │ │
│  │  Total Equity:          │  1,125,000   │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  TOTAL LIABILITIES + EQUITY:                  1,850,000│
│                                                      │
│  ✓ ASSETS = LIABILITIES + EQUITY              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Understanding Balance Sheet**

**ASSETS (Left Side):**

**Current Assets** - Things that convert to cash within 1 year:
- Cash, bank, Bkash
- Inventory
- Money owed by customers

**Fixed Assets** - Long-term assets:
- Equipment, vehicles
- Buildings
- Less depreciation (what they've lost in value)

**LIABILITIES (Right Side):**

**Current Liabilities** - Debts due within 1 year:
- Bills to suppliers
- Outstanding expenses
- Tax payable

**Long-term Liabilities** - Debts due after 1 year:
- Bank loans
- Mortgages

**EQUITY (Right Side):**
- Owner's original investment
- Profits kept in business
- Drawings by owner

### **Balance Sheet Analysis**

**Example 1: Strong Business**

```
Assets: 1,850,000
Liabilities: 725,000
Equity: 1,125,000

Analysis:
✅ Equity is 61% of assets (healthy)
✅ Debt is 39% of assets (manageable)
✅ Positive equity (business worth something)
✅ Can cover all debts
```

**Example 2: Weak Business**

```
Assets: 1,000,000
Liabilities: 900,000
Equity: 100,000

Analysis:
⚠️ Equity is only 10% of assets (risky)
❌ Debt is 90% of assets (dangerous)
⚠️ Little cushion for problems
❌ Near insolvency
```

### **Balance Sheet Best Practices**

💡 **Best Practices:**

1. **Review Regularly**
   - Quarterly at minimum
   - Track changes over time
   - Spot trends early

2. **Monitor Key Ratios**
   - Current ratio (current assets ÷ current liabilities)
   - Debt-to-equity ratio
   - Working capital

3. **Compare Periods**
   - Same date last year
   - See if improving or declining
   - Identify problems

⚠️ **Warnings:**

1. **Don't Ignore Low Equity**
   - Equity less than 20% = danger zone
   - Take corrective action
   - Increase capital or reduce debt

2. **Don't Ignore High Debt**
   - Debt more than 70% of assets = risky
   - Restructure debt if needed
   - Improve profitability

---

## CHAPTER 21: CASH FLOW STATEMENT

### **URL:** `/finance/reports/cash-flow`

### **What is Cash Flow?**

**Cash Flow = Movement of cash in and out of business**

Think of it as:
> "Water flowing - in and out"

**Simple concept:**
```
Cash In (Sources):
  • From sales
  • From loans
  • From owner investment
  • From asset sales

Cash Out (Uses):
  • Pay expenses
  • Buy assets
  • Pay debts
  • Pay dividends

Net Cash Flow = Cash In - Cash Out
Positive = Cash increased
Negative = Cash decreased
```

**Why cash flow matters:**
- You can be profitable but have no cash
- Profit ≠ Cash (sales on credit, expenses paid now)
- Need cash to pay bills and salaries
- Cash flow keeps business alive

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     CASH FLOW STATEMENT                             │
│     For the period: January 1-31, 2024              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  CASH FLOW FROM OPERATING ACTIVITIES                 │
│                                                      │
│  Cash In: from operations                         │
│  ┌──────────────────────────────────────────────┐ │
│  │ From Sales                              │  800,000  │ │
│  │ From Customers (overdue payments)           │  100,000  │ │
│  │ Interest received                         │   10,000  │ │
│  │ Total Inflows                           │  910,000  │ │
│  └──────────────────────────────────────────────┘ │
│                                                      │
│  Cash Out: for operations                        │
│  ┌──────────────────────────────────────────────┐ │
│  │ To Suppliers                           │  300,000  │ │
│  │ To Employees (salaries)                  │  400,000  │ │
│  │ To Government (taxes)                     │   50,000  │ │
│  │ Rent & Utilities                         │   75,000  │ │
│  │ Other expenses                         │   50,000  │ │
│  │ Total Outflows                          │  875,000  │ │
│  └──────────────────────────────────────────────┘ │
│                                                      │
│  Net Cash from Operations:                      35,000   │
│                                                      │
│  ────────────────────────────────────────────────   │
│                                                      │
│  CASH FLOW FROM INVESTING ACTIVITIES                │
│                                                      │
│  Cash In:                                      │
│  ┌──────────────────────────────────────────────┐ │
│  │ Sale of Equipment                      │  50,000   │ │
│  │ Loan Received                         │ 100,000   │ │
│  │ Total Inflows                           │ 150,000   │ │
│  └──────────────────────────────────────────────� │
│                                                      │
│  Cash Out:                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Purchase of Equipment                   │  100,000  │ │
│  │ Total Outflows                          │  100,000  │ │
│  └────────────────────────────────────────────── │ │
│                                                      │
│  Net Cash from Investing:                        50,000   │
│                                                      │
│  ────────────────────────────────────────────────   │
│                                                      │
│  CASH FLOW FROM FINANCING ACTIVITIES               │
│                                                      │
│  Cash In:                                      │
│  ┌──────────────────────────────────────────────┐ │
│  │ Loan from Bank                         │  200,000   │ │
│  │ Owner Investment                      │  100,000   │
│  │ Total Inflows                           │  300,000   │
│  └────────────────────────────────────────────── │ │
│                                                      │
│  Cash Out:                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ Loan Repayment                          │  150,000  │ │
│  │ Dividends Paid                           │   50,000  │ │
│  │ Total Outflows                          │  200,000  │ │
│  └────────────────────────────────────────────── │ │
│                                                      │
│  Net Cash from Financing:                       100,000   │
│                                                      │
│  ────────────────────────────────────────────────   │
│                                                      │
│  NET INCREASE IN CASH                             │
│                                                     │
│  Add: Net from Operations:                      35,000    │
│  Add: Net from Investing:                       50,000    │
│  Add: Net from Financing:                      100,000    │
│  Subtract: Decrease in cash                    │       0    │
│                                                     │
│  Net Cash Increase:                          185,000   │
│                                                     │
│  Cash at Beginning:                              150,000    │
│  Cash at End:                                   335,000    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### **Three Types of Cash Flows**

**1. Operating Activities**
- Day-to-day business operations
- Sales, purchases, expenses
- Most important section
- Should be positive for healthy business

**2. Investing Activities**
- Buying/selling assets
- Capital expenditures
- Can be negative (investing) or positive (selling)

**3. Financing Activities**
- Borrowing money
- Repaying loans
- Owner investments
- Dividends

### **Analyzing Cash Flow**

**Positive Cash Flow:**
```
✅ Cash increased - Good
✅ Can pay bills on time
✅ Can seize opportunities
✅ Less financial stress
```

**Negative Cash Flow:**
```
❌ Cash decreased - Warning!
⚠️ May not be able to pay bills
⚠️ May need borrowing
⚠️ Could indicate problems
```

**Cash Flow vs Profit:**

```
Scenario 1:
Profit: 500,000 ✅
Cash Flow: -100,000 ❌
Meaning: Making sales but not collecting money
Action: Follow up on receivables

Scenario 2:
Profit: -100,000 ❌
Cash Flow: 200,000 ✅
Meaning: Losing money but receiving cash (selling assets)
Action: Fix business model
```

### **Cash Flow Best Practices**

💡 **Best Practices:**

1. **Monitor Weekly**
   - Cash can change fast
   - Catch problems early
   - Plan ahead

2. **Forecast Cash Flow**
   - Expected payments
   - Expected receipts
   - Identify shortfalls

3. **Maintain Buffer**
   - Keep cash reserve
   - For emergencies
   - 2-3 months of expenses

⚠️ **Warnings:**

1. **Don't Confuse Profit with Cash**
   - Profit is accounting
   - Cash is reality
   - Need positive cash flow

2. **Don't Ignore Negative Cash Flow**
   - Can bankrupt profitable business
   - Address immediately
   - Borrow if needed

---

## CHAPTER 22: TRIAL BALANCE

### **URL:** `/finance/reports/trial-balance`

### **What is Trial Balance?**

**Trial Balance = List of all account balances to verify books**

**Why important:**
- Checks if debits = credits
- Finds errors in recording
- Required before creating financial statements
- Foundation of accurate reports

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     TRIAL BALANCE                                  │
│     As of: January 31, 2024                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  DEBIT BALANCES:                                  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Cash                          │  50,000     │  │
│  │ Bank Accounts                 │ 425,000     │  │
│  │ Bkash                         │  25,000     │  │
│  │ Inventory                    │ 500,000     │  │
│  │ Accounts Receivable            │ 150,000     │ │
│  │ Buildings                     │ 800,000     │  │
│  │ Equipment                     │ 300,000     │ │
│  │ Vehicles                     │ 800,000     │  │
│  │ Rent Expense                  │  300,000     │  │
│  │ Salary Expense                │  800,000     │ │
│  │ Utility Expense               │   50,000     │ │
│  │ Marketing Expense             │  200,000     │ │
│  │ Office Expense               │  100,000     │ │
│  │ Depreciation Expense           │  150,000     │ │
│  │                                │             │  │
│  │ TOTAL DEBITS                  │ 3,850,000   │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  CREDIT BALANCES:                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │ Accounts Payable              │  100,000     │  │
│  │ Bank Loan                    │  500,000     │ │
│  │ Owner's Capital               │1,000,000     │ │
│  │ Sales Revenue                 │ 3,000,000     │ │
│  │ Service Revenue              │  500,000     │ │
│  │ Other Income                  │  100,000     │ │
│  │ Retained Earnings             │  125,000     │  │
│  │                                │             │  │ │
│  │ TOTAL CREDITS                  │ 4,625,000   │ │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  CHECK:                                          │
│  Total Debits:                   3,850,000   │  │
│  Total Credits:                  4,625,000   │  │
│  ✓ BALANCED - Debits match Credits    │  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Reading Trial Balance**

**How to check if balanced:**

1. **Sum all debit balances** = 3,850,000
2. **Sum all credit balances** = 4,625,000
3. **Are they equal?** No!
4. **Something is wrong!** Find the error

**Why they might not balance:**
- Transaction recorded only on one side
- Transposition error (6,250 written as 6,520)
- Missing entry
- Wrong account selected

**What to do if doesn't balance:**
1. Check transaction history
2. Look for unusual amounts
3. Verify all entries posted
4. Review journals
5. Ask accountant

### **Trial Balance Best Practices**

💡 **Best Practices:**

1. **Run Before Reports**
   - Before P&L and Balance Sheet
   - Before month-end closing
   - Before tax calculations

2. **Compare Periods**
   - Same period last year
   - Identify trends
   - Spot anomalies

3. **Investigate Differences**
   - Even small differences matter
   - Find the cause
   - Correct immediately

⚠️ **Warnings:**

1. **Don't Use Unbalanced Reports**
   - Reports will be wrong
   - Decisions based on wrong data
   - Can cause compliance issues

2. **Don't Force Balance**
   - Don't adjust to make it match
   - Find the real error
   - Correct the source

---

## CHAPTER 23: GENERAL LEDGER

### **URL:** `/finance/reports/general-ledger`

### **What is General Ledger?**

**General Ledger = Complete record of every financial transaction**

Think of it as:
> "The master book where all transactions are recorded chronologically"

**Why important:**
- Complete audit trail
- Transaction history
- Account-specific details
- Foundation for all reports

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     GENERAL LEDGER                                  │
│     Account: Cash                                   │
│     Period: January 1-31, 2024                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Date     │ Description              │ Debit   │ Credit  │ Balance │
│──────────┼──────────────────────────┼─────────┼─────────┼────────┤
│  Jan 01   │ Opening Balance            │ 40,000  │        │ 40,000  │
│  Jan 05   │ Sales Receipt #123         │         │ 50,000 │        │ 90,000  │
│  Jan 08   │ Expense - Office Rent       │ 25,000  │        │ 65,000  │
│  Jan 10   │ Payment to Supplier      │ 20,000  │        │ 85,000  │
│  Jan 15   │ Deposit from Customer    │         │ 15,000 │ 100,000 │
│  Jan 20   │ Salary Payment            │ 40,000  │        │ 60,000  │
│  Jan 25   │ Cash Withdrawal          │         │ 10,000 │   50,000 │
│  Jan 28   │ Bank Charges             │     500  │        │  50,500 │
│  Jan 31   │ Closing Balance            │         │        │  50,500 │
│──────────┴──────────────────────────┴─────────┴─────────┴────────┤
│                                                      │
│  Total Transactions: 9                         │
│  Total Debits: 125,500                         │
│  Total Credits: 125,500                         │
│  Final Balance: 50,500                          │
└─────────────────────────────────────────────────────┘
```

### **How to Use General Ledger**

**Find specific transactions:**

```
Search Options:
• By Date: "January 2024"
• By Amount: "25,000"
• By Description: "rent"
• By Reference: "#123"

Filter Options:
• Account: Select specific account
• Date Range: Select period
• Transaction Type: Payment, deposit, etc.
```

**Example uses:**

**1. Find all rent payments:**
```
Search: "rent"
Shows all rent expense transactions
```

**2. Find specific transaction:**
```
Search: "INV-2024-050"
Finds that specific invoice transaction
```

**3. Trace account balance:**
```
Select: Cash account
See complete history
Understand how balance changed
```

### **General Ledger vs Journal**

| Aspect | Journal | Ledger |
|--------|--------|--------|
| **What** | Entry form | Transaction log |
| **Organization** | By entry | By account |
| **View** | Transaction | Account-focused |
| **Usage** | Recording | Investigating |

---

## CHAPTER 24: ADVANCED CUSTOM REPORTS

### **URL:** `/finance/reports/custom`

### **What are Custom Reports?**

**Custom Reports = Tailored reports for specific analysis**

Think of it as:
> "Build your own report based on what you need"

**Why custom reports?**
- Standard reports don't fit your needs
- Need specific date ranges
- Compare different periods
- Analyze specific aspects

### **Report Types**

**1. Comparative Analysis**
```
Compare two periods
Example: This year vs last year
Shows: Growth rates, changes, trends
```

**2. Ratio Analysis**
```
Financial ratios and metrics
Examples:
- Current ratio (liquidity)
- Debt-to-equity (leverage)
- Profit margins
```

**3. Cash Flow (Custom)**
```
Customized cash flow
Specific categories or time periods
Focus on cash generation
```

**4. Fund Flow**
```
Movement of funds
Sources and uses
Where cash came from, where it went
```

**5. Custom Report Builder**
```
Build your own:
- Select accounts
- Choose date range
- Filter by criteria
- Format results
```

### **Creating Custom Report**

**URL:** `/finance/reports/custom`

**Step-by-Step:**

```
1. Report Name: "Q1 vs Q2 Comparison"
2. Report Type: "Comparative Analysis"
3. Start Date: 01/01/2024
4. End Date: 06/30/2024
5. Compare Start: 01/01/2024
6. Compare End: 03/31/2024
7. Select accounts to include
8. Click "Generate Report"

Result:
- Custom report generated
- Shows Q1 vs Q2 comparison
- Export to PDF/Excel
```

---

## CHAPTER 25: AUDIT TRAIL

### **URL:** `/finance/audit`

### **What is Audit Trail?**

**Audit Trail = Log of who did what and when**

Think of it as:
> "Security camera recording all financial activities"

**Why important?**
- Fraud prevention
- Accountability
- Compliance
- Error tracking
- Investigation support

### **What You See**

```
┌─────────────────────────────────────────────────────┐
│     AUDIT LOG                                     │
│     For: Expense #45                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Date: 2024-01-20 14:32:15                   │
│  User: Karim (ID: 45)                           │
│  Action: Updated expense                            │
│  │                                                 │
│  Changes:                                        │
│  │ • amount: 10,000 → 15,000              │  │
│  │ • reason: Added travel costs                │  │
│  │                                                 │
│  IP Address: 192.168.1.100                       │
│  Browser: Chrome 120                            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### **Audit Trail Features**

**1. Track Changes:**
- Before value
- After value
- What changed
- When changed
- Who changed

**2. Track User:**
- Which user
- Date and time
- IP address
- Browser/device

**3. Track Action:**
- Created, updated, deleted
- Approved, rejected
- Viewed, exported

### **Why Audit Trail Matters**

**Scenario: Suspicious Expense**

```
Problem: Expense seems inflated

Using audit trail:
1. Search for expense
2. See all changes
3. Identify:
   - Who created it
   - When created
   - What amount originally was
   - What it was changed to
   - Who approved it

Result: Complete history of transaction
```

---

## CHAPTER 26: EVERYDAY WORKFLOWS

### **Daily Workflow**

**Morning (15 minutes):**
1. Check dashboard
2. Review overnight notifications
3. Check cash balances
4. Approve pending expenses
5. Note any urgent items

**During Day:**
1. Record expenses as they occur
2. Record receipts when received
3. Update projects if working on any
4. Note any cash transactions

**Evening (15 minutes):**
1. Record all cash received today
2. Record all expenses paid today
3. Check pending items
4. Plan tomorrow's cash needs

### **Weekly Workflow**

**Monday:**
1. Run P&L report for last week
2. Review budget vs actual
3. Plan cash for week
4. Approve all pending expenses

**Tuesday-Thursday:**
- Normal daily tasks
- Record transactions
- Monitor cash
- Keep up to date

**Friday:**
1. Run weekly cash flow report
2. Check aging reports
3. Follow up on overdue invoices
4. Run trial balance if closing month
5. Reconcile bank accounts
6. Review backlog

### **Monthly Workflow**

**First Week:**
1. Close previous month
2. Run all month-end reports
3. Reconcile all accounts
4. Review P&L and Balance Sheet
5. Pay all bills
6. Send all invoices

**Rest of Month:**
- Normal daily/weekly tasks
- Monthly budget vs actual review
- Project profitability review
- Cost center performance
- Tax compliance

**End of Month:**
- Final reconciliation
- Update forecasts
- Prepare next month's budget

---

## CHAPTER 27: COMMON ISSUES & TROUBLESHOOTING

### **Issue 1: Numbers Don't Match**

**Problem:**
```
Your books show: 500,000৳
Bank statement shows: 480,000৳
```

**Solution:**
1. Reconcile bank accounts
2. Check for outstanding cheques
3. Check for deposits in transit
4. Check for bank charges
5. Find and fix differences

### **Issue 2: Can't Find Transaction**

**Problem:**
- Can't find specific payment
- Transaction missing

**Solution:**
1. Use search function
2. Filter by date range
3. Check multiple accounts
4. Look at general ledger
5. Ask team members

### **Issue 3: Accidentally Deleted Entry**

**Problem:**
- Deleted wrong transaction
- Need it back

**Solution:**
1. Check audit trail
2. See what was deleted
3. Re-enter transaction
4. Get approval if needed

### **Issue 4: Bank Balance Shows Wrong**

**Problem:**
- System balance ≠ actual balance
- Large difference

**Solution:**
1. Verify all transactions recorded
2. Check for outstanding items
3. Reconcile immediately
4. Contact bank if needed

### **Issue 5: Report Shows Zero Values**

**Problem:**
- Report shows all zeros
- Should show data

**Solution:**
1. Check date range selected
2. Verify account filters
3. Check if data exists
4. Refresh report

### **Issue 6: Permission Errors**

**Problem:**
- Can't access certain pages
- "Access Denied" message

**Solution:**
1. Check user permissions
2. Contact admin
3. Request required permissions

---

## CHAPTER 28: BEST PRACTICES

### **Good Accounting Habits**

1. **Record Daily**
   - Don't let receipts pile up
   - Record immediately
   - Prevents forgetting

2. **Keep Receipts**
   - File all receipts
   - Organize by month
   - Keep for 7 years (tax requirement)

3. **Reconcile Monthly**
   - All bank accounts
   - All major accounts
   - Fix differences immediately

4. **Review Reports Regularly**
   - Monthly minimum
   - Quarterly at minimum
   - Make decisions based on data

5. **Backup Data**
   - Daily automated backup
   - Weekly manual backup
   - Off-site backup

6. **Use Descriptions**
   - Always enter description
   - Be specific and clear
   - Helps later understanding

7. **Get Approvals**
   - Large expenses
   - New suppliers
   - New projects

---

## CHAPTER 29: GLOSSARY

### **Financial Terms Dictionary**

**A**
- **Account:** Category for recording transactions
- **Accounts Payable:** Money owed to suppliers
- **Accounts Receivable:** Money owed by customers
- **Accrual:** Record expense before cash changes hands
- **Accumulated Depreciation:** Total depreciation to date
- **Asset:** What business owns
- **Audit:** Examination of financial records

**B**
- **Balance Sheet:** Report of assets, liabilities, equity
- **Bank Reconciliation:** Matching books with bank statement
- **Budget:** Planned spending
- **Bad Debt:** Money that can't be collected

**C**
- **Capital:** Owner's investment in business
- **Cash Flow:** Movement of cash in and out
- **Chart of Accounts:** List of all account categories
- **Cost Center:** Department tracking expenses
- **Credit:** Right side of accounting entry
- **Current Assets:** Cash and items that convert to cash quickly

**D**
- **Debit:** Left side of accounting entry
- **Depreciation:** Loss of value over time
- **Direct Expenses:** Costs directly tied to production
- **Dividend:** Payment to shareholders

**E**
- **Equity:** Owner's share in business
- **Expense:** Money spent
- **Extraordinary Item:** Unusual, one-time item

**F**
- **Fiscal Year:** Financial reporting period
- **Fixed Asset:** Long-term asset
- **Financial Statements:** Reports on financial position

**G**
- **General Ledger:** Complete transaction record
- **Gross Profit:** Revenue minus cost of goods sold

**I**
- **Income:** Money earned
- **Indirect Expenses:** Overhead, not tied to production
- **Inventory:** Products for sale
- **Investing:** Buying assets

**J**
**Journal Entry:** Manual accounting entry

**L**
**Liability:** What business owes
**Liquid Assets:** Cash and items that convert to cash

**N**
**Net Income:** Final profit after all expenses
**Net Worth:** Total assets minus total liabilities

**O**
**Operating Expenses:** Regular business expenses
**Outstanding:** Not yet paid or collected
**Overhead:** Indirect expenses

**P**
**Profit:** Revenue minus expenses
**Profit Margin:** Profit as percentage

**R**
**Receipt:** Proof of purchase
**Revenue:** Income from sales
**Retained Earnings:** Profits kept in business

**S**
**Sales:** Selling goods/services
**Service Revenue:** Income from services
**Stock:** Inventory

**T**
**Trial Balance:** List of account balances
**Transaction:** Exchange of money/goods/services

**V**
**VAT:** Value Added Tax
**Variable Expenses:** Changes with production/sales

**W**
**Working Capital:** Current assets minus current liabilities

---

## APPENDICES

### **Appendix A: Keyboard Shortcuts**

| Shortcut | Function |
|----------|----------|
| Ctrl+S | Save |
| Ctrl+F | Find |
| Ctrl+P | Print |
| ESC | Close modal |

### **Appendix B: Quick Reference**

**Common Actions:**
- **New Expense**: Use + button
- **Search**: Use search box
- **Filter**: Apply filters
- **Export**: Use export button

### **Appendix C: Sample Reports**

*(Contains sample financial reports with explanations)*

### **Appendix D: FAQ**

**Q:** What if I made a mistake?
**A:** Use audit trail to find it, then correct entry

**Q:** Can I delete old transactions?
**A:** Only if absolutely necessary. Mark inactive instead

**Q:** How often should I reconcile?
**A:** Monthly minimum

### **Appendix E: Contact Support**

For help:
- Email: support@hooknhunt.com
- Phone: +880 1234-5678
- Documentation: https://docs.hooknhunt.com

---

## **MANUAL COMPLETE**

This manual covers all aspects of the Hook & Hunt Finance Module from basic concepts to advanced reporting. For specific questions or additional training, contact your system administrator.

**Version:** 1.0
**Last Updated:** January 2024
**Manual Revision:** 1

---

*End of Manual*
