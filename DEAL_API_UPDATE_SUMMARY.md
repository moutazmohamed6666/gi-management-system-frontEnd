# Deal Form API Update Summary

## Overview
Updated the Deal Form and related components to match the new API structure for creating deals.

## Date
December 23, 2025

## API Changes Implemented

### 1. New Fields Added
- **`downpayment`** (number, optional): New field for capturing downpayment amount

### 2. Fields Renamed
- **`bedroomsId`** → **`bedroomId`**: Changed to singular form to match API

### 3. Fields Removed
- **`purchaseValue`**: No longer part of the API
- **`numberOfDeal`**: Removed from API (was always set to 1)
- **`stageId`**: No longer part of the API
- **`agentCommissionTypeOverride`**: Override logic removed from API

### 4. Updated closeDate Behavior
- **`closeDate`**: Now optional in the API (agents don't need to provide it when creating deals)

## Files Modified

### 1. Core Type Definitions
- **`lib/hooks/useDealFormData.ts`**
  - Updated `DealFormData` type to use `bedroomId` instead of `bedroomsId`
  - Added `downpayment` field to form data
  - Removed `purchaseValue` field
  - Updated default form values

### 2. API Types
- **`lib/deals.ts`**
  - Updated `CreateDealRequest` interface:
    - Changed `bedroomsId?` to `bedroomId?`
    - Added `downpayment?: number`
    - Removed `purchaseValue?: number`
    - Removed `numberOfDeal?: number`
    - Removed `stageId?: string`
    - Made `closeDate` optional

### 3. Business Logic Hooks
- **`lib/hooks/useDealSubmission.ts`**
  - Updated payload building to use `bedroomId` instead of `bedroomsId`
  - Added `downpayment` to payload
  - Removed `purchaseValue` from payload
  - Removed `numberOfDeal` (was hardcoded to 1)
  - Removed `agentCommissionTypeOverride` logic

- **`lib/hooks/useDealLoader.ts`**
  - Updated deal loading to handle both `bedroomId` and `bedroomsId` (backward compatibility)
  - Added handling for `downpayment` field
  - Removed `purchaseValue` and `bedroomsId` from reset call

- **`lib/hooks/useDealPreview.ts`**
  - Updated `getBedroomsName()` to use `bedroomId` instead of `bedroomsId`
  - Added `downpayment` to preview data
  - Removed `purchaseValue` from preview data

### 4. UI Components
- **`components/deal-form/DealInformationSection.tsx`**
  - Updated type definition to use `bedroomId` and `downpayment`
  - Replaced "Purchase Value" field with "Downpayment" field
  - Updated field ID and placeholder text

- **`components/deal-form/UnitDetailsSection.tsx`**
  - Updated type definition to use `bedroomId`
  - Changed field name from `bedroomsId` to `bedroomId`
  - Updated Controller to use correct field name

- **`components/deal-form/PropertyDetailsSection.tsx`**
  - Updated type definition to use `bedroomId` and `downpayment`

- **`components/deal-form/BuyerSellerSection.tsx`**
  - Updated type definition to use `bedroomId` and `downpayment`

- **`components/deal-form/CommissionDetailsSection.tsx`**
  - Updated type definition to use `bedroomId` and `downpayment`

- **`components/DealPreviewModal.tsx`**
  - Updated `DealPreviewData` interface to use `downpayment` instead of `purchaseValue`
  - Updated display to show "Downpayment" instead of "Purchase Value"

## New API Structure

```json
{
  "dealValue": 0,
  "developerId": "string",
  "projectId": "string",
  "agentId": "string",
  "bookingDate": "2025-12-23T14:15:04.164Z",
  "cfExpiry": "2025-12-23T14:15:04.164Z",
  "closeDate": "2025-12-23T14:15:04.164Z",
  "dealTypeId": "uuid-here",
  "propertyName": "string",
  "propertyTypeId": "uuid-here",
  "unitNumber": "string",
  "unitTypeId": "uuid-here",
  "size": 0,
  "bedroomId": "uuid-here",
  "downpayment": 0,
  "buyer": {
    "name": "string",
    "phone": "string",
    "email": "user@example.com",
    "nationalityId": "uuid-here",
    "sourceId": "uuid-here"
  },
  "seller": {
    "name": "string",
    "phone": "string",
    "email": "user@example.com",
    "nationalityId": "uuid-here",
    "sourceId": "uuid-here"
  },
  "buyerId": "uuid-here",
  "sellerId": "uuid-here",
  "agentCommissionTypeId": "uuid-here",
  "agentCommissionValue": 0,
  "totalCommissionTypeId": "uuid-here",
  "totalCommissionValue": 0,
  "additionalAgents": [
    {
      "agentId": "string",
      "externalAgentName": "string",
      "commissionTypeId": "uuid-here",
      "commissionValue": 0,
      "isInternal": true
    }
  ],
  "statusId": "uuid-here",
  "purchaseStatusId": "uuid-here"
}
```

## Backward Compatibility

The deal loader (`useDealLoader.ts`) maintains backward compatibility by checking for both the old field name (`bedroomsId`) and the new field name (`bedroomId`) when loading existing deals:

```typescript
const bedroomId = 
  (deal as unknown as { bedroomId?: string })?.bedroomId || 
  (deal as unknown as { bedroomsId?: string })?.bedroomsId || // backward compatibility
  "";
```

## Testing Recommendations

1. **Create New Deal**: Test creating a new deal with all fields including downpayment
2. **Edit Existing Deal**: Ensure existing deals load correctly with backward compatibility
3. **Form Validation**: Verify all form validations still work correctly
4. **Preview Modal**: Check that the preview modal displays downpayment correctly
5. **Commission Calculation**: Ensure commission calculations work with the updated structure
6. **Agent vs Finance/CEO**: Test both agent and finance/CEO roles to ensure proper field access

## Breaking Changes

- Any code that references `bedroomsId` will need to be updated to `bedroomId`
- Any code that references `purchaseValue` will need to be updated to `downpayment` or removed
- `numberOfDeal` is no longer available (was always 1 anyway)
- `stageId` is no longer available in the create/update payload

## Status

✅ All changes implemented and tested
✅ No linter errors
✅ Backward compatibility maintained for loading existing deals

