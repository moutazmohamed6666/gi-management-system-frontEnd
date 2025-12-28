# Deals Table Visual Example

## Updated Table Layout

Here's what the updated deals table will look like with the new columns:

```
┌──────────┬─────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────────┬──────────────────────────────┬──────────────┬─────────┐
│ Deal ID  │ Property        │ Buyer        │ Seller       │ Agent        │ Price        │ Commission  │ Agent Commission             │ Status       │ Actions │
├──────────┼─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┼──────────────────────────────┼──────────────┼─────────┤
│ D027     │ Luxury Apts     │ omar shahin  │ Elsayed      │ Agent User   │ AED          │ AED 37,500  │ Main: AED 10,000             │ Submitted    │ [View]  │
│          │ ABC Developers  │              │ Elagalad     │              │ 1,250,000    │             │ [Expected]                   │              │         │
│          │                 │              │              │              │              │             │ +2 additional agents         │              │         │
│          │                 │              │              │              │              │             │ • Jane Agent: 30% (Internal) │              │         │
│          │                 │              │              │              │              │             │ • ahmed: AED 1,000 (External)│              │         │
│          │                 │              │              │              │              │             │ Total: AED 3,751,030         │              │         │
├──────────┼─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┼──────────────────────────────┼──────────────┼─────────┤
│ D026     │ Downtown Office │ test 1       │ omar shahin  │ Agent User   │ AED          │ AED 3,000   │ Main: AED 1                  │ Submitted    │ [View]  │
│          │ ABC Developers  │              │              │              │ 1,500,000    │             │ [Expected]                   │              │         │
│          │                 │              │              │              │              │             │ Total: AED 30                │              │         │
├──────────┼─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼─────────────┼──────────────────────────────┼──────────────┼─────────┤
│ D022     │ Downtown Office │ Moataz       │ Elsayed      │ Agent User   │ AED          │ AED 62,500  │ Main: AED 1,000              │ Finance      │ [View]  │
│          │ ABC Developers  │ Elhefny      │ Elagalad     │              │ 1,250,000    │             │ [Partially Paid]             │ Review       │ [Edit]  │
│          │                 │              │              │              │              │             │ +1 additional agent          │              │         │
│          │                 │              │              │              │              │             │ • Jane Agent: AED 20,000     │              │         │
│          │                 │              │              │              │              │             │   (Internal)                 │              │         │
│          │                 │              │              │              │              │             │ Total: AED 645,000           │              │         │
│          │                 │              │              │              │              │             │ (Paid: AED 542)              │              │         │
└──────────┴─────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────────┴──────────────────────────────┴──────────────┴─────────┘
```

## Column Details

### 1. Deal ID
- Shows the deal number (e.g., D027, D026)

### 2. Property
- Project name on first line
- Developer name on second line (smaller, gray text)

### 3. Buyer
- Buyer's full name

### 4. Seller ⭐ NEW
- Seller's full name
- Previously not displayed in the table

### 5. Agent
- Main agent's name

### 6. Price
- Deal value in AED with thousand separators

### 7. Commission
- Total deal commission (from `totalCommission.commissionValue`)
- This is the total commission for the deal, not just agent commission

### 8. Agent Commission ⭐ NEW (Detailed Breakdown)
This column shows comprehensive commission information:

#### Main Agent Section:
```
Main: AED 10,000
[Expected]  ← Status badge (color-coded)
```

#### Additional Agents Section (if any):
```
+2 additional agents
• Jane Agent: 30% (Internal)
• ahmed: AED 1,000 (External)
```

#### Total Summary:
```
Total: AED 3,751,030
(Paid: AED 542)  ← Only shown if payment made
```

### 9. Status
- Deal status badge (color-coded)
- Examples: Submitted, Finance Review, Closed

### 10. Actions
- View button (all roles)
- Edit/Collect/Transfer buttons (finance role)

## Status Badge Colors

### Commission Status:
- 🟢 **Green** - Paid
- 🟠 **Orange** - Partially Paid
- ⚫ **Gray** - Expected/Pending

### Deal Status:
- 🟢 **Green** - Closed, Paid
- 🔵 **Blue** - Transferred, Received, Approved
- 🟠 **Orange** - Finance Review, Partially Paid
- 🟡 **Yellow** - Submitted
- ⚫ **Gray** - Other statuses

## Real Data Example (from API response)

### Deal D027 with Multiple Additional Agents:
```json
{
  "dealNumber": "D027",
  "seller": {
    "name": "Elsayed Elagalad"
  },
  "agentCommissions": {
    "mainAgent": {
      "expectedAmount": 10000,
      "status": { "name": "Expected" }
    },
    "additionalAgents": [
      {
        "agent": { "name": "Jane Agent", "isInternal": true },
        "commissionType": { "name": "Percentage" },
        "commissionValue": 30,
        "isInternal": true
      },
      {
        "agent": { "name": "ahmed", "isInternal": false },
        "commissionType": { "name": "Fixed" },
        "commissionValue": 1000,
        "isInternal": false
      }
    ],
    "totalExpected": 3751030,
    "totalPaid": 0
  }
}
```

**Displays as:**
```
Seller: Elsayed Elagalad

Agent Commission:
  Main: AED 10,000
  [Expected]
  +2 additional agents
  • Jane Agent: 30% (Internal)
  • ahmed: AED 1,000 (External)
  Total: AED 3,751,030
```

### Deal D022 with Partial Payment:
```json
{
  "dealNumber": "D022",
  "seller": {
    "name": "Elsayed Elagalad"
  },
  "agentCommissions": {
    "mainAgent": {
      "expectedAmount": 1000,
      "paidAmount": 542,
      "status": { "name": "Partially Paid" }
    },
    "additionalAgents": [
      {
        "agent": { "name": "Jane Agent", "isInternal": true },
        "commissionType": { "name": "Override" },
        "commissionValue": 20000,
        "isInternal": true
      }
    ],
    "totalExpected": 645000,
    "totalPaid": 542
  }
}
```

**Displays as:**
```
Seller: Elsayed Elagalad

Agent Commission:
  Main: AED 1,000
  [Partially Paid]
  +1 additional agent
  • Jane Agent: AED 20,000 (Internal)
  Total: AED 645,000 (Paid: AED 542)
```

## Responsive Design

The table uses:
- `overflow-x-auto` for horizontal scrolling on smaller screens
- Consistent padding and spacing
- Dark mode support with appropriate color variants
- Clear visual hierarchy with font sizes and weights

## Key Features

1. ✅ Shows seller information (previously missing)
2. ✅ Detailed agent commission breakdown
3. ✅ Supports multiple additional agents
4. ✅ Distinguishes internal vs external agents
5. ✅ Shows both percentage and fixed commissions
6. ✅ Displays payment status with color coding
7. ✅ Shows total expected and paid amounts
8. ✅ Handles edge cases (no additional agents, missing data)
9. ✅ Maintains backward compatibility
10. ✅ Dark mode support


