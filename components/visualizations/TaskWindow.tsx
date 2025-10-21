"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Task {
  id: string | number;
  text: string;
  status: "pending" | "in_progress" | "completed";
}

interface TaskWindowProps {
  title: string;
  tasks: Task[];
}

export default function TaskWindow({ title, tasks }: TaskWindowProps) {
  return (
    <div className="glass-strong rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 p-2 rounded hover:bg-white/5"
            >
              {task.status === "completed" && (
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              )}
              {task.status === "in_progress" && (
                <Loader2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 animate-spin" />
              )}
              {task.status === "pending" && (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}

              <span
                className={`text-sm ${
                  task.status === "completed"
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {task.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
