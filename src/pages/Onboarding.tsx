import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AboutCompanyTab } from "@/components/onboarding/AboutCompanyTab";
import { PlaygroundTab } from "@/components/onboarding/PlaygroundTab";

const Onboarding = () => {
  const [activeTab, setActiveTab] = useState("about-company");

  return (
    <div className="h-full flex flex-col app-container">

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-full shadow-sm p-1">
              <button 
                onClick={() => setActiveTab("about-company")}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  activeTab === "about-company" 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted)] hover:bg-[var(--primary-weak)]'
                }`}
              >
                About Company
              </button>
              <button 
                onClick={() => setActiveTab("playground")}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  activeTab === "playground" 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-[var(--muted)] hover:bg-[var(--primary-weak)]'
                }`}
              >
                Playground
              </button>
            </div>
          </div>

          <TabsContent value="about-company" className="mt-0">
            <AboutCompanyTab />
          </TabsContent>

          <TabsContent value="playground" className="mt-0">
            <PlaygroundTab />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default Onboarding;
