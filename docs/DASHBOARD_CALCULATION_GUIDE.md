# Dashboard Calculation Guide

This document explains how Dashboard numbers are produced, where data comes from, and when data refresh happens.

## Dashboard Data Owner

The dashboard state and calculations are centralized in [src/components/features/dashboard/useDashboardData.ts](src/components/features/dashboard/useDashboardData.ts).

The page composition is in [src/views/HomeView.vue](src/views/HomeView.vue).

## Endpoints Used

The dashboard currently fetches from two endpoints:

1. GET /pockets

- Used to populate pocket list
- Used to compute total balance
- Used to compute active project count (currently derived from pocket count)

2. GET /transactions/recent

- Used to populate recent transactions table

## Data Fetch Sequence

Implemented in fetchDashboardData inside [src/components/features/dashboard/useDashboardData.ts](src/components/features/dashboard/useDashboardData.ts):

1. isLoading = true
2. Request GET /pockets
3. Save result to pockets state
4. Request GET /transactions/recent
5. Save result to recentTransactions state
6. isLoading = false

If any request fails, error is logged and loading still ends.

## Number Sources and Formulas

### 1) Overview Live Total

Rendered in [src/components/features/dashboard/DashboardOverviewHero.vue](src/components/features/dashboard/DashboardOverviewHero.vue).

Source:

- formattedTotalBalance from useDashboardData

Formula:

- totalBalance = sum of pocket.current_balance for all pockets
- formattedTotalBalance = formatCurrency(totalBalance, IDR)

Notes:

- Currency formatter used: useCurrencyFormatter with locale id-ID and default currency IDR.

### 2) Stats: Total Balance

Rendered in [src/components/features/dashboard/DashboardStatsGrid.vue](src/components/features/dashboard/DashboardStatsGrid.vue).

Source:

- Same formattedTotalBalance as Overview

Formula:

- Same as above (sum of all pockets current_balance)

### 3) Stats: Active Projects

Rendered in [src/components/features/dashboard/DashboardStatsGrid.vue](src/components/features/dashboard/DashboardStatsGrid.vue).

Source:

- activeProjectCount prop passed from HomeView

Current implementation:

- activeProjectCount = pockets.length in [src/views/HomeView.vue](src/views/HomeView.vue)

Important:

- This value currently represents number of pockets, not number of project entities.
- Label says Active Projects, but data comes from pocket count.

### 4) Stats: Income

Rendered in [src/components/features/dashboard/DashboardStatsGrid.vue](src/components/features/dashboard/DashboardStatsGrid.vue).

Current implementation:

- Static value 0
- Subtitle Planned summary
- No endpoint currently used

### 5) Stats: Expenses

Rendered in [src/components/features/dashboard/DashboardStatsGrid.vue](src/components/features/dashboard/DashboardStatsGrid.vue).

Current implementation:

- Static value 0
- Subtitle Planned summary
- No endpoint currently used

### 6) Recent Transactions Amount

Rendered in [src/components/features/dashboard/RecentTransactionsCard.vue](src/components/features/dashboard/RecentTransactionsCard.vue).

Source:

- recentTransactions from GET /transactions/recent
- formatCurrency function passed from useDashboardData

Display rule:

- Sign symbol is based on transaction type:
  - INCOMING: prefix +
  - OUTCOMING: prefix -
- Numeric format uses absolute amount formatting helper from useDashboardData.

## Refresh Triggers

Dashboard data is refreshed in these cases:

1. Initial page load

- In [src/views/HomeView.vue](src/views/HomeView.vue), onMounted calls fetchDashboardData.

2. After creating transaction from dashboard floating button

- HomeView opens CreateTransactionDialog.
- On dialog success, handleTransactionCreated calls fetchDashboardData again.

## UI Loading Behavior

- While isLoading is true, HomeView shows DashboardLoadingSkeleton.
- Once loading completes, Overview, Stats, and Recent Transactions sections render.

## Related Files

- [src/views/HomeView.vue](src/views/HomeView.vue)
- [src/components/features/dashboard/useDashboardData.ts](src/components/features/dashboard/useDashboardData.ts)
- [src/components/features/dashboard/DashboardOverviewHero.vue](src/components/features/dashboard/DashboardOverviewHero.vue)
- [src/components/features/dashboard/DashboardStatsGrid.vue](src/components/features/dashboard/DashboardStatsGrid.vue)
- [src/components/features/dashboard/RecentTransactionsCard.vue](src/components/features/dashboard/RecentTransactionsCard.vue)
- [src/components/features/transaction/CreateTransactionDialog.vue](src/components/features/transaction/CreateTransactionDialog.vue)

## Future Improvement Ideas

1. Replace Active Projects metric with real project count from GET /projects.
2. Implement real Income and Expenses summaries from backend aggregation endpoint.
3. Add toast or inline error state when dashboard fetch fails.
4. Fetch pockets and recent transactions concurrently if backend and UX requirements allow it.
