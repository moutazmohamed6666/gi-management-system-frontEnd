# API Integration Guide

This document describes the API integration setup for the GI Management System frontend.

## Configuration

### Base URL

The API base URL is configured in `lib/api.ts`. It defaults to `http://89.233.104.64:5000` but can be overridden using the environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://89.233.104.64:5000
```

## Authentication

### Login Flow

1. User submits credentials via the Login component
2. Credentials are sent to `/api/auth/login` endpoint
3. On success, the JWT token is stored in `sessionStorage` as `authToken`
4. User data (role, username, etc.) is stored in `sessionStorage`
5. User is redirected to the dashboard

### Token Management

- **Storage**: JWT tokens are stored in `sessionStorage` for security
- **Usage**: All authenticated API requests automatically include the token in the `Authorization: Bearer <token>` header
- **Functions**:
  - `getAuthToken()` - Retrieve stored token
  - `setAuthToken(token)` - Store token
  - `removeAuthToken()` - Clear token on logout

### Example Login Request

```typescript
import { authApi } from "@/lib/api";

const response = await authApi.login({
  username: "agent",
  password: "123456",
});
// Response: { token: "...", user: {...} }
```

## Filter Endpoints

The following filter endpoints are available for fetching dropdown data:

1. **Developers**: `GET /api/filters/developers`
2. **Agents**: `GET /api/filters/agents`
3. **Projects**: `GET /api/filters/projects`
4. **Statuses**: `GET /api/filters/statuses`
5. **Commission Types**: `GET /api/filters/commission-types`
6. **Deal Types**: `GET /api/filters/deal-types`
7. **Property Types**: `GET /api/filters/property-types`
8. **Unit Types**: `GET /api/filters/unit-types`
9. **Lead Sources**: `GET /api/filters/lead-sources`
10. **Nationalities**: `GET /api/filters/nationalities`
11. **Purchase Statuses**: `GET /api/filters/purchase-statuses`

### Using Filters

#### Option 1: Using the React Hook (Recommended)

```typescript
import { useFilters } from "@/lib/useFilters";

function MyComponent() {
  const { developers, agents, isLoading, error } = useFilters();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Select>
      {developers.map((dev) => (
        <SelectItem key={dev.id} value={dev.id}>
          {dev.name}
        </SelectItem>
      ))}
    </Select>
  );
}
```

#### Option 2: Direct API Calls

```typescript
import { filtersApi } from "@/lib/filters";

// Fetch a single filter
const developers = await filtersApi.getDevelopers();

// Fetch all filters at once
import { fetchAllFilters } from "@/lib/filters";
const allFilters = await fetchAllFilters();
```

## API Client

All API requests should use the `apiClient` function from `lib/api.ts`:

```typescript
import { apiClient } from "@/lib/api";

// GET request
const data = await apiClient<MyDataType>("/api/endpoint");

// POST request
const result = await apiClient<ResponseType>("/api/endpoint", {
  method: "POST",
  body: JSON.stringify({ key: "value" }),
});
```

The `apiClient` automatically:

- Adds the base URL
- Includes authentication token in headers
- Handles JSON serialization/deserialization
- Provides error handling

## Error Handling

API errors are thrown as `ApiError` objects:

```typescript
try {
  const data = await apiClient("/api/endpoint");
} catch (error: ApiError) {
  console.error(error.message); // Error message
  console.error(error.status); // HTTP status code
}
```

## Finance Dashboard Endpoints

The finance dashboard provides 11 endpoints for various metrics and data:

1. **KPIs**: `GET /api/finance-dashboard/kpis` - Get all KPI metrics
2. **Deals by Stage**: `GET /api/finance-dashboard/deals-by-stage` - Get deals breakdown by stage
3. **Exceptions Summary**: `GET /api/finance-dashboard/exceptions-summary` - Get exceptions summary
4. **Commission Transfers**: `GET /api/finance-dashboard/commission-transfers` - Get commission transfers metrics
5. **Top Performance**: `GET /api/finance-dashboard/top-performance` - Get top performance by role
6. **Receivables Forecast**: `GET /api/finance-dashboard/receivables-forecast` - Get receivables forecast
7. **Recent Finance Notes**: `GET /api/finance-dashboard/recent-finance-notes` - Get recent finance notes
8. **Agent Metrics**: `GET /api/finance-dashboard/agent-metrics` - Get agent-specific dashboard metrics
9. **Finance Metrics**: `GET /api/finance-dashboard/finance-metrics` - Get finance dashboard metrics
10. **CEO Metrics**: `GET /api/finance-dashboard/ceo-metrics` - Get CEO dashboard metrics
11. **Admin Metrics**: `GET /api/finance-dashboard/admin-metrics` - Get admin dashboard metrics

### Using Finance Dashboard APIs

```typescript
import { financeApi } from "@/lib/finance";

// Fetch KPIs
const kpis = await financeApi.getKPIs();

// Fetch deals by stage
const dealsByStage = await financeApi.getDealsByStage();

// Fetch finance metrics
const financeMetrics = await financeApi.getFinanceMetrics();

// All endpoints return fully typed responses
```

All finance API functions are available in `financeApi` and return fully typed responses. See `lib/finance.ts` for all available types and functions.

## File Structure

```
lib/
  ├── api.ts          # API configuration and client utilities
  ├── filters.ts      # Filter fetching functions
  ├── finance.ts      # Finance dashboard API functions and types
  └── useFilters.ts   # React hook for filters
```

## Authentication State

The app checks authentication in:

- `components/AppLayout.tsx` - Verifies token on mount
- `app/login/page.tsx` - Handles login flow
- `components/Login.tsx` - Performs actual login API call

On logout, all session data and tokens are cleared.
