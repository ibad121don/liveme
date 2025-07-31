"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

interface SingleRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  label?: string;
}

const gradient = "linear-gradient(90deg, #5A43C6, #8761FF)";

const SingleRangeSlider: React.FC<SingleRangeSliderProps> = ({
  min = 0.1,
  max = 25,
  step = 0.1,
  initialValue = 10,
  onChange,
  className = "",
  label,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleStart = useCallback(() => setIsDragging(true), []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      );
      const newValue = min + (percentage / 100) * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      setValue(steppedValue);
      onChange?.(steppedValue);
    },
    [isDragging, min, max, step, onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  const percentage = getPercentage(value);

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-[#05004E] mb-2">{label}</label>}

      <div className="relative w-full">
        {/* Value Label */}
        <div
          className="absolute -top-7 text-sm text-[#8761FF] font-semibold transform -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        >
          {value.toFixed(1)}%
        </div>

        {/* Slider Track */}
        <div ref={sliderRef} className="relative h-2 rounded-full bg-[#E5EAF4]">
          {/* Active Fill */}
          <div
            className="absolute h-2 rounded-full"
            style={{
              width: `${percentage}%`,
              background: gradient,
            }}
          />

          {/* Thumb */}
          <div
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            className="absolute w-5 h-5 border-4 border-[#8761FF] bg-[#22242D] rounded-full top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing shadow-lg"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleRangeSlider;
