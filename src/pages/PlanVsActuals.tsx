import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  mockBudgetVersions, 
  mockEntities, 
  mockPnLLines, 
  mockForecastDrivers,
  mockRollingForecastData
} from '@/data/planVsActualsData';
import { 
  BudgetVersion, 
  Entity, 
  ForecastDriver,
  RollingForecastData
} from '@/types/planVsActuals';
import { HeaderControls } from '@/components/planVsActuals/HeaderControls';
import { PnLTable } from '@/components/planVsActuals/PnLTable';
import { RollingForecast } from '@/components/planVsActuals/RollingForecast';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar
} from 'lucide-react';


export default function PlanVsActuals() {
  const [selectedBudgetVersion, setSelectedBudgetVersion] = useState<BudgetVersion>(mockBudgetVersions[0]);
  const [selectedEntity, setSelectedEntity] = useState<Entity>(mockEntities[0]);
  const [selectedDate, setSelectedDate] = useState<string>('April 2025');
  const [selectedStatement, setSelectedStatement] = useState<string>('PnL');

  const [forecastDrivers, setForecastDrivers] = useState<ForecastDriver[]>(mockForecastDrivers);
  const [rollingForecastData, setRollingForecastData] = useState<RollingForecastData>(mockRollingForecastData);
  const [activeTab, setActiveTab] = useState('plan-vs-actuals');

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting board-ready report...');
  };

  const handleDriversChange = (drivers: ForecastDriver[]) => {
    setForecastDrivers(drivers);
  };

  const handleRollingForecastChange = (data: RollingForecastData) => {
    setRollingForecastData(data);
  };

  return (
    <div className="bg-white">
      <div className="px-2 py-4">
        {/* Header Controls */}
        <HeaderControls
          budgetVersions={mockBudgetVersions}
          entities={mockEntities}
          selectedBudgetVersion={selectedBudgetVersion}
          selectedEntity={selectedEntity}
          onBudgetVersionChange={setSelectedBudgetVersion}
          onEntityChange={setSelectedEntity}
          onExport={handleExport}
          onToggleChat={() => {}}
          isChatOpen={false}
        />

        {/* Main Content */}
        <div className="w-full">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'plan-vs-actuals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('plan-vs-actuals')}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Plan vs Actuals</span>
                </div>
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rolling-forecast'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('rolling-forecast')}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Rolling Forecast</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Plan vs Actuals Tab */}
            {activeTab === 'plan-vs-actuals' && (
              <div className="space-y-6">
                {/* Date and Statement Selectors */}
                <div className="flex items-center space-x-4 mb-4">
                  {/* Date Selector */}
                  <div className="flex flex-col space-y-1">
                    <Select
                      value={selectedDate}
                      onValueChange={setSelectedDate}
                    >
                      <SelectTrigger className="w-[180px] h-10 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-normal text-gray-900">{selectedDate || 'April 2025'}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January 2025">January 2025</SelectItem>
                        <SelectItem value="February 2025">February 2025</SelectItem>
                        <SelectItem value="March 2025">March 2025</SelectItem>
                        <SelectItem value="April 2025">April 2025</SelectItem>
                        <SelectItem value="May 2025">May 2025</SelectItem>
                        <SelectItem value="June 2025">June 2025</SelectItem>
                        <SelectItem value="July 2025">July 2025</SelectItem>
                        <SelectItem value="August 2025">August 2025</SelectItem>
                        <SelectItem value="September 2025">September 2025</SelectItem>
                        <SelectItem value="October 2025">October 2025</SelectItem>
                        <SelectItem value="November 2025">November 2025</SelectItem>
                        <SelectItem value="December 2025">December 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Statement Type Selector */}
                  <div className="flex flex-col space-y-1">
                    <Select
                      value={selectedStatement}
                      onValueChange={setSelectedStatement}
                    >
                      <SelectTrigger className="w-[160px] h-10 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-normal text-gray-900">{selectedStatement}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PnL">Profit & Loss</SelectItem>
                        <SelectItem value="Balance Sheet">Balance Sheet</SelectItem>
                        <SelectItem value="Cash Flow">Cash Flow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* P&L Table */}
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <PnLTable
                      pnlLines={mockPnLLines}
                    />
                  </CardContent>
                </Card>

                
              </div>
            )}

            {/* Rolling Forecast Tab */}
            {activeTab === 'rolling-forecast' && (
              <div className="space-y-6">
                <RollingForecast
                  drivers={forecastDrivers}
                  onDriversChange={handleDriversChange}
                  rollingForecastData={rollingForecastData}
                  onRollingForecastChange={handleRollingForecastChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
