# Rolling Forecast Application

A comprehensive financial planning and analysis application built with React, TypeScript, and Tailwind CSS.

## Features

### 📊 Rolling Forecast
- **P&L Table**: Detailed profit and loss forecasting with expandable line items
- **Chart Overlays**: Interactive charts with customizable tooltips
- **Scenario Management**: Base case, best case, and worst case scenarios
- **Time Horizons**: 12M, 18M, and 24M forecasting periods
- **Monthly/Quarterly Views**: Toggle between different timeframes

### 🎯 CFO Daily Inbox
- **Inbox Management**: Centralized financial document processing
- **Analysis Tools**: Built-in analysis and review capabilities
- **Document Viewer**: PDF and document handling
- **Workflow Management**: Streamlined approval processes

### 📈 Plan vs Actuals
- **Variance Analysis**: Compare planned vs actual performance
- **KPI Dashboards**: Key performance indicators and metrics
- **Drill-down Capabilities**: Detailed analysis and investigation tools
- **Integration Health**: Monitor data source connections

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Custom component library
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── planVsActuals/     # Rolling forecast components
│   ├── cfo-inbox/         # CFO inbox functionality
│   ├── ui/                # Reusable UI components
│   └── ...
├── pages/                 # Application pages
├── data/                  # Mock data and sample datasets
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and helpers
└── hooks/                 # Custom React hooks
```

## Key Components

### RollingForecast.tsx
The main rolling forecast component featuring:
- Interactive P&L table with expandable sections
- Real-time scenario modeling
- Chart visualizations with custom tooltips
- Editable forecast assumptions

### CFOInbox Components
Complete inbox management system with:
- Document processing workflows
- Analysis and review tools
- Integration with external data sources

## Development

This application is designed for financial planning and analysis professionals, providing:
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Built with accessibility best practices
- **Performance**: Optimized for large datasets and real-time updates
- **Extensibility**: Modular architecture for easy feature additions

## License

This project is for educational and demonstration purposes.
