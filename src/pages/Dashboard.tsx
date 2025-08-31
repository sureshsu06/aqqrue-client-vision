import { useState } from "react";
import { TransactionInbox } from "@/components/TransactionInbox";
import { ReviewInterface } from "@/components/ReviewInterface";

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Transaction Inbox */}
      <div className="flex-1 overflow-hidden">
        <TransactionInbox onTransactionSelect={setSelectedTransaction} />
      </div>

      {/* Review Modal */}
      {selectedTransaction && (
        <ReviewInterface 
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;