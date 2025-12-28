# Deals Table Updates - Seller and Agent Commission Columns

## Summary
Updated the deals table in both `DealsList.tsx` and `CEODealsList.tsx` to display seller information and detailed agent commission breakdown, including support for multiple additional agents.

## Changes Made

### 1. DealsList.tsx
- **Added "Seller" column** - Displays seller name from `deal.seller.name`
- **Added "Agent Commission" column** - Shows detailed commission breakdown:
  - Main agent commission with status badge
  - Additional agents (if any) with commission details
  - Total expected and paid amounts
  - Support for both internal and external agents
  - Support for both percentage and fixed commission types

### 2. CEODealsList.tsx
- **Added "Seller" column** - Displays seller name with backward compatibility for old structure
- **Added "Agent Commission" column** - Same detailed breakdown as DealsList

### 3. Type Definitions Updated
Both components now have enhanced `DealApiResponse` type that includes:

```typescript
agentCommissions?: {
  mainAgent?: {
    id: string;
    agent?: { id: string; name: string; email: string; };
    commissionType?: { id: string; name: string; };
    commissionValue?: number;
    expectedAmount?: number;
    paidAmount?: number;
    status?: { id: string; name: string; };
    currency?: string;
    dueDate?: string | null;
    paidDate?: string | null;
  };
  additionalAgents?: Array<{
    id: string;
    agent?: {
      id?: string;
      name: string;
      email?: string;
      isInternal?: boolean;
    };
    commissionType?: { id: string; name: string; };
    commissionValue: number;
    isInternal: boolean;
  }>;
  totalExpected?: number;
  totalPaid?: number;
};
```

## Table Structure

### New Column Order:
1. Deal ID
2. Property
3. Buyer
4. **Seller** ⭐ NEW
5. Agent
6. Price
7. Commission (Total Deal Commission)
8. **Agent Commission** ⭐ NEW (Detailed breakdown)
9. Status
10. Actions

## Agent Commission Column Features

### Main Agent Display
- Shows main agent's expected amount
- Displays commission status badge (Paid/Partially Paid/Expected)
- Color-coded status indicators:
  - Green: Paid
  - Orange: Partially Paid
  - Gray: Expected/Pending

### Additional Agents Display
- Shows count of additional agents (e.g., "+2 additional agents")
- Lists each additional agent with:
  - Agent name (or "External" for external agents)
  - Commission value (with type - percentage or fixed amount)
  - Internal/External indicator

### Total Summary
- Shows total expected commission across all agents
- Shows total paid amount if any payments have been made
- Separated by a border for clear distinction

## API Response Structure Supported

The implementation handles the following API response structure:

```json
{
  "agentCommissions": {
    "mainAgent": {
      "id": "uuid",
      "agent": { "id": "uuid", "name": "Agent Name", "email": "agent@example.com" },
      "commissionType": { "id": "uuid", "name": "Percentage" },
      "commissionValue": 30,
      "expectedAmount": 1000,
      "paidAmount": 542,
      "status": { "id": "uuid", "name": "Partially Paid" },
      "currency": "AED"
    },
    "additionalAgents": [
      {
        "id": "uuid",
        "agent": { "id": "uuid", "name": "Jane Agent", "email": "agent2@example.com", "isInternal": true },
        "commissionType": { "id": "uuid", "name": "Fixed" },
        "commissionValue": 1000,
        "isInternal": true
      },
      {
        "id": "uuid",
        "agent": { "name": "External Agent", "isInternal": false },
        "commissionType": { "id": "uuid", "name": "Percentage" },
        "commissionValue": 20,
        "isInternal": false
      }
    ],
    "totalExpected": 2000,
    "totalPaid": 542
  }
}
```

## Edge Cases Handled

1. **No additional agents** - Only main agent commission is displayed
2. **Multiple additional agents** - All agents are listed with details
3. **External agents without ID** - Displays "External" as name
4. **Missing commission data** - Gracefully handles undefined/null values
5. **Zero paid amount** - Only shows total expected, hides paid info
6. **Percentage vs Fixed commissions** - Displays appropriate format (% or AED)

## Backward Compatibility

The implementation maintains backward compatibility with:
- Old `buyerSellerDetails` array structure for seller data
- Old commission structure if `agentCommissions` is not available
- Missing or undefined fields in the API response

## Files Modified

1. `components/DealsList.tsx`
2. `components/CEODealsList.tsx`

## Testing Recommendations

1. Test with deals that have no additional agents
2. Test with deals that have 1 additional agent
3. Test with deals that have multiple additional agents
4. Test with both internal and external agents
5. Test with both percentage and fixed commission types
6. Test with various payment statuses (Expected, Partially Paid, Paid)
7. Test with missing/null commission data


