import { PnLLine } from '@/types/planVsActuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Slack, 
  RefreshCw, 
  Flag, 
  Eye, 
  AlertTriangle,
  ExternalLink,
  Clock,
  Calculator
} from 'lucide-react';

interface DrilldownPanelProps {
  line: PnLLine | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const formatVariance = (amount: number) => {
  if (Math.abs(amount) >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}mm`;
  } else if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const formatValue = (amount: number, unit: string) => {
  if (unit === 'USD') {
    return formatCurrency(amount);
  } else if (unit === '%') {
    return `${amount.toFixed(1)}%`;
  }
  return amount.toString();
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'QBO':
      return <ExternalLink className="h-4 w-4 text-blue-600" />;
    case 'Rippling':
      return <RefreshCw className="h-4 w-4 text-green-600" />;
    case 'Pigment':
      return <Eye className="h-4 w-4 text-purple-600" />;
    case 'Anaplan':
      return <Eye className="h-4 w-4 text-orange-600" />;
    default:
      return <ExternalLink className="h-4 w-4 text-gray-600" />;
  }
};

const getActionIcon = (type: string) => {
  switch (type) {
    case 'slack':
      return <Slack className="h-4 w-4" />;
    case 'sync':
      return <RefreshCw className="h-4 w-4" />;
    case 'review':
      return <Flag className="h-4 w-4" />;
    case 'flag':
      return <Flag className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const DrilldownPanel = ({ line, onClose }: DrilldownPanelProps) => {
  if (!line || !line.drilldownData) {
    return null;
  }

  const { total, sources, explanation, assumptions, actions } = line.drilldownData;

  return (
    <Card className="mt-4 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>{line.name} - Drill Down</span>
            <Badge variant="outline" className="text-sm">
              Total: {formatValue(total, line.unit)}
            </Badge>
            {line.isCalculated && (
              <Badge variant="secondary" className="text-sm flex items-center space-x-1">
                <Calculator className="h-3 w-3" />
                <span>Calculated</span>
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        {line.driver && (
          <div className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Driver:</span> {line.driver}
          </div>
        )}
        {line.calculation && (
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Formula:</span> {line.calculation}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Narrative Explanation */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Variance Explanation</h4>
          <p className="text-gray-700 text-sm leading-relaxed">{explanation}</p>
        </div>

        <Separator />

        {/* Data Sources */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getSourceIcon(source.source)}
                  <div>
                    <div className="font-medium text-sm">{source.name}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span className="capitalize">{source.type}</span>
                      <span>•</span>
                      <span>Confidence: {source.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(source.amount)}</div>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(source.lastSync).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions */}
        {assumptions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>Key Assumptions</span>
              </h4>
              <div className="space-y-2">
                {assumptions.map((assumption) => (
                  <div key={assumption.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm text-yellow-800">{assumption.description}</div>
                    <div className="text-xs text-yellow-600 mt-1 flex items-center justify-between">
                      <span>Source: {assumption.source}</span>
                      <span>Confidence: {assumption.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {actions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getActionIcon(action.type)}
                      <div>
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-blue-700">{action.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {action.type === 'slack' && 'Send'}
                        {action.type === 'sync' && 'Sync'}
                        {action.type === 'review' && 'Review'}
                        {action.type === 'flag' && 'Flag'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
