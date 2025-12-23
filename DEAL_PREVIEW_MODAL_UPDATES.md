# Deal Preview Modal Updates

## Overview
Updated the Review Deal Details modal to show comprehensive commission details with clear separation between deal commission and agent commissions.

## Changes Made

### 1. Updated `DealPreviewData` Interface (DealPreviewModal.tsx)

**Removed:**
- `commissionRate: string` (generic field)
- `commissionType: string` (generic field)
- `totalCommissionValue?: string` (generic field)
- `additionalAgentCommission?: string` (simplified field)

**Added:**
- **Deal Commission Fields:**
  - `dealCommissionRate: string` - The rate/value for the overall deal commission
  - `dealCommissionType: string` - Type of commission for the deal (Fixed/Percentage)
  - `totalDealCommission?: string` - Total commission value for the deal

- **Main Agent Commission Fields:**
  - `mainAgentName?: string` - Name of the main agent
  - `mainAgentCommissionRate?: string` - Commission rate/value for main agent
  - `mainAgentCommissionType?: string` - Type of commission for main agent
  - `mainAgentCommissionValue?: string` - Expected commission value for main agent

- **Additional Agent Commission Fields:**
  - `additionalAgentCommissionRate?: string` - Commission rate/value for additional agent
  - `additionalAgentCommissionType?: string` - Type of commission for additional agent
  - `additionalAgentCommissionValue?: string` - Expected commission value for additional agent

### 2. Updated Modal UI (DealPreviewModal.tsx)

**Restructured Commission Display:**

1. **Financial Summary Section** - Simplified to show only:
   - Sales Value
   - Purchase Value (if applicable)

2. **Deal Commission Section** (NEW) - Blue/Indigo theme:
   - Commission Type
   - Commission Rate/Value
   - Total Deal Commission (highlighted)

3. **Agent Commissions Section** (NEW) - Separated into:
   
   **Main Agent Subsection** (Emerald theme):
   - Agent Name
   - Commission Type
   - Commission Rate/Value
   - Expected Commission (highlighted)
   
   **Additional Agent Subsection** (Purple theme):
   - Type (Internal/External)
   - Agent Name
   - Commission Type
   - Commission Rate/Value
   - Expected Commission (highlighted)

### 3. Updated Data Preparation (DealForm.tsx)

**Modified `getPreviewData()` function:**

- Added helper functions:
  - `getDealCommissionTypeName()` - Gets commission type for the deal
  - `getAgentCommissionTypeName()` - Gets commission type for main agent
  - `getAdditionalAgentCommissionTypeName()` - Gets commission type for additional agent
  - `getMainAgentName()` - Gets current logged-in agent's name from sessionStorage

- Updated return object to map form data to new structure:
  - Deal commission fields mapped from `totalCommissionTypeId` and `totalCommissionValue`
  - Main agent fields mapped from `agentCommissionTypeId` and `commRate`
  - Additional agent fields mapped from `agencyCommissionTypeId` and `agencyComm`

## Visual Improvements

1. **Color-Coded Sections:**
   - Deal Commission: Blue/Indigo gradient
   - Main Agent: Emerald/Green gradient
   - Additional Agent: Purple gradient

2. **Clear Hierarchy:**
   - Section headers with proper font weights
   - Subsection headers for agent types
   - Highlighted totals with borders and bold text

3. **Better Information Architecture:**
   - Separated deal-level commission from agent-level commissions
   - Clear distinction between main and additional agents
   - All commission details visible in one view

## Benefits

1. **Clarity:** Users can now clearly see the difference between:
   - Total deal commission (what the company receives)
   - Agent commissions (what agents will receive)

2. **Transparency:** All commission details are visible before submission:
   - Commission types for each party
   - Rates/values for each commission
   - Expected amounts for agents

3. **Better Review:** Finance and management can review complete commission structure before deal approval

## Testing Recommendations

1. Test with deals that have:
   - Only main agent (no additional agent)
   - Main agent + internal additional agent
   - Main agent + external additional agent

2. Verify commission calculations display correctly for:
   - Fixed commission types
   - Percentage-based commission types
   - Mixed commission types (deal vs agent)

3. Check responsive layout on different screen sizes

## Notes

- The modal maintains backward compatibility with existing form data structure
- All commission fields are optional to handle various deal scenarios
- Currency formatting is consistent using the existing `formatCurrency` function
- Dark mode support is maintained throughout all new sections

