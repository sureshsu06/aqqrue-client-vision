# Resizable Panes Feature

## Overview

The TransactionInbox component now supports resizable panes, allowing users to customize the layout of the three main sections:

1. **Inbox List** (left) - Shows the list of transactions
2. **Document Pane** (middle) - Displays the original document/PDF
3. **Analysis Pane** (right) - Shows the transaction analysis and summary

## Features

### Resizable Panels
- **Drag to Resize**: Users can drag the resize handles between panels to adjust their widths
- **Minimum/Maximum Constraints**: Each panel has sensible min/max size limits to prevent unusable layouts
- **Smooth Animations**: Resize handles have hover effects and smooth transitions
- **Persistent Layout**: Panel sizes are automatically saved to localStorage and restored on page reload

### Default Sizes
- **Inbox List**: 20% width (min: 15%, max: 40%)
- **Document Pane**: 40% width (min: 25%, max: 60%)
- **Analysis Pane**: 40% width (min: 25%, max: 60%)

### Reset Functionality
- **Reset Button**: A reset button in the header allows users to quickly restore default panel sizes
- **Visual Indicator**: The reset button uses a grip icon to indicate its purpose

## Technical Implementation

### Dependencies
- `react-resizable-panels`: Provides the core resizing functionality
- Custom hook: `usePanelSizes` manages state and localStorage persistence

### Key Components
- `PanelGroup`: Container for all resizable panels
- `Panel`: Individual resizable sections
- `PanelResizeHandle`: Draggable handles between panels
- `usePanelSizes`: Custom hook for state management

### CSS Styling
- Custom CSS ensures smooth resize handles with hover effects
- Panels maintain proper height and scrolling behavior
- Consistent with the existing design system

## Usage

1. **Resize Panels**: Drag the vertical grip handles between panels
2. **Reset Layout**: Click the grip icon button in the header to restore default sizes
3. **Automatic Persistence**: Your layout preferences are automatically saved

## Browser Compatibility

- Modern browsers with CSS Grid support
- localStorage for persistence
- Touch devices supported for mobile resizing

## Future Enhancements

- Keyboard shortcuts for quick resizing
- Preset layouts (e.g., "Document Focus", "Analysis Focus")
- Collapsible panels
- Vertical resizing support for future layouts 