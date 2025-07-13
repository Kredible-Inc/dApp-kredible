"use client";

import { useState } from "react";

interface ActivityChartProps {
  data: {
    date: string;
    value: number;
  }[];
  title: string;
  className?: string;
}

export default function ActivityChart({
  data,
  title,
  className = "",
}: ActivityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generar datos de ejemplo si no se proporcionan
  const chartData =
    data.length > 0
      ? data
      : Array.from({ length: 7 }, (_, i) => {
          const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          return {
            date: days[i],
            value: 20 + i * 10 + (i % 3) * 5, // Valores determinísticos en lugar de Math.random()
          };
        });

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));

  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>

      <div className="flex items-end justify-between h-32 gap-2">
        {chartData.map((item, index) => {
          const height =
            ((item.value - minValue) / (maxValue - minValue)) * 100;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Bar */}
              <div className="w-full flex justify-center mb-2">
                <div
                  className={`w-full max-w-8 rounded-t-lg transition-all duration-300 ${
                    isHovered
                      ? "bg-primary"
                      : "bg-gradient-to-t from-primary/60 to-primary/20"
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              </div>

              {/* Value tooltip */}
              {isHovered && (
                <div className="absolute -top-8 bg-foreground text-background px-2 py-1 rounded text-xs">
                  {item.value}
                </div>
              )}

              {/* Date */}
              <span className="text-xs text-muted-foreground text-center">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-muted-foreground mt-4">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
}
