import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Transaction } from "./InboxList";

interface DocumentPaneProps {
  transaction: Transaction;
}

export function DocumentPane({ transaction }: DocumentPaneProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);

  // Mock multiple documents for demonstration
  const getDocumentsForTransaction = (transaction: Transaction) => {
    // In a real implementation, this would come from the transaction data
    const baseDoc = transaction.pdfFile;
    if (!baseDoc) return [];
    
    // For demonstration, create multiple document variations
    const documents = [
      { name: "Original Invoice", file: baseDoc },
      { name: "Supporting Receipt", file: baseDoc.replace('.pdf', '_receipt.pdf') },
      { name: "Approval Document", file: baseDoc.replace('.pdf', '_approval.pdf') },
      { name: "Additional Notes", file: baseDoc.replace('.pdf', '_notes.pdf') }
    ];
    
    return documents;
  };

  const documents = getDocumentsForTransaction(transaction);
  const currentDocument = documents[currentDocIndex];

  useEffect(() => {
    // Use the current document's file
    if (currentDocument?.file) {
      const pdfUrl = `/documents/${currentDocument.file}`;
      setPdfUrl(pdfUrl);
    } else {
      setPdfUrl("");
    }
  }, [currentDocument]);

  const goToPreviousDoc = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
    }
  };

  const goToNextDoc = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h4 className="font-medium text-sm">Original Document</h4>
            
            {/* Document Navigation */}
            {documents.length > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDoc}
                  disabled={currentDocIndex === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                
                <div className="text-xs text-mobius-gray-600">
                  {currentDocIndex + 1} of {documents.length}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDoc}
                  disabled={currentDocIndex === documents.length - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
                
                <div className="text-xs text-mobius-gray-500 ml-2">
                  {currentDocument?.name}
                </div>
              </div>
            )}
          </div>
          
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
      <div className="flex-1 p-4 overflow-y-auto">
        {pdfUrl ? (
          <div className="h-full">
            <div className="border border-mobius-gray-200 rounded-lg overflow-hidden h-full">
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
                style={{ minHeight: '600px' }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-mobius-gray-500">
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