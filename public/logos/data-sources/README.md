# Data Source Logos

This folder contains logos for various data sources used in the P&L table.

## Logo Requirements

- **Format**: PNG or SVG (PNG recommended for consistency)
- **Size**: 16x16px or 20x20px (small icons that won't clutter the UI)
- **Style**: Simple, recognizable logos that work well at small sizes
- **Background**: Transparent or white background preferred

## Required Logos

Upload these logo files to this folder:

### Core Business Systems
- `quickbooks-online.png` - QuickBooks Online logo
- `rippling.png` - Rippling HR/Payroll logo
- `netsuite.png` - NetSuite ERP logo
- `hubspot.png` - HubSpot CRM logo

### Cloud Platforms
- `aws.png` - Amazon Web Services logo
- `gcp.png` - Google Cloud Platform logo
- `azure.png` - Microsoft Azure logo

### Other
- `manual-entry.png` - Icon for manually entered data (can be a simple document or pencil icon)

## File Naming

Use the exact filenames listed above. The system automatically maps these filenames to the correct data sources.

## Usage

Once uploaded, the logos will automatically appear next to the info icons in the P&L table, showing users where each line item's data comes from.

## Adding New Data Sources

If you need to add new data sources:

1. Upload the logo to this folder
2. Update `src/lib/dataSourceLogos.ts` to include the new source
3. The logo will automatically appear in the UI
