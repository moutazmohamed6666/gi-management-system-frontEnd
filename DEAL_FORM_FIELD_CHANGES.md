# Deal Form Field Changes - Quick Reference

## Field Mapping: Old API → New API

| Old Field Name | New Field Name | Type | Status | Notes |
|----------------|----------------|------|--------|-------|
| `bedroomsId` | `bedroomId` | string (UUID) | ✏️ **RENAMED** | Changed to singular |
| `purchaseValue` | `downpayment` | number | 🔄 **REPLACED** | Different field with different purpose |
| `numberOfDeal` | ❌ | number | 🗑️ **REMOVED** | Was always 1, now handled by backend |
| `stageId` | ❌ | string (UUID) | 🗑️ **REMOVED** | No longer in API |
| `agentCommissionTypeOverride` | ❌ | boolean | 🗑️ **REMOVED** | Override logic removed |
| ❌ | `downpayment` | number | ✨ **NEW** | New field for downpayment amount |
| `closeDate` | `closeDate` | string (ISO) | 🔧 **MODIFIED** | Now optional (not required for agents) |

## UI Changes

### Deal Information Section
**Before:**
- Booking Date
- CF Expiry
- Close Date
- Deal Type
- Status
- Purchase Status
- **Purchase Value** ← 🗑️ REMOVED

**After:**
- Booking Date
- CF Expiry
- Close Date
- Deal Type
- Status
- Purchase Status
- **Downpayment** ← ✨ NEW

### Unit Details Section
**Before:**
- Unit Number
- Unit Type
- Size
- **Bedrooms** (field: `bedroomsId`) ← ✏️ RENAMED

**After:**
- Unit Number
- Unit Type
- Size
- **Bedrooms** (field: `bedroomId`) ← ✨ UPDATED

## Form Data Type Changes

### Before:
```typescript
export type DealFormData = {
  // ...
  bedroomsId: string;
  purchaseValue: string;
  // ...
}
```

### After:
```typescript
export type DealFormData = {
  // ...
  bedroomId: string;
  downpayment: string;
  // ...
}
```

## API Payload Changes

### Before:
```json
{
  "dealValue": 0,
  "purchaseValue": 0,
  "bedroomsId": "uuid-here",
  "numberOfDeal": 1,
  "stageId": "uuid-here",
  // ...
}
```

### After:
```json
{
  "dealValue": 0,
  "downpayment": 0,
  "bedroomId": "uuid-here",
  // numberOfDeal removed
  // stageId removed
  // ...
}
```

## Preview Modal Changes

### Before:
- Shows "Purchase Value" if available

### After:
- Shows "Downpayment" if available

## Migration Notes

1. **No database migration needed**: These are frontend-only changes
2. **Backward compatibility**: Loading old deals will work (checks for both `bedroomsId` and `bedroomId`)
3. **User experience**: The form looks the same, just different field names
4. **Data validation**: All existing validations still apply

## Checklist for Developers

- [x] Update form type definitions
- [x] Update API types
- [x] Update submission logic
- [x] Update loader logic (with backward compatibility)
- [x] Update all section components
- [x] Update preview modal
- [x] Update preview hook
- [x] Run linter checks
- [x] Document changes

## Testing Checklist

- [ ] Create a new deal with downpayment
- [ ] Create a new deal without downpayment (should be optional)
- [ ] Edit an existing deal
- [ ] Load an old deal (test backward compatibility)
- [ ] Preview a deal before submission
- [ ] Test as Agent role
- [ ] Test as Finance role
- [ ] Test as CEO role
- [ ] Verify commission calculations
- [ ] Check form validation

