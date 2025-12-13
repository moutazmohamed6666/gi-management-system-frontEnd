"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { mockCommissionRules } from "@/lib/mockData";
import { Plus, Edit, Trash2, Settings } from "lucide-react";

export function CommissionEngine() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Commission Engine</h2>
          <p className="text-gray-600">Manage commission rules and calculations</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Commission Rule
        </Button>
      </div>

      {/* Commission Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCommissionRules.map((rule) => (
              <div key={rule.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-900">{rule.developer}</div>
                      {rule.project && (
                        <div className="px-2 py-1 bg-blue-100 text-blue-900 rounded">
                          {rule.project}
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded text-white ${
                        rule.commissionType === "Percentage" ? "bg-green-600" : "bg-purple-600"
                      }`}>
                        {rule.commissionType}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-gray-600">Commission Rate</div>
                        <div className="text-gray-900">
                          {rule.commissionType === "Percentage" 
                            ? `${rule.commissionValue}%` 
                            : `AED ${rule.commissionValue.toLocaleString()}`
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Agent Split</div>
                        <div className="text-gray-900">{rule.agentSplit}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Manager Split</div>
                        <div className="text-gray-900">{rule.managerSplit}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Company Split</div>
                        <div className="text-gray-900">{rule.companySplit}%</div>
                      </div>
                    </div>
                    
                    {rule.notes && (
                      <div className="mt-3 text-gray-600">
                        <span className="text-gray-900">Notes:</span> {rule.notes}
                      </div>
                    )}
                    
                    <div className="mt-2 text-gray-600">
                      Effective from: {rule.effectiveDate}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Supported Commission Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-gray-900 mb-2">Percentage Commission</div>
              <div className="text-gray-600">Commission calculated as % of selling price</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-gray-900 mb-2">Fixed Commission</div>
              <div className="text-gray-600">Fixed amount per deal</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-gray-900 mb-2">Split Commission</div>
              <div className="text-gray-600">Agent, manager, and company splits</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-gray-900 mb-2">Buyer & Seller Side</div>
              <div className="text-gray-600">Separate commissions for buyer and seller reps</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="text-gray-900 mb-2">Manual Adjustments</div>
              <div className="text-gray-600">Override with reason + audit log</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-gray-900 mb-2">Project-Level Override</div>
              <div className="text-gray-600">Specific rules for individual projects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add Commission Rule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="developer">Developer</Label>
                    <Input id="developer" placeholder="Enter developer name" />
                  </div>
                  <div>
                    <Label htmlFor="project">Project (Optional)</Label>
                    <Input id="project" placeholder="Enter project name" />
                  </div>
                  <div>
                    <Label htmlFor="commissionType">Commission Type</Label>
                    <select
                      id="commissionType"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="commissionValue">Commission Value</Label>
                    <Input id="commissionValue" type="number" placeholder="Enter value" />
                  </div>
                  <div>
                    <Label htmlFor="agentSplit">Agent Split (%)</Label>
                    <Input id="agentSplit" type="number" placeholder="e.g., 80" />
                  </div>
                  <div>
                    <Label htmlFor="managerSplit">Manager Split (%)</Label>
                    <Input id="managerSplit" type="number" placeholder="e.g., 20" />
                  </div>
                  <div>
                    <Label htmlFor="companySplit">Company Split (%)</Label>
                    <Input id="companySplit" type="number" placeholder="e.g., 0" />
                  </div>
                  <div>
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input id="effectiveDate" type="date" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    alert("Commission rule added successfully!");
                    setShowCreateModal(false);
                  }}>
                    Add Rule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

