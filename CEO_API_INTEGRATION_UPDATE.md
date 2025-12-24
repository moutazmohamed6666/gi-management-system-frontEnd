# CEO Dashboard - New API Integration Update

## Overview
Updated the CEO dashboard components to integrate with the new API data structure that includes nested objects for buyer, seller, property, unit, commissions, and media.

## Changes Made

### 1. **CEODealView.tsx**
- Updated buyer/seller extraction to support both old (`buyerSellerDetails` array) and new (`buyer`/`seller` objects) API structures
- Added proper TypeScript type casting for `BuyerSeller` type
- Enhanced buyer/seller information display to include:
  - Email addresses
  - Nationality (nested object)
  - Source (nested object)
- Added new **Media Files Section** to display attached documents with:
  - Media type name
  - Filename
  - File size
  - Uploaded by user
  - Upload date

### 2. **CEODealInfo.tsx**
- Added support for nested status objects (`deal.status.name`)
- Added display for:
  - **Status** (from `deal.status.name`)
  - **Purchase Status** (from `deal.purchaseStatus.name`)
  - **Deal Type** (from `deal.dealType.name`)
  - **Downpayment** (new field)
- Updated currency formatting to handle null values
- Reorganized grid layout to accommodate new fields

### 3. **CEOPropertyDetails.tsx**
- Updated to extract property details from nested `property` object:
  - Property name: `deal.property.name`
  - Property type: `deal.property.type.name`
- Updated to extract unit details from nested `unit` object:
  - Unit number: `deal.unit.number`
  - Unit type: `deal.unit.type.name`
  - Unit size: `deal.unit.size`
  - Bedrooms: `deal.unit.bedroom.name`
- Maintains backward compatibility with old flat structure
- Expanded grid to show all property and unit fields

### 4. **CEOBuyerSellerInfo.tsx**
- Enhanced buyer information display to include:
  - Email address
  - Nationality (from `buyer.nationality.name`)
  - Source (from `buyer.source.name`)
- Enhanced seller information display to include:
  - Email address
  - Nationality (from `seller.nationality.name`)
  - Source (from `seller.source.name`)

### 5. **CEOCommissionDetails.tsx**
- Updated to support new `agentCommissions` structure:
  - Main agent commission details
  - Additional agents array
  - Total expected and paid amounts
- Added support for nested `totalCommission` object:
  - `deal.totalCommission.commissionValue`
  - `deal.totalCommission.value`
  - `deal.totalCommission.type`
- Maintains backward compatibility with old `commissions` array
- Removed unused `formatDate` function

### 6. **CEODealsList.tsx**
- Updated buyer name display to support both new and old API structures
- Maintains backward compatibility with `buyerSellerDetails` array

## New API Structure Support

### Deal Object Fields
```typescript
{
  // Basic deal info
  id: string
  dealNumber: string
  dealValue: number
  
  // Nested objects
  status: { id: string, name: string }
  purchaseStatus: { id: string, name: string }
  dealType: { id: string, name: string }
  
  // Property details
  property: {
    name: string
    type: { id: string, name: string }
  }
  
  // Unit details
  unit: {
    number: string
    type: { id: string, name: string }
    size: number
    bedroom: { id: string, name: string }
  }
  
  // Buyer/Seller with nested objects
  buyer: {
    id: string
    name: string
    phone: string
    email: string
    source: { id: string, name: string }
    nationality: { id: string, name: string }
  }
  seller: {
    id: string
    name: string
    phone: string
    email: string
    source: { id: string, name: string }
    nationality: { id: string, name: string }
  }
  
  // Commission details
  totalCommission: {
    value: number
    commissionValue: number
    type: { id: string, name: string }
  }
  agentCommissions: {
    mainAgent: {
      id: string
      agent: { id: string, name: string, email: string }
      commissionType: { id: string, name: string }
      commissionValue: number
      expectedAmount: number
      paidAmount: number
      status: { id: string, name: string }
      currency: string
      dueDate: string | null
      paidDate: string | null
    }
    additionalAgents: []
    totalExpected: number
    totalPaid: number
  }
  
  // Media files
  media: [
    {
      id: string
      mediaType: { id: string, name: string }
      filename: string
      fileSize: number
      mimeType: string
      uploadedBy: { id: string, name: string, email: string }
      createdAt: string
      updatedAt: string
    }
  ]
  
  // Dates
  bookingDate: string
  cfExpiry: string
  closeDate: string | null
  createdAt: string
  updatedAt: string
  
  // New fields
  downpayment: number
  numberOfDeal: number | null
}
```

## Backward Compatibility
All components maintain backward compatibility with the old API structure:
- Falls back to `buyerSellerDetails` array if `buyer`/`seller` objects not present
- Falls back to flat property fields if nested `property`/`unit` objects not present
- Falls back to `commissions` array if `agentCommissions` object not present
- Uses type casting to handle union types safely

## Testing Recommendations
1. Test with deals from the new API structure
2. Test with deals from the old API structure (if any still exist)
3. Verify all nested fields display correctly
4. Verify media files section displays when present
5. Test approve/reject functionality with new structure
6. Verify commission calculations work with new structure

## Files Modified
- `components/CEODealView.tsx`
- `components/ceo/CEODealInfo.tsx`
- `components/ceo/CEOPropertyDetails.tsx`
- `components/ceo/CEOBuyerSellerInfo.tsx`
- `components/ceo/CEOCommissionDetails.tsx`
- `components/CEODealsList.tsx`

## No Breaking Changes
All changes are additive and maintain backward compatibility with existing code.

