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
    // Use the pdfFile property from the transaction
    if (transaction.pdfFile) {
      const pdfUrl = `/documents/${transaction.pdfFile}`;
      setPdfUrl(pdfUrl);
    } else {
      setPdfUrl("");
    }
  }, [transaction.pdfFile]);

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