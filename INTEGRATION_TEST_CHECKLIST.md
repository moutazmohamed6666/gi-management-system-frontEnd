# Integration Test Checklist - New Deal API Structure

## Overview
This checklist helps verify that the new deal details API response structure is properly integrated across all components.

## Test Scenarios

### 1. Deal Form - Edit Mode (Finance Role)

#### Test Case 1.1: Load Existing Deal with New API Structure
**Steps:**
1. Login as Finance user
2. Navigate to Deals page
3. Click "Edit" on an existing deal
4. Verify all fields are populated correctly

**Expected Results:**
- ✅ Buyer email field is populated (if available in API)
- ✅ Seller email field is populated (if available in API)
- ✅ Bedroom field is populated from `unit.bedroom.id`
- ✅ Downpayment field is populated
- ✅ All other fields load correctly

#### Test Case 1.2: Load Deal with Old API Structure (Backward Compatibility)
**Steps:**
1. Load a deal created before the API update
2. Verify all fields still load correctly

**Expected Results:**
- ✅ Form loads without errors
- ✅ Falls back to `bedroomId` if `unit.bedroom` is not available
- ✅ Falls back to `nationalityId`/`sourceId` if nested objects not available
- ✅ Email fields remain empty if not in API response

### 2. Deal Preview Modal

#### Test Case 2.1: Preview with Complete Data
**Steps:**
1. Fill out deal form with all fields
2. Click "Save Deal"
3. Review preview modal

**Expected Results:**
- ✅ Buyer email displays if provided
- ✅ Seller email displays if provided
- ✅ Downpayment displays in Financial Summary section
- ✅ All other fields display correctly

#### Test Case 2.2: Preview with Partial Data
**Steps:**
1. Fill out deal form without email fields
2. Click "Save Deal"
3. Review preview modal

**Expected Results:**
- ✅ Email sections are hidden when not provided
- ✅ Downpayment shows "N/A" if not provided
- ✅ No errors or undefined values

### 3. Finance Review Page

#### Test Case 3.1: View Deal Details
**Steps:**
1. Login as Finance user
2. Navigate to Finance Review for a deal
3. Check Deal Overview section

**Expected Results:**
- ✅ Buyer contact displays (phone)
- ✅ Seller contact displays (phone)
- ✅ Property details load from `deal.property.type.name`
- ✅ Unit details load from `deal.unit.type.name`
- ✅ All nested objects are accessed correctly

### 4. CEO Deal View

#### Test Case 4.1: View Deal as CEO
**Steps:**
1. Login as CEO user
2. Navigate to Deals Pending Approval
3. Click "View" on a deal

**Expected Results:**
- ✅ Deal information displays correctly
- ✅ Property details load from nested objects
- ✅ Commission details display correctly
- ✅ Buyer/Seller info displays (if CEOBuyerSellerInfo is used)

### 5. Type Safety & Linting

#### Test Case 5.1: No TypeScript Errors
**Steps:**
1. Run `npm run build` or check TypeScript compiler
2. Review for any type errors

**Expected Results:**
- ✅ No TypeScript compilation errors
- ✅ All type definitions match API structure
- ✅ No `any` types used for new fields

#### Test Case 5.2: No Linter Errors
**Steps:**
1. Run linter on updated files
2. Check for any warnings or errors

**Expected Results:**
- ✅ No linter errors in `lib/deals.ts`
- ✅ No linter errors in `lib/hooks/useDealLoader.ts`
- ✅ No linter errors in `components/ceo/CEOBuyerSellerInfo.tsx`

### 6. API Response Handling

#### Test Case 6.1: New API Structure
**API Response Example:**
```json
{
  "buyer": {
    "id": "...",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "source": { "id": "...", "name": "Bayut" },
    "nationality": { "id": "...", "name": "UAE" }
  },
  "unit": {
    "number": "A-101",
    "type": { "id": "...", "name": "Apartment" },
    "size": 1200,
    "bedroom": { "id": "...", "name": "2BR" }
  },
  "downpayment": 500000
}
```

**Expected Results:**
- ✅ Extracts `buyer.email` correctly
- ✅ Extracts `unit.bedroom.id` correctly
- ✅ Extracts `downpayment` correctly
- ✅ Handles nested `source` and `nationality` objects

#### Test Case 6.2: Old API Structure (Backward Compatibility)
**API Response Example:**
```json
{
  "buyerSellerDetails": [
    {
      "id": "...",
      "name": "John Doe",
      "phone": "+1234567890",
      "nationalityId": "...",
      "sourceId": "...",
      "isBuyer": true
    }
  ],
  "bedroomId": "...",
  "unitNumber": "A-101",
  "size": "1200"
}
```

**Expected Results:**
- ✅ Falls back to `buyerSellerDetails` array
- ✅ Falls back to `bedroomId` at root level
- ✅ Handles missing email gracefully
- ✅ No errors or crashes

### 7. Edge Cases

#### Test Case 7.1: Missing Optional Fields
**Steps:**
1. Load deal with minimal data (no email, no downpayment)
2. Verify form handles missing fields

**Expected Results:**
- ✅ Email fields show empty string
- ✅ Downpayment shows empty string
- ✅ No undefined or null errors

#### Test Case 7.2: Null vs Undefined
**Steps:**
1. Test with `null` values in API response
2. Test with missing fields (undefined)

**Expected Results:**
- ✅ Both handled gracefully
- ✅ Fallback to empty string or default value
- ✅ No type errors

#### Test Case 7.3: Media Array
**Steps:**
1. Load deal with media attachments
2. Check if media array is accessible

**Expected Results:**
- ✅ Media array is available in Deal type
- ✅ No errors when media is present
- ✅ No errors when media is empty/undefined

## Files Updated

### Type Definitions
- ✅ `lib/deals.ts` - Added new interfaces and updated existing ones

### Hooks
- ✅ `lib/hooks/useDealLoader.ts` - Updated data extraction logic

### Components
- ✅ `components/ceo/CEOBuyerSellerInfo.tsx` - Updated to use new type and display email

### Documentation
- ✅ `DEAL_API_INTEGRATION_UPDATE.md` - Comprehensive documentation

## Regression Testing

### Critical Paths to Test
1. **Agent Flow:**
   - ✅ Create new deal
   - ✅ View own deals
   - ✅ Cannot edit existing deals (view-only)

2. **Finance Flow:**
   - ✅ View all deals
   - ✅ Edit existing deals
   - ✅ Approve/reject deals
   - ✅ Collect commissions

3. **CEO Flow:**
   - ✅ View dashboard metrics
   - ✅ View individual deals
   - ✅ Approve/reject deals

## Performance Considerations

### API Response Size
- ✅ New structure includes more nested objects
- ✅ Verify no performance degradation
- ✅ Check network payload size

### Component Rendering
- ✅ Verify no unnecessary re-renders
- ✅ Check memoization still works
- ✅ Validate form performance

## Sign-Off Checklist

Before deploying to production:

- [ ] All test cases pass
- [ ] No TypeScript errors
- [ ] No linter warnings
- [ ] Backward compatibility verified
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Tested in development environment
- [ ] Tested with real API data
- [ ] Edge cases handled
- [ ] Error handling verified

## Known Limitations

1. **Media Attachments:** API returns media array, but UI doesn't display/manage it yet
2. **Number of Deal:** Field exists in API but not displayed in UI
3. **Enhanced Commission Tracking:** New fields (status, due dates) not fully utilized in UI

## Future Enhancements

1. Add media attachments viewer/manager
2. Display `numberOfDeal` in deal header
3. Enhance commission tracking with status and dates
4. Add email validation in form
5. Add email to buyer/seller search/autocomplete

