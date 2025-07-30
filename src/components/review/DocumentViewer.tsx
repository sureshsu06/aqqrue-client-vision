import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface DocumentViewerProps {
  transaction: any;
}

export function DocumentViewer({ transaction }: DocumentViewerProps) {
  return (
    <div className="w-1/2 p-6 border-r border-mobius-gray-100 overflow-y-auto flex-shrink-0">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-mobius-gray-500">
            <FileText className="w-4 h-4" />
            <span>Original Document</span>
          </div>
          
          {/* Document Controls */}
          <div className="flex space-x-1">
            <Button variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              100%
            </Button>
            <Button variant="outline" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Card className="p-6 bg-gradient-card min-h-[600px] flex items-center justify-center">
          <div className="text-center text-mobius-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <p className="font-medium text-lg mb-2">PDF Document Viewer</p>
            <p className="text-sm">
              Invoice: {transaction.vendor === "WeWork" ? "SEA-BVU-2024-07-1892" : "INV-2024-0789"}
            </p>
            <p className="text-sm">
              {transaction.vendor} - ${transaction.amount.toLocaleString()}
            </p>
            <div className="mt-4 text-xs text-mobius-gray-400">
              PDF rendering with zoom, page controls, and text extraction would appear here
            </div>
          </div>
        </Card>
        
        {/* Page Controls */}
        <div className="flex items-center justify-center space-x-4 text-sm text-mobius-gray-500">
          <Button variant="ghost" size="sm" disabled>
            Previous
          </Button>
          <span>Page 1 of 1</span>
          <Button variant="ghost" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}