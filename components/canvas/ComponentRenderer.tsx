"use client";

import type { Component } from "@/types";
import DataTable from "@/components/visualizations/DataTable";
import TaskWindow from "@/components/visualizations/TaskWindow";
import MetricCard from "@/components/visualizations/MetricCard";
import ChartComponent from "@/components/visualizations/ChartComponent";

interface ComponentRendererProps {
  component: Component;
}

export default function ComponentRenderer({ component }: ComponentRendererProps) {
  const renderComponent = () => {
    switch (component.type) {
      case "DataTable":
        return <DataTable {...component.props} />;
      case "TaskWindow":
        return <TaskWindow {...component.props} />;
      case "MetricCard":
        return <MetricCard {...component.props} />;
      case "Chart":
        return <ChartComponent {...component.props} />;
      default:
        return (
          <div className="glass p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Unknown component type: {component.type}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderComponent()}
    </div>
  );
}
