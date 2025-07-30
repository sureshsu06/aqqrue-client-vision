import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";

interface DocumentViewerProps {
  transaction: any;
}

export function DocumentViewer({ transaction }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    // Map transaction to PDF URLs (converted Dropbox URLs to direct download)
    const pdfFiles: Record<string, string> = {
      "WeWork": "https://www.dropbox.com/scl/fi/gvhefbnqpur1zrp93vlsz/250101-1.pdf?rlkey=5cx24o1nhdf4owc76yi2kjefk&st=1pwbz48m&dl=1",
      "Starbucks Coffee": "https://www.dropbox.com/scl/fi/r1ehtyims93rtc43dzea0/Bharath-Electronics-Invoice.pdf?rlkey=zzvf3u5ha0ueq7mlf0dry62em&st=5hmlav0k&dl=1",
      "Farm Again": "https://www.dropbox.com/scl/fi/qq65zajhhn1afkms0mdjw/Farm-Again-Senseware.pdf?rlkey=sscc0wguljeabi3ybm2yhmec0&st=4vbal20e&dl=1"
    };
    
    setPdfUrl(pdfFiles[transaction.vendor] || pdfFiles["WeWork"]);
  }, [transaction.vendor]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const resetZoom = () => setZoom(100);

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
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetZoom}>
              {zoom}%
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Card className="p-2 bg-white border min-h-[600px] overflow-hidden">
          {pdfUrl ? (
            <div className="w-full h-[580px] flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <p className="font-medium text-lg mb-2">PDF Document</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Invoice: {transaction.vendor === "WeWork" ? "250101-1" : 
                           transaction.vendor === "Farm Again" ? "Farm-Again-Senseware" : 
                           "Bharath-Electronics-Invoice"}
                </p>
                <p className="text-sm mb-4">
                  {transaction.vendor} - ${transaction.amount.toLocaleString()}
                </p>
                <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open PDF in New Tab
                </a>
                <div className="mt-4 text-xs text-muted-foreground">
                  Click to view the full document in a new tab
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[580px] text-center text-muted-foreground">
              <div>
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p className="font-medium text-lg mb-2">No Document</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Add your PDF files to public/documents/ in Dev Mode
                </div>
              </div>
            </div>
          )}
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