import { useState } from "react";
import { TransactionInbox } from "@/components/TransactionInbox";
import { ReviewInterface } from "@/components/ReviewInterface";

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <div className="h-full">
      {/* Transaction Inbox */}
      <TransactionInbox onTransactionSelect={setSelectedTransaction} />

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