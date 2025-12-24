# Deal API Integration Update - December 2025

## Overview
This document describes the updates made to integrate the new deal details API response structure into the DealForm component for finance edit mode.

## New API Response Structure

The deal details API (`/api/deals/{id}`) now returns an enhanced response with the following key changes:

### 1. **Buyer/Seller Structure**
- **New**: `buyer.email` and `seller.email` fields are now included
- **New**: Nested `nationality` and `source` objects with `id` and `name`

```json
"buyer": {
  "id": "abc46ebe-da98-4038-bb2a-007713421f41",
  "name": "omar shahin",
  "phone": "+201129379191",
  "email": "oshahin7@gmail.com",
  "source": {
    "id": "78d2473d-1fc9-4bcf-bf14-31f19356b4bb",
    "name": "Bayut"
  },
  "nationality": {
    "id": "88304516-8a4f-419b-87ee-3380bf577b7f",
    "name": "Egypt"
  }
}
```

### 2. **Unit Structure**
- **New**: `unit.bedroom` object nested within unit (previously `bedroomId` at root level)

```json
"unit": {
  "number": "A-1205",
  "type": {
    "id": "1961d7ed-91e4-4c61-8c92-b0d9c815f71d",
    "name": "Offplan"
  },
  "size": 160,
  "bedroom": {
    "id": "aa54c744-d434-4f95-9a03-7f1e66557575",
    "name": "Studio"
  }
}
```

### 3. **Downpayment Field**
- **New**: `downpayment` is now a direct field at root level (number type)

```json
"downpayment": 500000
```

### 4. **Media Attachments**
- **New**: `media` array containing uploaded documents

```json
"media": [
  {
    "id": "eba7c873-c8ef-4d9e-9ffa-6e6a90e54301",
    "mediaType": {
      "id": "324af854-4dca-43a0-813c-305e65be1059",
      "name": "Passport Copy"
    },
    "filename": "Ticket System.docx",
    "fileSize": 74403,
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "uploadedBy": {
      "id": "2df07c3e-536c-4e89-8e7d-2f85e5f5d1ec",
      "name": "Finance User",
      "email": "finance@example.com"
    },
    "createdAt": "2025-12-23T22:54:43.214Z",
    "updatedAt": "2025-12-23T22:54:43.214Z"
  }
]
```

### 5. **Agent Commissions Structure**
- Enhanced structure with `mainAgent` and `additionalAgents`
- Each agent now has detailed commission information including status, currency, due dates

```json
"agentCommissions": {
  "mainAgent": {
    "id": "618751f0-d119-4e02-b812-0bfe33d2c87d",
    "agent": {
      "id": "78c41f5b-6bda-4b02-a8ee-5e034ff46d7c",
      "name": "Agent User",
      "email": "agent@example.com"
    },
    "commissionType": {
      "id": "dd90fc8f-a010-473a-94b7-df6759f01b90",
      "name": "Percentage"
    },
    "commissionValue": 30,
    "expectedAmount": 1,
    "paidAmount": 0,
    "status": {
      "id": "aebed855-41c1-47d9-927c-f40b5fe04af0",
      "name": "Expected"
    },
    "currency": "AED",
    "dueDate": null,
    "paidDate": null
  },
  "additionalAgents": [...]
}
```

## Code Changes Made

### 1. Type Definitions (`lib/deals.ts`)

#### Added New Interfaces:
- `Bedroom` - For bedroom object structure
- `MediaType` - For media type information
- `User` - For uploaded by user information
- `Media` - For media attachments

#### Updated Existing Interfaces:
- `BuyerSeller` - Added `email?: string` field
- `Unit` - Added `bedroom?: Bedroom` field
- `Deal` - Added `downpayment?: number` and `media?: Media[]` fields
- Fixed `numberOfDeal` type to be `number | null` (was duplicated)

### 2. Deal Loader Hook (`lib/hooks/useDealLoader.ts`)

#### Updated Data Extraction:
```typescript
// Extract buyer/seller email
const buyerEmail = (buyer as { email?: string })?.email || "";
const sellerEmail = (seller as { email?: string })?.email || "";

// Extract bedroom from nested unit object
const bedroomId = 
  deal.unit?.bedroom?.id ||
  (deal as unknown as { bedroomId?: string })?.bedroomId || 
  (deal as unknown as { bedroomsId?: string })?.bedroomsId || // backward compatibility
  "";
```

#### Updated Form Reset:
- Now properly extracts and sets `buyerEmail` and `sellerEmail`
- Handles nested `bedroom` object within `unit`
- Maintains backward compatibility with old API structure

### 3. Existing Components (Already Compatible)

The following components already support the new fields and require no changes:

#### `components/DealPreviewModal.tsx`
- Already displays `downpayment` field
- Already displays `buyerEmail` and `sellerEmail` fields

#### `lib/hooks/useDealPreview.ts`
- Already includes `downpayment` in preview data
- Already includes buyer/seller email fields

#### `components/deal-form/UnitDetailsSection.tsx`
- Already uses `bedroomId` field correctly

#### `lib/hooks/useDealFormData.ts`
- Form data structure already includes all required fields

## Backward Compatibility

All changes maintain backward compatibility with the old API structure:

1. **Buyer/Seller**: Checks for both nested objects and flat `sourceId`/`nationalityId` fields
2. **Bedroom**: Checks `unit.bedroom.id`, then falls back to root-level `bedroomId` or `bedroomsId`
3. **Email**: Gracefully handles missing email fields
4. **Downpayment**: Handles both presence and absence of the field

## Testing Recommendations

1. **Edit Mode**: Test loading existing deals with the new API structure
2. **Form Population**: Verify all fields populate correctly from API response
3. **Backward Compatibility**: Test with deals created before the API update
4. **Preview Modal**: Verify all new fields display correctly in preview
5. **Submission**: Ensure form submission works with both new and old structures

## Future Enhancements

### Media Attachments
The API now returns a `media` array, but the frontend doesn't yet display or manage these attachments. Consider:
- Adding a media gallery/list component to view attachments
- Implementing upload functionality
- Adding download/preview capabilities

### Additional Fields
The following fields are now available but not yet utilized:
- `numberOfDeal` - Could be displayed in deal header
- `media` - Document attachments
- Enhanced commission tracking (status, due dates, paid dates)

## Summary

✅ **Completed**:
- Type definitions updated for all new API fields
- Deal loader hook updated to extract new fields
- Backward compatibility maintained
- Email fields integrated for buyer/seller
- Bedroom nested structure handled
- Downpayment field integrated

⏳ **Not Yet Implemented**:
- Media attachments display/management
- Enhanced commission tracking UI
- Number of deal display

All changes are production-ready and maintain full backward compatibility with the existing API structure.

