# CFO Daily Inbox

A Superhuman-inspired finance inbox that surfaces the most critical items that move cash, revenue, risk, and runway today.

## Overview

The CFO Daily Inbox is designed to help finance leaders quickly identify and act on the most important financial items that require attention. It provides a two-pane interface similar to modern email clients, with actionable insights and playbooks for each item.

## Features

### 🎯 **Smart Prioritization**
- **Priority Score (0-100)**: Calculated using Materiality × Urgency × Confidence × (PolicyWeight + ExecWatchlist)
- **Severity Levels**: High (Red), Medium (Amber), Low (Blue)
- **AI-Powered Insights**: Each item explains why it's in today's list

### 📊 **Comprehensive Categories**
- **ARR/Revenue**: Renewals at risk, deal slips, revenue recognition
- **Cash/Working Capital**: AR past due, cash runway drift, FX exposure
- **Spend/Gross Margin**: Hosting spikes, vendor renewals, policy breaches
- **People/Payroll**: Hiring vs freeze windows, overtime anomalies
- **Close/Compliance**: Month-end tasks, SOC2 gaps, tax deadlines
- **Operations**: System issues, process bottlenecks

### 🔍 **Advanced Filtering & Sorting**
- **Filters**: Priority, Category, Entity, Owner, Due-today, Status
- **Sorting**: Priority score, Due time, $ Impact, Newest
- **Real-time Updates**: Data freshness indicators for each source

### 📋 **Actionable Playbooks**
- **One-click Actions**: Slack AE, Create task, Approve/Reject, Post accrual
- **Impact Prediction**: Estimated financial impact and probability for each action
- **Audit Trail**: Complete logging of who did what and when

## Usage

### Accessing the Inbox
1. Navigate to **CFO Daily Inbox** in the left sidebar
2. The page loads with the most critical items first
3. Use filters to focus on specific categories or priorities

### Left Pane - Inbox List
- **Priority Score**: Large colored circle showing 0-100 score
- **Status Indicators**: New, In Progress, Blocked, Snoozed, Done
- **Quick Actions**: Hover over items to see assign/snooze buttons
- **Bulk Actions**: Select multiple items for batch operations

### Right Pane - Detail View
- **AI Summary**: Plain language explanation of why the item matters
- **Impact Analysis**: Financial impact, timing, and confidence metrics
- **Evidence Tabs**:
  - **Overview**: Mini charts and key drivers
  - **Sources**: Linked records from various systems
  - **History**: Timeline of changes and actions
  - **Policy**: Relevant thresholds and breaches
- **Recommendations**: Ranked actions with predicted outcomes
- **People**: Suggested owners and watchers

### Keyboard Shortcuts
- **J/K**: Navigate between items
- **E**: Assign item
- **S**: Snooze item
- **D**: Mark as done
- **Enter**: Open item detail

## Data Sources

The inbox integrates with various financial systems:

- **ARR**: Salesforce, HubSpot, Stripe, Product usage
- **Cash**: QBO/Xero, Banks, Bill.com, Ramp
- **Spend**: AWS/GCP, Snowflake, Datadog
- **People**: Rippling, Workday
- **Close**: FloQast, BlackLine, Vanta

## Mock Data

The current implementation includes realistic mock data for demonstration:

1. **ARR Renewal Risk**: Acme Corp - $420K at risk due to health score decline
2. **AR Past Due**: Top 10 accounts totaling $1.2M with DSO increase
3. **Hosting Cost Spike**: AWS costs 43% over budget due to over-provisioning
4. **Vendor Renewal**: Snowflake contract expiring with auto-renewal risk
5. **Month-end Close**: 3 overdue tasks and 2 pending approvals
6. **Equity Grants**: 5 senior hires pending board approval

## Customization

### Adding New Categories
1. Update the `CFOInboxItem` type in `src/types/cfoInbox.ts`
2. Add category to the navigation filters
3. Include category-specific logic in the detail view

### Modifying Priority Algorithm
The priority score calculation can be adjusted in the `CFOInboxList` component:

```typescript
// Current formula:
PriorityScore = Materiality × Urgency × Confidence × (PolicyWeight + ExecWatchlist)
```

### Adding New Actions
1. Extend the `Recommendation` interface
2. Add action buttons to the detail view
3. Implement action handlers in the main page component

## Technical Architecture

### Components
- **CFODailyInbox**: Main page with two-pane layout
- **CFOInboxHeader**: Stats and global actions
- **CFOInboxFilters**: Filtering and sorting controls
- **CFOInboxList**: Left pane with item list
- **CFOInboxDetail**: Right pane with comprehensive item view
- **CFOInboxStats**: Key metrics display

### State Management
- Uses React hooks for local state
- Resizable panels for flexible layout
- Filter state persists during session

### Styling
- Built with Tailwind CSS
- Follows existing design system patterns
- Responsive design for different screen sizes

## Future Enhancements

### Phase 2 Features
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Machine learning for better prioritization
- **Mobile App**: Native mobile experience
- **Integration APIs**: Connect to actual financial systems
- **Custom Dashboards**: Personalized views for different roles

### Phase 3 Features
- **Predictive Analytics**: Forecast future issues
- **Automated Actions**: AI-powered decision making
- **Advanced Reporting**: Executive summaries and trends
- **Team Collaboration**: Shared workspaces and comments

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Run Development Server**: `npm run dev`
3. **Navigate to**: `/cfo-daily-inbox`
4. **Explore Features**: Try filtering, sorting, and viewing item details

## Support

For questions or feature requests, please refer to the project documentation or contact the development team.

---

*Built with React, TypeScript, and Tailwind CSS*
