import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  ChevronDown
} from 'lucide-react';

interface AISuggestion {
  id: string;
  type: 'match' | 'accrual' | 'adjustment';
  description: string;
  confidence: number;
  amount?: number;
  suggestedAction: string;
  reasoning: string;
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  onApplySuggestion?: (suggestion: AISuggestion) => void;
  onRejectSuggestion?: (suggestion: AISuggestion) => void;
}

export function AISuggestions({ suggestions, onApplySuggestion, onRejectSuggestion }: AISuggestionsProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'accrual':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'adjustment':
        return <XCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionBadge = (type: string, confidence: number) => {
    const colorClass = confidence >= 90 ? 'bg-green-50 text-green-700 border-green-200' :
                      confidence >= 70 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200';
    
    return (
      <Badge variant="secondary" className={colorClass}>
        {confidence}% confidence
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'match':
        return 'Transaction Match';
      case 'accrual':
        return 'Accrual Entry';
      case 'adjustment':
        return 'Adjustment Entry';
      default:
        return 'Suggestion';
    }
  };

  return (
    <Card className="border-slate-200 bg-slate-50/50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle className="text-base text-slate-900">
            Aqqrue Agent Suggestions
          </CardTitle>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
            {suggestions.length} suggestions
          </Badge>
        </div>
        <p className="text-xs text-slate-600">
          Based on data patterns from Stripe, GL, and AWS
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-6 text-blue-600">
              <p className="text-sm">No suggestions available at this time.</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div 
                key={suggestion.id}
                className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="text-sm font-medium text-slate-900">
                        {getTypeLabel(suggestion.type)}
                      </span>
                      {getSuggestionBadge(suggestion.type, suggestion.confidence)}
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-2">{suggestion.description}</p>
                    
                    {suggestion.amount && (
                      <div className="text-sm font-mono text-slate-600 mb-2">
                        Amount: ${suggestion.amount.toLocaleString()}
                      </div>
                    )}
                    
                    <p className="text-sm text-slate-600 mb-3">
                      <strong>Suggested Action:</strong> {suggestion.suggestedAction}
                    </p>
                    
                    <button
                      onClick={() => setExpandedSuggestion(
                        expandedSuggestion === suggestion.id ? null : suggestion.id
                      )}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>{expandedSuggestion === suggestion.id ? 'Hide' : 'Show'} reasoning</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${
                        expandedSuggestion === suggestion.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {expandedSuggestion === suggestion.id && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-md">
                        <p className="text-xs text-slate-600">
                          <strong>AI Reasoning:</strong> {suggestion.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-green-700 border-green-200 hover:bg-green-50"
                      onClick={() => onApplySuggestion?.(suggestion)}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-red-700 border-red-200 hover:bg-red-50"
                      onClick={() => onRejectSuggestion?.(suggestion)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="h-8">
                  Auto-Apply All
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Review All
                </Button>
              </div>
              <div className="text-xs text-blue-600">
                Average confidence: {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
