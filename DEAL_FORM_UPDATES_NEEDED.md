# Deal Form Updates - Backend Discussion Needed

## ✅ Fields Already in Form (Need Type Conversion/Lookup)

These fields exist in the form but need to be converted from strings/names to UUIDs or numbers:

1. **dealValue** (currently `salesValue` as string) → Convert to number
2. **developerId** (currently `developer` as name) → Need API endpoint to lookup UUID by name
3. **projectId** (currently `projectName` as string) → Need API endpoint to lookup UUID by name/developerId
4. **dealTypeId** (currently `dealType` as string) → Need API endpoint to lookup UUID
5. **propertyTypeId** (currently `propertyType` as string) → Need API endpoint to lookup UUID
6. **unitTypeId** (currently `unitType` as string) → Need API endpoint to lookup UUID
7. **size** (currently `sizeSqFt` as string) → Convert to number
8. **buyer.nationalityId** (currently `buyerNationality` as string) → Need API endpoint to lookup UUID
9. **buyer.sourceId** (currently `buyerSource` as string) → Need API endpoint to lookup UUID
10. **seller.nationalityId** (currently `sellerNationality` as string) → Need API endpoint to lookup UUID
11. **seller.sourceId** (currently `sellerSource` as string) → Need API endpoint to lookup UUID

## ❌ Missing Required Fields - Need to Add to Form

### 1. **closeDate** ⚠️ CRITICAL

- **Type**: Date
- **API Field**: `closeDate`
- **Action**: Add as separate date field (different from bookingDate)
- **Question**: Should this be required or optional?

### 2. **agentId** ✅ AUTO-FILL

- **Type**: UUID
- **API Field**: `agentId`
- **Action**: Auto-fill from logged-in user's session (sessionStorage.getItem("userId"))
- **Status**: No form field needed, will be set automatically

### 3. **propertyName** ❓ DISCUSS

- **Type**: String
- **API Field**: `propertyName`
- **Question**: Is this different from project name? Or should we use project name as property name?
- **Recommendation**: If same as project name, we can auto-fill it

## ❌ Missing Optional Fields - Need Backend Decision

### 4. **numberOfDeal** ❓ DISCUSS

- **Type**: Number
- **API Field**: `numberOfDeal`
- **Question**: What does this represent? Number of units? Number of deals in a package?
- **Recommendation**: Default to 1 if not provided?

### 5. **buyerId** ❓ DISCUSS

- **Type**: UUID (optional)
- **API Field**: `buyerId`
- **Question**: Should form allow selecting existing buyer from a list, or always create new buyer from the buyer object?
- **Recommendation**: If creating new buyer, don't send buyerId. If selecting existing, populate buyerId and maybe skip buyer object?

### 6. **sellerId** ❓ DISCUSS

- **Type**: UUID (optional)
- **API Field**: `sellerId`
- **Question**: Same as buyerId - should form allow selecting existing seller?
- **Recommendation**: If creating new seller, don't send sellerId. If selecting existing, populate sellerId.

### 7. **agentCommissionTypeId** ❓ DISCUSS

- **Type**: UUID (optional)
- **API Field**: `agentCommissionTypeId`
- **Question**: How does this relate to the commission rate % field in form? Should we calculate this or is it user-selected?
- **Current Form**: Has `commRate` as percentage
- **Recommendation**: Need to understand commission type system - is it "Percentage" vs "Fixed Amount"?

### 8. **agentCommissionValue** ❓ DISCUSS

- **Type**: Number (optional)
- **API Field**: `agentCommissionValue`
- **Question**: Is this the calculated commission amount, or the rate/percentage value?
- **Current Form**: Has `commRate` percentage and `salesValue`
- **Recommendation**: If commRate is percentage, calculate: `salesValue * (commRate / 100)`

### 9. **totalCommissionTypeId** ❓ DISCUSS

- **Type**: UUID (optional)
- **API Field**: `totalCommissionTypeId`
- **Question**: What is total commission? Is this the overall deal commission type?
- **Recommendation**: May need separate field or calculate from agent commission

### 10. **totalCommissionValue** ❓ DISCUSS

- **Type**: Number (optional)
- **API Field**: `totalCommissionValue`
- **Question**: Is this the total commission for the entire deal (including external agents)?
- **Recommendation**: May need to calculate: agentCommissionValue + sum of additionalAgents commissions

### 11. **stageId** ✅ AUTO-FILL

- **Type**: UUID (optional)
- **API Field**: `stageId`
- **Action**: Auto-set to initial stage UUID (e.g., "Draft" or "Submitted")
- **Question**: What should be the default initial stage for new deals created by agent?

### 12. **statusId** ✅ AUTO-FILL

- **Type**: UUID (optional)
- **API Field**: `statusId`
- **Action**: Auto-set to initial status UUID
- **Question**: What should be the default initial status for new deals created by agent?

### 13. **purchaseStatusId** ✅ AUTO-FILL

- **Type**: UUID (optional)
- **API Field**: `purchaseStatusId`
- **Action**: Auto-set to initial purchase status UUID
- **Question**: What should be the default initial purchase status for new deals created by agent?

## ⚠️ Fields in Form but Mapping Unclear

### 14. **additionalAgents** ⚠️ NEEDS RESTRUCTURING

- **Type**: Array of AdditionalAgent objects
- **API Field**: `additionalAgents[]`
- **Current Form**: Has toggle `hasExternalAgent`, `agencyName`, `agencyComm`
- **Action Needed**:
  - Convert to array format
  - Map `agencyName` → `externalAgentName`
  - Map `agencyComm` → `commissionValue` and determine `commissionTypeId`
  - Set `isInternal: false`
  - Question: What should `agentId` be for external agents? null or empty?

### 15. **bedrooms** ❓ DISCUSS

- **Type**: String (in form)
- **API Field**: Not in API payload
- **Question**: Should this be removed, or is it part of unitTypeId? Can we infer it from unitType?
- **Recommendation**: Remove if not needed, or discuss if it should be added to API

### 16. **notes** ❓ DISCUSS

- **Type**: String (in form)
- **API Field**: Not in API payload
- **Question**: Should backend support storing notes for deals?
- **Recommendation**: Either add to API or remove from form

## Required API Endpoints Needed

To populate dropdowns with UUIDs, we need these endpoints:

1. ✅ `GET /api/developers` - List all developers with {id, name}
2. ✅ `GET /api/projects?developerId={id}` - List projects by developer with {id, name}
3. ✅ `GET /api/deal-types` - List deal types with {id, name}
4. ✅ `GET /api/property-types` - List property types with {id, name}
5. ✅ `GET /api/unit-types` - List unit types with {id, name}
6. ✅ `GET /api/nationalities` - List nationalities with {id, name}
7. ✅ `GET /api/sources` - List lead sources with {id, name}
8. ✅ `GET /api/commission-types` - List commission types with {id, name, type} (to distinguish Percentage vs Fixed)
9. ✅ `GET /api/stages` - List stages with {id, name} (to get initial stage)
10. ✅ `GET /api/statuses` - List statuses with {id, name} (to get initial status)
11. ✅ `GET /api/purchase-statuses` - List purchase statuses with {id, name}

## Summary of Critical Decisions Needed

### High Priority (Required for Form to Work)

1. **closeDate** - Should it be a separate required field?
2. **propertyName** - Is it same as project name or different field?
3. **Commission Mapping** - How to map commission rate % to commissionTypeId and commissionValue?

### Medium Priority (Affects User Experience)

4. **buyerId/sellerId** - Allow selecting existing buyer/seller or always create new?
5. **numberOfDeal** - What does it represent? Default value?
6. **Stage/Status IDs** - What are the default initial values for agent-created deals?

### Low Priority (Nice to Have)

7. **bedrooms field** - Keep or remove?
8. **notes field** - Should backend support it?
9. **Commission calculations** - Should totalCommissionValue be calculated client-side or server-side?

## Recommended Implementation Steps

1. **Phase 1**: Add missing required fields (closeDate, propertyName)
2. **Phase 2**: Integrate API endpoints for UUID lookups (developers, projects, types, etc.)
3. **Phase 3**: Handle commission mapping based on backend decision
4. **Phase 4**: Implement buyerId/sellerId selection if needed
5. **Phase 5**: Clean up unused fields (bedrooms, notes) based on backend decision
