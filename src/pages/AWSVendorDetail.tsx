import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  FileText, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'paid' | 'pending' | 'disputed';
  invoiceNumber: string;
  service: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  lineItems: {
    service: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const AWSVendorDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions');

  const transactions: Transaction[] = [
    {
      id: 'TXN-AWS-001',
      date: '2025-08-30',
      description: 'EC2 Instances - Production Environment',
      amount: 45000,
      category: 'Compute',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0894',
      service: 'EC2'
    },
    {
      id: 'TXN-AWS-002',
      date: '2025-08-30',
      description: 'S3 Storage - Data Lake',
      amount: 12000,
      category: 'Storage',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0895',
      service: 'S3'
    },
    {
      id: 'TXN-AWS-003',
      date: '2025-08-30',
      description: 'RDS Database - Production',
      amount: 18000,
      category: 'Database',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0896',
      service: 'RDS'
    },
    {
      id: 'TXN-AWS-004',
      date: '2025-08-30',
      description: 'CloudFront CDN - Global Distribution',
      amount: 8000,
      category: 'Networking',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0897',
      service: 'CloudFront'
    },
    {
      id: 'TXN-AWS-005',
      date: '2025-08-30',
      description: 'Lambda Functions - Serverless Compute',
      amount: 5000,
      category: 'Compute',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0898',
      service: 'Lambda'
    },
    {
      id: 'TXN-AWS-006',
      date: '2025-08-30',
      description: 'Data Transfer - Inter-region',
      amount: 7000,
      category: 'Networking',
      status: 'paid',
      invoiceNumber: 'INV-AWS-0899',
      service: 'Data Transfer'
    }
  ];

  const invoices: Invoice[] = [
    {
      id: 'INV-AWS-0894',
      invoiceNumber: 'INV-AWS-0894',
      date: '2025-08-01',
      dueDate: '2025-08-31',
      amount: 45000,
      status: 'paid',
      description: 'EC2 Instances - Production Environment',
      lineItems: [
        {
          service: 'EC2 m5.large',
          description: 'Production Web Servers',
          quantity: 12,
          unitPrice: 3000,
          total: 36000
        },
        {
          service: 'EC2 m5.xlarge',
          description: 'Production Database Servers',
          quantity: 3,
          unitPrice: 3000,
          total: 9000
        }
      ]
    },
    {
      id: 'INV-AWS-0895',
      invoiceNumber: 'INV-AWS-0895',
      date: '2025-08-01',
      dueDate: '2025-08-31',
      amount: 12000,
      status: 'paid',
      description: 'S3 Storage - Data Lake',
      lineItems: [
        {
          service: 'S3 Standard Storage',
          description: 'Data Lake Storage',
          quantity: 1000,
          unitPrice: 12,
          total: 12000
        }
      ]
    },
    {
      id: 'INV-AWS-0896',
      invoiceNumber: 'INV-AWS-0896',
      date: '2025-08-01',
      dueDate: '2025-08-31',
      amount: 18000,
      status: 'paid',
      description: 'RDS Database - Production',
      lineItems: [
        {
          service: 'RDS db.r5.large',
          description: 'Production Database',
          quantity: 2,
          unitPrice: 9000,
          total: 18000
        }
      ]
    }
  ];

  const totalSpend = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const paidTransactions = transactions.filter(t => t.status === 'paid').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div className="bg-white p-6 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-mobius-gray-600 hover:text-mobius-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Financial Analysis
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-mobius-gray-900">AWS - Vendor Detail</h1>
              <p className="text-xs text-mobius-gray-600">Amazon Web Services - Infrastructure Provider</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-mobius-gray-900">${(totalSpend / 1000).toFixed(0)}K</p>
              <p className="text-xs text-mobius-gray-600">Total Q3 2025 Spend</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-mobius-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-mobius-blue" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-mobius-gray-600">Total Spend</p>
                  <p className="text-xs font-bold text-mobius-gray-900">${(totalSpend / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-mobius-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-mobius-blue" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-mobius-gray-600">Transactions</p>
                  <p className="text-xs font-bold text-mobius-gray-900">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-mobius-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-mobius-gray-600">Paid</p>
                  <p className="text-xs font-bold text-mobius-gray-900">{paidTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-mobius-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-mobius-gray-600">Pending</p>
                  <p className="text-xs font-bold text-mobius-gray-900">{pendingTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-mobius-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-mobius-blue text-mobius-blue'
                    : 'border-transparent text-mobius-gray-500 hover:text-mobius-gray-700 hover:border-mobius-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-mobius-blue text-mobius-blue'
                    : 'border-transparent text-mobius-gray-500 hover:text-mobius-gray-700 hover:border-mobius-gray-300'
                }`}
              >
                Invoices
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'transactions' && (
          <Card className="border-mobius-gray-100">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-mobius-gray-900">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-mobius-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Service</th>
                      <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-mobius-gray-700">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-mobius-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-mobius-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs text-mobius-gray-900">{transaction.id}</td>
                        <td className="py-3 px-4 text-mobius-gray-600">{transaction.date}</td>
                        <td className="py-3 px-4 text-mobius-gray-900">{transaction.description}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{transaction.service}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-mobius-gray-900">
                          ${(transaction.amount / 1000).toFixed(0)}K
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge 
                            variant={transaction.status === 'paid' ? 'default' : 'secondary'}
                            className={`text-xs ${transaction.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/invoices/${transaction.invoiceNumber}`, '_blank')}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="border-mobius-gray-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-mobius-gray-900">{invoice.invoiceNumber}</CardTitle>
                      <p className="text-xs text-mobius-gray-600">{invoice.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-mobius-gray-900">${(invoice.amount / 1000).toFixed(0)}K</p>
                      <Badge 
                        variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                        className={`text-xs ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-mobius-gray-600">Invoice Date</p>
                      <p className="text-xs text-mobius-gray-900">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-mobius-gray-600">Due Date</p>
                      <p className="text-xs text-mobius-gray-900">{invoice.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-mobius-gray-600">Total Amount</p>
                      <p className="text-xs text-mobius-gray-900">${(invoice.amount / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-mobius-gray-200 pt-4">
                    <h4 className="text-xs font-medium text-mobius-gray-900 mb-3">Line Items</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-mobius-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-4 font-medium text-mobius-gray-700">Service</th>
                            <th className="text-left py-2 px-4 font-medium text-mobius-gray-700">Description</th>
                            <th className="text-right py-2 px-4 font-medium text-mobius-gray-700">Quantity</th>
                            <th className="text-right py-2 px-4 font-medium text-mobius-gray-700">Unit Price</th>
                            <th className="text-right py-2 px-4 font-medium text-mobius-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.lineItems.map((item, index) => (
                            <tr key={index} className="border-b border-mobius-gray-100">
                              <td className="py-2 px-4 text-mobius-gray-900">{item.service}</td>
                              <td className="py-2 px-4 text-mobius-gray-600">{item.description}</td>
                              <td className="py-2 px-4 text-right text-mobius-gray-900">{item.quantity}</td>
                              <td className="py-2 px-4 text-right text-mobius-gray-900">${(item.unitPrice / 1000).toFixed(0)}K</td>
                              <td className="py-2 px-4 text-right font-medium text-mobius-gray-900">${(item.total / 1000).toFixed(0)}K</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AWSVendorDetail;
