# Deal Form Sub-Components

This directory contains all the sub-components that make up the DealForm.

## Component Hierarchy

```
DealForm (Parent)
├── DealInformationSection
│   ├── Booking Date
│   ├── CF Expiry
│   ├── Close Date (conditional)
│   ├── Deal Type
│   ├── Status (conditional)
│   └── Purchase Status
│
├── PropertyDetailsSection
│   ├── Developer (cascading)
│   ├── Project (depends on Developer)
│   ├── Property Name
│   └── Property Type
│
├── UnitDetailsSection + PurchaseValueSection
│   ├── Unit Number
│   ├── Unit Type
│   ├── Size
│   ├── Bedrooms
│   └── Purchase Value
│
├── BuyerSellerSection
│   ├── Seller Card
│   │   ├── Name
│   │   ├── Phone
│   │   ├── Email (optional)
│   │   ├── Nationality
│   │   └── Source
│   └── Buyer Card
│       ├── Name
│       ├── Phone
│       ├── Email (optional)
│       ├── Nationality
│       └── Source
│
├── CommissionDetailsSection
│   ├── Sales Value
│   ├── Total Deal Commission
│   │   ├── Type
│   │   └── Value
│   ├── Agent Commission
│   │   ├── Type
│   │   └── Rate/Value
│   └── Additional Agent (conditional)
│       ├── Agent Type (Internal/External)
│       ├── Agent Selection / Name
│       ├── Commission Type
│       └── Commission Value
│
└── Additional Notes Card
```

## Component Responsibilities

### DealInformationSection

Manages all deal-level metadata including dates, type, and status. Handles conditional rendering based on user role (agents don't see certain fields).

### PropertyDetailsSection

Controls property identification with cascading developer→project relationship. Resets project when developer changes.

### UnitDetailsSection

Handles all unit-specific details with numeric validation for unit number and size.

### PurchaseValueSection

Simple component for purchase value input with numeric-only validation.

### BuyerSellerSection

Displays buyer and seller information side-by-side in a responsive grid. Includes phone and email validation.

### CommissionDetailsSection

Most complex section handling:

- Sales value
- Total deal commission
- Agent commission (with role-based restrictions)
- Additional agent toggle and fields
- Override commission type logic
- Real-time commission calculation display

## Shared Props Pattern

All components receive:

- `control` - React Hook Form control object
- `errors` - Form validation errors
- `filtersLoading` - Loading state for dropdowns

Additional props are specific to each component's needs.

## Usage Example

Components are used internally by DealForm:

```tsx
<DealInformationSection
  control={control}
  errors={errors}
  currentRole={currentRole}
  isEditMode={isEditMode}
  // ... other props
/>
```

## Type Definitions

All components share the same `DealFormData` type to ensure consistency. This type is duplicated in each file for now but could be extracted to a shared types file in the future.

## Validation

Validation is handled at the form level through React Hook Form's `rules` prop in Controller components. Each section implements its own validation logic relevant to its fields.
