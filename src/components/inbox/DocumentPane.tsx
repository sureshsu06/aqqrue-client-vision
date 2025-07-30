import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText,
  Download
} from "lucide-react";
import { Transaction } from "./InboxList";

interface DocumentPaneProps {
  transaction: Transaction;
}

export function DocumentPane({ transaction }: DocumentPaneProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    // Map transaction to PDF files in public/documents directory
    const pdfFiles: Record<string, string> = {
      "WeWork": "/documents/250101.pdf",
      "AWS": "/documents/250102.pdf", 
      "Farm Again": "/documents/Farm Again Senseware.pdf",
      "Vanta Inc": "/documents/Sales_51 (1).pdf",
      "Zoom": "/documents/PCD-143.pdf"
    };
    
    // Try to find a matching document based on vendor name
    const matchedDocument = pdfFiles[transaction.vendor];
    
    if (matchedDocument) {
      setPdfUrl(matchedDocument);
    } else {
      // If no exact match, try to find a document that might be related
      const fallbackDocument = Object.values(pdfFiles)[0]; // Use first document as fallback
      setPdfUrl(fallbackDocument);
    }
  }, [transaction.vendor]);

  return (
    <div className="flex-1 bg-white border-l border-mobius-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">Original Document</h4>
          {pdfUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 p-4">
        {pdfUrl ? (
          <div className="h-full border border-mobius-gray-200 rounded-lg overflow-hidden">
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-mobius-gray-500">
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-3 stroke-current fill-none" />
              <p className="font-medium">No Document Available</p>
              <p className="text-sm">Upload a document to view it here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}