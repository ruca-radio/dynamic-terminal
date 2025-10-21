"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color?: "blue" | "green" | "red" | "purple";
}

export default function MetricCard({
  title,
  value,
  trend,
  trendLabel,
  color = "blue",
}: MetricCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass border rounded-lg p-4 bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs">
          {trend > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
          <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
