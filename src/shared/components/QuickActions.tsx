"use client";

import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export default function QuickActions({
  actions,
  className = "",
}: QuickActionsProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Acciones Rápidas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`group p-4 border border-border rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105 ${action.color}`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
