import React from 'react';

interface CirclLogoProps {
  size?: number;
  textSize?: string;
  className?: string;
  /* Outer-gap controls */
  gapDegrees?: number;
  gapCenterDeg?: number;
  /* Inner ring */
  innerRadius?: number;
  innerGapDegrees?: number;
  innerGapCenterDeg?: number;
  /* Styling */
  strokeWidth?: number;
  nodeRadius?: number;
  /* Toggle node dots */
  showOuterNodes?: boolean;
  showInnerNodes?: boolean;
  
}

const CirclLogo: React.FC<CirclLogoProps> = ({
  size = 40,
  textSize = 'text-2xl',
  className = '',
  gapDegrees = 45,
  gapCenterDeg = 60,
  innerRadius = 20,
  innerGapDegrees = 70,
  innerGapCenterDeg = 240,
  strokeWidth = 10,
  nodeRadius = 5,
  showOuterNodes = true,
  showInnerNodes = true,

}) => {
  /* helpers --------------------------------------------------------------- */
  const polar = (r: number, deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  const buildArc = (
    radius: number,
    gapDeg: number,
    gapCenter: number
  ) => {
    const startDeg = (gapCenter + gapDeg / 2) % 360;
    const endDeg = (gapCenter - gapDeg / 2 + 360) % 360;
    const largeArc = gapDeg < 180 ? 1 : 0;
    const start = polar(radius, startDeg);
    const end = polar(radius, endDeg);
    return {
      d: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      start,
      end,
    };
  };

  /* arcs ------------------------------------------------------------------ */
  const outer = buildArc(40, gapDegrees, gapCenterDeg);
  const inner = buildArc(
    innerRadius,
    innerGapDegrees ?? gapDegrees,
    innerGapCenterDeg ?? gapCenterDeg
  );

  /* svg ------------------------------------------------------------------- */
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="shrink-0"
      >
        {/* Rings */}
        <path d={outer.d} stroke="#111827" strokeWidth={strokeWidth} fill="none" />
        <path d={inner.d} stroke="#111827" strokeWidth={strokeWidth} fill="none" />

        {/* Outer nodes */}
        {showOuterNodes && (
          <>
            <circle cx={outer.start.x} cy={outer.start.y} r={nodeRadius} fill="#111827" />
            <circle cx={outer.end.x}   cy={outer.end.y}   r={nodeRadius} fill="#111827" />
          </>
        )}

        {/* Inner nodes */}
        {showInnerNodes && (
          <>
            <circle cx={inner.start.x} cy={inner.start.y} r={nodeRadius} fill="#111827" />
            <circle cx={inner.end.x}   cy={inner.end.y}   r={nodeRadius} fill="#111827" />
          </>
        )}
      </svg>

      <span className={`${textSize} font-semibold tracking-tight text-gray-900`}>
        CIRCL
      </span>
    </div>
  );
};

export default CirclLogo;
