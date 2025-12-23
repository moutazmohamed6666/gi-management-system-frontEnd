# Deal Form Hooks - Quick Reference

This directory contains custom hooks for the `DealForm` component, extracted to improve maintainability and testability.

## Quick Import

```typescript
import {
  useDealFormData,
  useDealFormDefaults,
  useDealLoader,
  useDealSubmission,
  useDealPreview,
  useDealValidation,
  useDealFormHelpers,
  // Types
  type DealFormData,
  type UserRole,
} from "@/lib/hooks";
```

## Hooks Overview

| Hook | Purpose | Key Returns |
|------|---------|-------------|
| `useDealFormData` | Form state management | `form`, `watchedFields` |
| `useDealFormDefaults` | Auto-fill defaults | `defaultStatusId`, `originalCommissionValue` |
| `useDealLoader` | Load existing deal | `dealError`, `loadedDealId`, `retryLoadDeal` |
| `useDealSubmission` | Handle submission | `isSubmitting`, `handleFormSubmit`, preview handlers |
| `useDealPreview` | Prepare preview data | `previewData` (formatted for display) |
| `useDealValidation` | Validation functions | `validatePhone`, `validateEmail`, `isValidUuid` |
| `useDealFormHelpers` | Utility functions | `filteredProjects`, `getCurrentRole` |

## Usage Examples

### Basic Setup
```typescript
function MyDealForm() {
  // 1. Get form instance
  const { form, watchedFields } = useDealFormData();
  const { register, control, handleSubmit } = form;

  // 2. Get helpers
  const { getCurrentRole, filteredProjects } = useDealFormHelpers({
    allProjects: projects,
    watchedDeveloperId: watchedFields.developerId,
  });

  // 3. Set defaults
  const { defaultStatusId } = useDealFormDefaults({
    isEditMode: false,
    currentRole: getCurrentRole(),
    statuses,
    purchaseStatuses,
    watchedBookingDate: watchedFields.bookingDate,
    setValue: form.setValue,
  });

  // 4. Handle submission
  const { handleFormSubmit, isSubmitting } = useDealSubmission({
    dealId: null,
    currentRole: getCurrentRole(),
    defaultStatusId,
    originalCommissionValue: null,
    purchaseStatuses,
    onSave: () => console.log("Saved!"),
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Your form fields */}
    </form>
  );
}
```

### Validation
```typescript
function MyForm() {
  const { validatePhone, validateEmail } = useDealValidation();

  return (
    <input
      {...register("buyerPhone", {
        validate: (value) => 
          validatePhone(value) || "Invalid phone number"
      })}
    />
  );
}
```

### Loading Existing Deal
```typescript
function EditDealForm({ dealId }: { dealId: string }) {
  const { form } = useDealFormData();
  
  const { dealError, loadedDealId, retryLoadDeal } = useDealLoader({
    dealId,
    reset: form.reset,
  });

  if (dealError) {
    return (
      <div>
        <p>Error: {dealError}</p>
        <button onClick={retryLoadDeal}>Retry</button>
      </div>
    );
  }

  if (dealId !== loadedDealId) {
    return <p>Loading...</p>;
  }

  return <form>{/* ... */}</form>;
}
```

### Preview Modal
```typescript
function DealFormWithPreview() {
  const { form } = useDealFormData();
  const { pendingFormData, showPreview } = useDealSubmission({...});
  
  const previewData = useDealPreview({
    pendingFormData,
    defaultStatusId: "...",
    developers,
    filteredProjects,
    dealTypes,
    statuses,
    purchaseStatuses,
    propertyTypes,
    unitTypes,
    bedrooms,
    commissionTypes,
    allAgents,
  });

  return (
    <>
      <form>{/* ... */}</form>
      {showPreview && previewData && (
        <PreviewModal data={previewData} />
      )}
    </>
  );
}
```

## Type Definitions

### DealFormData
Complete type definition for the deal form:

```typescript
type DealFormData = {
  // Deal Information
  bookingDate: string;
  cfExpiry: string;
  closeDate: string;
  dealTypeId: string;
  statusId: string;
  purchaseStatusId: string;

  // Property Details
  developerId: string;
  projectId: string;
  propertyName: string;
  propertyTypeId: string;
  unitNumber: string;
  unitTypeId: string;
  size: string;
  bedroomsId: string;
  purchaseValue: string;

  // Buyer/Seller Information
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerNationalityId: string;
  sellerSourceId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerNationalityId: string;
  buyerSourceId: string;

  // Commission Details
  salesValue: string;
  commRate: string;
  agentCommissionTypeId: string;
  totalCommissionTypeId: string;
  totalCommissionValue: string;
  hasAdditionalAgent: boolean;
  additionalAgentType: "internal" | "external";
  additionalAgentId: string;
  agencyName: string;
  agencyComm: string;
  agencyCommissionTypeId: string;

  notes: string;
};
```

### UserRole
```typescript
type UserRole = "agent" | "finance" | "ceo" | "admin";
```

## Hook Dependencies

```
useDealFormData
└── No dependencies (base hook)

useDealFormDefaults
├── Depends on: useDealFormData (types)
└── Side effects: setValue calls

useDealLoader
├── Depends on: useDealFormData (types)
├── Depends on: lib/deals (API)
└── Side effects: reset form, API call

useDealSubmission
├── Depends on: useDealFormData (types)
├── Depends on: lib/deals (API)
└── Side effects: API calls, toast notifications

useDealPreview
├── Depends on: useDealFormData (types)
└── Side effects: None (pure computation)

useDealValidation
└── Side effects: None (pure functions)

useDealFormHelpers
└── Side effects: None (memoized computations)
```

## Testing

### Unit Test Example
```typescript
import { renderHook } from "@testing-library/react-hooks";
import { useDealValidation } from "@/lib/hooks";

describe("useDealValidation", () => {
  it("validates phone numbers", () => {
    const { result } = renderHook(() => useDealValidation());
    
    expect(result.current.validatePhone("+1234567890")).toBe(true);
    expect(result.current.validatePhone("123")).toBe(false);
  });

  it("validates email addresses", () => {
    const { result } = renderHook(() => useDealValidation());
    
    expect(result.current.validateEmail("test@example.com")).toBe(true);
    expect(result.current.validateEmail("invalid")).toBe(false);
    expect(result.current.validateEmail("")).toBe(true); // Optional
  });
});
```

### Integration Test Example
```typescript
import { render, fireEvent, waitFor } from "@testing-library/react";
import { DealForm } from "@/components/DealForm";

describe("DealForm Integration", () => {
  it("submits form with valid data", async () => {
    const onSave = jest.fn();
    const { getByLabelText, getByText } = render(
      <DealForm dealId={null} onBack={() => {}} onSave={onSave} />
    );

    // Fill form
    fireEvent.change(getByLabelText("Booking Date"), {
      target: { value: "2024-01-01" },
    });
    // ... fill other fields

    // Submit
    fireEvent.click(getByText("Save Deal"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});
```

## Best Practices

### 1. Always use with `useFilters`
```typescript
// ✅ Good
const filters = useFilters();
const { form } = useDealFormData();
// Use filters data in other hooks

// ❌ Bad - hooks need filter data
const { form } = useDealFormData();
// Trying to use without filter data
```

### 2. Handle loading states
```typescript
// ✅ Good
if (dealError) return <ErrorState />;
if (!loadedDealId && dealId) return <LoadingState />;

// ❌ Bad - show form while loading
return <DealForm />; // May show stale data
```

### 3. Check preview data exists
```typescript
// ✅ Good
{showPreview && previewData && <PreviewModal data={previewData} />}

// ❌ Bad - may crash if previewData is null
{showPreview && <PreviewModal data={previewData} />}
```

### 4. Use TypeScript strictly
```typescript
// ✅ Good
const data: DealFormData = formData;

// ❌ Bad - lose type safety
const data: any = formData;
```

## Troubleshooting

### Issue: "Form not resetting when deal loads"
**Solution**: Ensure `useDealLoader` receives the `reset` function from `useDealFormData`

```typescript
const { form } = useDealFormData();
useDealLoader({ dealId, reset: form.reset }); // ✅ Correct
```

### Issue: "Preview data shows IDs instead of names"
**Solution**: Ensure all filter options are passed to `useDealPreview`

```typescript
const previewData = useDealPreview({
  pendingFormData,
  developers, // ✅ Must include all lookups
  filteredProjects,
  // ... all other filters
});
```

### Issue: "Validation not working"
**Solution**: Use validation functions in `register` or `Controller`

```typescript
const { validatePhone } = useDealValidation();

// ✅ Correct
<input {...register("phone", { validate: validatePhone })} />

// ❌ Wrong - not hooked up to form
<input onChange={(e) => validatePhone(e.target.value)} />
```

## Performance Tips

1. **Memoize expensive computations**: Already done in hooks
2. **Don't watch unnecessary fields**: Only watch what you need for conditional rendering
3. **Use `useMemo` for filtered data**: Already implemented in `useDealFormHelpers`
4. **Avoid re-creating functions**: Hooks return stable references

## Migration from Old Code

If you have similar form logic elsewhere:

1. Import the hooks: `import { useDealFormData, ... } from "@/lib/hooks"`
2. Replace inline state with hook calls
3. Remove duplicate validation functions
4. Use shared types: `DealFormData`, `UserRole`

## Support

For questions or issues:
- Check this README
- Review `REFACTORING_SUMMARY.md` in `components/deal-form/`
- Review `BEFORE_AFTER.md` for detailed comparison
- Ask the team!

