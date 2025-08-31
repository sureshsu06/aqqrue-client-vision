import { IntegrationHealth as IntegrationHealthType } from '@/types/planVsActuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock,
  ExternalLink 
} from 'lucide-react';

interface IntegrationHealthProps {
  integrations: IntegrationHealthType[];
  onRefresh: (system: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSystemIcon = (system: string) => {
  switch (system.toLowerCase()) {
    case 'quickbooks online':
      return <ExternalLink className="h-4 w-4 text-blue-600" />;
    case 'rippling':
      return <RefreshCw className="h-4 w-4 text-green-600" />;
    case 'pigment':
      return <ExternalLink className="h-4 w-4 text-purple-600" />;
    case 'anaplan':
      return <ExternalLink className="h-4 w-4 text-orange-600" />;
    default:
      return <ExternalLink className="h-4 w-4 text-gray-600" />;
  }
};

export const IntegrationHealth = ({ integrations, onRefresh }: IntegrationHealthProps) => {
  const formatTimeAgo = (lastSync: string) => {
    const now = new Date();
    const syncTime = new Date(lastSync);
    const diffMs = now.getTime() - syncTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Integration Health</span>
          <Badge variant="outline">System Status</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.system}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getSystemIcon(integration.system)}
                <div>
                  <div className="font-medium text-sm">{integration.system}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <span>Sync: {integration.syncFrequency}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(integration.lastSync)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefresh(integration.system)}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Sync</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Issues Summary */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Active Issues</h4>
          <div className="space-y-2">
            {integrations
              .filter(integration => integration.issues.length > 0)
              .map(integration => (
                <div key={integration.system} className="text-sm">
                  <span className="font-medium text-red-600">{integration.system}:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {integration.issues.map((issue, index) => (
                      <li key={index} className="text-red-600 flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {integrations.every(integration => integration.issues.length === 0) && (
              <div className="text-sm text-green-600 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>All systems are healthy</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
