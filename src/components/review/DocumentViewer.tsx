import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface DocumentViewerProps {
  transaction: any;
}

export function DocumentViewer({ transaction }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfError, setPdfError] = useState<string>("");
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const embedRef = useRef<HTMLEmbedElement>(null);

  useEffect(() => {
    // Use the pdfFile property from the transaction
    if (transaction.pdfFile) {
      const pdfUrl = `/documents/${transaction.pdfFile}`;
      console.log("Loading PDF:", pdfUrl, "for transaction:", transaction.id);
      setPdfUrl(pdfUrl);
      setPdfError("");
      setPdfLoaded(false);
    } else {
      console.log("No PDF file specified for transaction:", transaction.id);
      setPdfError("No PDF document available for this transaction.");
      setPdfLoaded(false);
    }
  }, [transaction.pdfFile, transaction.id]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const resetZoom = () => setZoom(100);

  const handlePdfLoad = () => {
    console.log("PDF loaded successfully");
    setPdfLoaded(true);
  };

  const handlePdfError = () => {
    console.log("PDF failed to load");
    setPdfError("PDF could not be displayed. Please download to view.");
    setPdfLoaded(false);
  };

  // Check if PDF is actually loaded after a delay
  useEffect(() => {
    if (pdfUrl) {
      const timer = setTimeout(() => {
        if (!pdfLoaded) {
          console.log("PDF loading timeout - showing fallback");
          setPdfError("PDF loading timeout. Please download to view.");
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [pdfUrl, pdfLoaded]);

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
            {pdfUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        
        <Card className="p-2 bg-white border min-h-[600px] overflow-hidden">
          {pdfUrl ? (
            <div className="relative">
              {/* Debug info */}
              <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-xs p-1 rounded">
                Loading: {pdfUrl}
              </div>
              
              {/* Direct PDF embed */}
              <iframe
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + pdfUrl)}`}
                className="w-full h-[580px] border-0"
                title="PDF Document"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                onLoad={handlePdfLoad}
                onError={handlePdfError}
              />
              
              {/* Fallback if embed doesn't work */}
              <div className="absolute inset-0 flex items-center justify-center bg-white" style={{ display: 'none' }} id="pdf-fallback">
                <div className="text-center">
                  <p className="text-red-500 mb-2">PDF could not be displayed directly</p>
                  <Button asChild>
                    <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[580px] text-center text-muted-foreground">
              <div>
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p className="font-medium text-lg mb-2">PDF Document Viewer</p>
                <p className="text-sm">
                  Invoice: {transaction.vendor} - ₹{transaction.amount.toLocaleString()}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Loading PDF document from public/documents...
                </div>
                <div className="mt-2 text-xs text-red-500">
                  Debug: No PDF URL set for transaction: {transaction.id}
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