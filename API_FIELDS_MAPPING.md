# Deal Form API Fields Mapping

## Fields Currently in Form ✅

| Form Field                                       | API Field              | Type   | Status                 | Notes                                       |
| ------------------------------------------------ | ---------------------- | ------ | ---------------------- | ------------------------------------------- |
| `salesValue`                                     | `dealValue`            | number | ✅ Needs conversion    | Currently string, API expects number        |
| `developer`                                      | `developerId`          | uuid   | ⚠️ Needs API lookup    | Currently name string, API expects UUID     |
| `projectName`                                    | `projectId`            | uuid   | ⚠️ Needs API lookup    | Currently name string, API expects UUID     |
| `bookingDate`                                    | `bookingDate`          | date   | ✅                     | Matches API                                 |
| `cfExpiry`                                       | `cfExpiry`             | date   | ✅                     | Matches API                                 |
| `dealType`                                       | `dealTypeId`           | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `propertyType`                                   | `propertyTypeId`       | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `unitNumber`                                     | `unitNumber`           | string | ✅                     | Matches API                                 |
| `unitType`                                       | `unitTypeId`           | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `sizeSqFt`                                       | `size`                 | number | ✅ Needs conversion    | Currently string, API expects number        |
| `buyerName`                                      | `buyer.name`           | string | ✅                     | Matches API                                 |
| `buyerPhone`                                     | `buyer.phone`          | string | ✅                     | Matches API                                 |
| `buyerNationality`                               | `buyer.nationalityId`  | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `buyerSource`                                    | `buyer.sourceId`       | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `sellerName`                                     | `seller.name`          | string | ✅                     | Matches API                                 |
| `sellerPhone`                                    | `seller.phone`         | string | ✅                     | Matches API                                 |
| `sellerNationality`                              | `seller.nationalityId` | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `sellerSource`                                   | `seller.sourceId`      | uuid   | ⚠️ Needs API lookup    | Currently string, API expects UUID          |
| `hasExternalAgent` + `agencyName` + `agencyComm` | `additionalAgents[]`   | array  | ⚠️ Needs restructuring | Form has toggle + fields, API expects array |

## Fields Missing from Form ❌

| API Field               | Type   | Required?    | Recommended Action                                               |
| ----------------------- | ------ | ------------ | ---------------------------------------------------------------- |
| `closeDate`             | date   | ✅ Yes       | **ADD** - Should be in form (different from bookingDate)         |
| `agentId`               | uuid   | ✅ Yes       | **AUTO-FILL** - From logged-in user session (sessionStorage)     |
| `numberOfDeal`          | number | ❓           | **DISCUSS** - What is this? Maybe default to 1?                  |
| `propertyName`          | string | ❓           | **DISCUSS** - Is this different from project name?               |
| `buyerId`               | uuid   | ❓ Optional? | **DISCUSS** - For existing buyer lookup? Or create new?          |
| `sellerId`              | uuid   | ❓ Optional? | **DISCUSS** - For existing seller lookup? Or create new?         |
| `agentCommissionTypeId` | uuid   | ❓           | **DISCUSS** - Commission type for agent?                         |
| `agentCommissionValue`  | number | ❓           | **DISCUSS** - Commission value for agent?                        |
| `totalCommissionTypeId` | uuid   | ❓           | **DISCUSS** - Total commission type?                             |
| `totalCommissionValue`  | number | ❓           | **DISCUSS** - Total commission value? Should this be calculated? |
| `stageId`               | uuid   | ❓           | **AUTO-FILL** - Default initial stage?                           |
| `statusId`              | uuid   | ❓           | **AUTO-FILL** - Default initial status?                          |
| `purchaseStatusId`      | uuid   | ❓           | **AUTO-FILL** - Default initial purchase status?                 |

## Fields in Form but Not in API ⚠️

| Form Field | Current Usage     | Action                                                       |
| ---------- | ----------------- | ------------------------------------------------------------ |
| `bedrooms` | Separate field    | **DISCUSS** - Maybe this is part of `unitTypeId`?            |
| `commRate` | Commission rate % | **DISCUSS** - How to map to `agentCommissionTypeId`/`Value`? |
| `notes`    | Additional notes  | **REMOVE** or discuss if backend should store this           |

## Required API Endpoints Needed

1. **GET /api/developers** - To get list of developers with IDs
2. **GET /api/projects?developerId={id}** - To get projects by developer
3. **GET /api/deal-types** - To get deal types with IDs
4. **GET /api/property-types** - To get property types with IDs
5. **GET /api/unit-types** - To get unit types with IDs
6. **GET /api/nationalities** - To get nationalities with IDs
7. **GET /api/sources** - To get lead sources with IDs
8. **GET /api/commission-types** - To get commission types with IDs
9. **GET /api/stages** - To get deal stages with IDs (or use default)
10. **GET /api/statuses** - To get deal statuses with IDs (or use default)
11. **GET /api/purchase-statuses** - To get purchase statuses with IDs (or use default)

## Summary of Decisions Needed

1. **Close Date** - Should this be added as a separate field from bookingDate?
2. **numberOfDeal** - What does this represent? Default value?
3. **propertyName** - Is this different from project name or can we use project name?
4. **buyerId/sellerId** - Should form allow selecting existing buyer/seller or always create new?
5. **Commission Fields** - How to map commission rate % to commissionTypeId and commissionValue?
6. **agentCommissionTypeId/Value** - Should these be calculated or user-entered?
7. **totalCommissionTypeId/Value** - Should these be calculated or user-entered?
8. **Stage/Status IDs** - Should these be auto-set to initial values or user-selectable?
9. **bedrooms field** - Keep or remove? How does it relate to unitTypeId?
10. **notes field** - Keep in form or remove? Should backend support it?
