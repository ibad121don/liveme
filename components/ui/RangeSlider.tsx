"use client";

import React, { useRef, useEffect } from "react";

interface RangeSliderProps {
  values: [number, number]; // strictly [min, max]
  onChange: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  minGap?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  values,
  onChange,
  min = 0.1,
  max = 25,
  step = 0.1,
  minGap = 0.1,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);



useEffect(() => {
  const percent1 = ((values[0] - min) / (max - min)) * 100;
  const percent2 = ((values[1] - min) / (max - min)) * 100;

  if (trackRef.current) {
    trackRef.current.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #5A43C6 ${percent1}%, #5A43C6 ${percent2}%, #dadae5 ${percent2}%)`;
  }
}, [values, min, max]);


  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val <= values[1] - minGap) {
      onChange([val, values[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val >= values[0] + minGap) {
      onChange([values[0], val]);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative h-1 rounded-full bg-[#dadae5] mb-6">
        <div ref={trackRef} className="absolute h-1 w-full rounded-full" />

        {/* Min Range */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values[0]}
          onChange={handleMinChange}
          className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5A43C6]"
        />

        {/* Max Range */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values[1]}
          onChange={handleMaxChange}
          className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5A43C6]"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
