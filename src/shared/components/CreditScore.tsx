"use client";

import { useState, useEffect } from "react";

interface CreditScoreProps {
  score: number;
  className?: string;
}

export default function CreditScore({
  score,
  className = "",
}: CreditScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animar el score cuando cambie
  useEffect(() => {
    if (score !== animatedScore) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedScore(score);
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [score, animatedScore]);

  // Calcular el porcentaje del score (400-800 = 400 puntos totales)
  const percentage = ((animatedScore - 400) / 400) * 100;

  // Determinar el color basado en el score
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-500";
    if (score >= 700) return "text-blue-500";
    if (score >= 650) return "text-yellow-500";
    if (score >= 600) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return "Excelente";
    if (score >= 700) return "Muy Bueno";
    if (score >= 650) return "Bueno";
    if (score >= 600) return "Regular";
    return "Necesita Mejora";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 750) return "Tienes un historial crediticio excepcional";
    if (score >= 700) return "Tu historial crediticio es muy sólido";
    if (score >= 650) return "Tu historial crediticio es bueno";
    if (score >= 600) return "Tu historial crediticio es aceptable";
    return "Tu historial crediticio necesita mejorar";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 750) return "⭐";
    if (score >= 700) return "👍";
    if (score >= 650) return "✅";
    if (score >= 600) return "⚠️";
    return "📉";
  };

  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Credit Score
        </h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{getScoreIcon(animatedScore)}</span>
          <span
            className={`text-3xl font-bold ${getScoreColor(animatedScore)}`}
          >
            {animatedScore}
          </span>
        </div>
        <p className={`text-sm font-medium ${getScoreColor(animatedScore)}`}>
          {getScoreLabel(animatedScore)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {getScoreDescription(animatedScore)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>400</span>
          <span>600</span>
          <span>800</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"></div>

          {/* Progress fill */}
          <div
            className={`h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000 ease-out ${
              isAnimating ? "animate-pulse" : ""
            }`}
            style={{ width: `${percentage}%` }}
          ></div>

          {/* Score indicator */}
          <div
            className="absolute top-0 w-1 h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
            style={{ left: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Score ranges */}
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div className="text-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
          <span className="text-muted-foreground">400-550</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
          <span className="text-muted-foreground">550-600</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          <span className="text-muted-foreground">600-650</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
          <span className="text-muted-foreground">650-700</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className="text-muted-foreground">700-800</span>
        </div>
      </div>
    </div>
  );
}
