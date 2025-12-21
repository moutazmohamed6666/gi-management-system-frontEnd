# CEO Dashboard - Data Sources and Calculations

This document explains how each metric and visualization in the CEO Dashboard is calculated and which data comes directly from APIs versus being calculated from deals data.

## Overview

The CEO Dashboard combines data from two main sources:

1. **API Endpoints** - Direct metrics from the backend
2. **Deals Data** - Client-side calculations from deal records

## API Endpoints Used

### 1. `financeApi.getCEOMetrics()` → `CEOMetricsResponse`

Returns executive-level metrics directly from the backend.

**Fields:**

- `total_pipeline.value` - Total pipeline value
- `total_pipeline.currency` - Currency code (e.g., "AED")
- `total_pipeline.trend` - Percentage trend (e.g., +15%)
- `total_pipeline.label` - Display label (e.g., "Active deals")
- `closed_deals.count` - Count of closed deals
- `closed_deals.period` - Period label (e.g., "This quarter")
- `executive_overview.quarter_trend` - Quarter trend percentage (e.g., "+32%")
- `executive_overview.period` - Period label

### 2. `financeApi.getTopPerformance()` → `TopPerformanceResponse`

Returns top performers across different roles.

**Fields:**

- `top_agents[]` - Array of top agents
  - `id` - Agent ID
  - `name` - Agent name
  - `total_revenue` - Total revenue generated
- `top_developers[]` - Array of top developers
  - `id` - Developer ID
  - `name` - Developer name
  - `total_revenue` - Total revenue generated
- `top_managers[]` - Array of top managers
  - `id` - Manager ID
  - `name` - Manager name
  - `total_revenue` - Total revenue generated

### 3. `dealsApi.getDeals()` → `Deal[]`

Returns all deals data, which is then filtered and aggregated client-side.

**Key Fields Used:**

- `dealValue` - Deal value (string, converted to number)
- `closeDate` - Deal close date (used for filtering by date range)
- `statusId` - Deal status (e.g., "Closed")
- `commission.total` - Total commission amount
- `agent.id` - Agent ID
- `developer.id` - Developer ID

---

## Metrics Breakdown

### 1. Total Pipeline

**Source:** API with fallback to calculation

- **Primary:** `ceoMetrics.total_pipeline.value` (from API)
- **Fallback:** Sum of `dealValue` for all deals where `statusId !== "Closed"`
- **Display:** Formatted as currency in millions (e.g., "AED 15.2M")
- **Additional:** Trend percentage from `ceoMetrics.total_pipeline.trend`

### 2. Closed Deals Count

**Source:** API with fallback to calculation

- **Primary:** `ceoMetrics.closed_deals.count` (from API)
- **Fallback:** Count of deals where `statusId === "Closed"`
- **Period Label:** From `ceoMetrics.closed_deals.period`

### 3. Total Revenue

**Source:** Calculated from deals

- **Calculation:** Sum of `commission.total` for all filtered deals that have a commission
- **Formula:** `filteredDeals.filter(d => d.commission?.total).reduce((sum, d) => sum + (d.commission?.total || 0), 0)`
- **Display:** Formatted as currency in thousands (e.g., "AED 450K")

### 4. Average Deal Size

**Source:** Calculated from deals

- **Calculation:** Average of all `dealValue` in filtered deals
- **Formula:** `(sum of all dealValues) / filteredDeals.length`
- **Display:** Formatted as currency in millions (e.g., "AED 2.45M")

### 5. Active Agents

**Source:** Calculated from deals

- **Calculation:** Count of unique agent IDs from filtered deals
- **Formula:** `new Set(filteredDeals.map(d => d.agent?.id).filter(Boolean)).size`
- **Note:** Only counts deals with a valid agent ID

### 6. Active Developers

**Source:** Calculated from deals

- **Calculation:** Count of unique developer IDs from filtered deals
- **Formula:** `new Set(filteredDeals.map(d => d.developer?.id).filter(Boolean)).size`
- **Note:** Only counts deals with a valid developer ID

---

## Charts and Visualizations

### 1. Revenue Trend Chart (Line Chart)

**Source:** Calculated from deals

- **Data:** Monthly revenue breakdown for the last 6 months
- **Calculation:**
  - Creates 6 month buckets based on current date
  - Groups deals by `closeDate` month/year
  - Sums `commission.total` for each month
  - Counts number of deals per month
- **Display:** Line chart showing revenue trend over 6 months
- **Empty State:** Shows if no revenue data exists for the period

### 2. Top Agents by Commission (Bar Chart)

**Source:** API data (transformed)

- **Data:** From `topPerformance.top_agents[]`
- **Transformation:**
  - Maps API `total_revenue` to `commission` field for display
  - Preserves `id` and `name` from API
- **Display:** Horizontal bar chart showing commission amounts
- **Empty State:** Shows if no agent performance data exists

### 3. Developer Performance (Bar Chart)

**Source:** API data (transformed)

- **Data:** From `topPerformance.top_developers[]`
- **Transformation:**
  - Maps API `total_revenue` to `value` field for chart
  - Also maps to `commission` for consistency
- **Display:** Vertical bar chart showing revenue per developer
- **Empty State:** Shows if no developer performance data exists

---

## Performance Tables

### 1. Agent Leaderboard

**Source:** API data (transformed)

- **Data:** From `topPerformance.top_agents[]`
- **Transformation:** Same as Top Agents Chart
- **Display:** Ranked list with commission amounts
- **Features:** Highlights #1 position with gold badge

### 2. Top Developers Table

**Source:** API data (transformed)

- **Data:** From `topPerformance.top_developers[]` (top 5 only)
- **Transformation:** Same as Developer Performance Chart
- **Display:** List showing developer name and total value in millions
- **Features:** Green accent bar on hover

### 3. Top Managers Table

**Source:** API data (transformed)

- **Data:** From `topPerformance.top_managers[]`
- **Transformation:**
  - Maps API `total_revenue` to `commission` field
  - Preserves `id` and `name`
- **Display:** Ranked list with revenue amounts
- **Features:** Highlights #1 position with purple badge
- **Empty State:** Shows if no manager performance data exists

---

## Date Filtering

All deals-based calculations respect the date range filter:

- **Filter Applied:** When `startDate` and `endDate` are provided
- **Filter Logic:** Filters deals where `closeDate` falls within the selected range
- **Affects:** All calculated metrics (revenue, averages, counts, charts)
- **Does Not Affect:** API-provided metrics (these are pre-aggregated by the backend)

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     API Endpoints                            │
├─────────────────────────────────────────────────────────────┤
│ 1. getCEOMetrics()                                           │
│    → total_pipeline.value, closed_deals.count, etc.         │
│                                                              │
│ 2. getTopPerformance()                                       │
│    → top_agents[], top_developers[], top_managers[]         │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Deals API Endpoint                          │
├─────────────────────────────────────────────────────────────┤
│ 3. getDeals()                                                │
│    → All deal records with full details                     │
│    → Filtered by date range (if provided)                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              useCEODashboardMetrics Hook                     │
├─────────────────────────────────────────────────────────────┤
│ Calculates:                                                  │
│ • totalPipeline (API primary, deals fallback)               │
│ • closedDeals (API primary, deals fallback)                 │
│ • totalRevenue (from deals.commission.total)                │
│ • avgDealSize (from deals.dealValue)                        │
│ • activeAgents (unique count from deals.agent.id)           │
│ • activeDevelopers (unique count from deals.developer.id)   │
│ • agentPerformance (transforms API top_agents)              │
│ • developerPerformance (transforms API top_developers)      │
│ • managerPerformance (transforms API top_managers)          │
│ • monthlyRevenue (groups deals by closeDate month)          │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Dashboard Sub-Components                        │
├─────────────────────────────────────────────────────────────┤
│ • CEOHeader - Displays executive overview period/trend      │
│ • CEOMetricsCards - 6 metric cards                          │
│ • CEORevenueTrendChart - Line chart                         │
│ • CEOTopAgentsChart - Bar chart                             │
│ • CEOTopDevelopersChart - Bar chart                         │
│ • CEOAgentLeaderboard - Ranked list                         │
│ • CEOTopDevelopersTable - Developer list                    │
│ • CEOTopManagersTable - Manager ranked list                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Points

1. **Hybrid Approach:** The dashboard uses both API-provided metrics and client-side calculations
2. **Fallback Logic:** `totalPipeline` and `closedDeals` prefer API data but fall back to calculations if API data is unavailable
3. **Performance Data:** All top performer data (agents, developers, managers) comes directly from the API
4. **Aggregations:** Revenue trends and averages are calculated client-side from deals
5. **Date Filtering:** Only affects client-side calculations; API metrics are not filtered by date range
6. **Empty States:** All charts and tables handle empty data gracefully with appropriate messages

---

## File Structure

```
components/
├── DashboardCEO.tsx              # Main component (orchestrates data fetching)
├── ceo/
│   ├── useCEODashboardMetrics.ts # Custom hook for all calculations
│   ├── CEOHeader.tsx             # Header section
│   ├── CEOMetricsCards.tsx       # 6 metric cards
│   ├── CEORevenueTrendChart.tsx  # Revenue line chart
│   ├── CEOTopAgentsChart.tsx     # Agents bar chart
│   ├── CEOTopDevelopersChart.tsx # Developers bar chart
│   ├── CEOAgentLeaderboard.tsx   # Agent leaderboard table
│   ├── CEOTopDevelopersTable.tsx # Developers table
│   └── CEOTopManagersTable.tsx   # Managers table
```

---

## Future Considerations

- Consider adding date range parameters to API endpoints for filtered metrics
- Evaluate moving more aggregations to the backend for better performance
- Add caching strategies for frequently accessed metrics
- Consider real-time updates for critical metrics
