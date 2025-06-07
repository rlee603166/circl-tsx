import React from 'react';

interface CirclLogoProps {
  /** Scale > 0 to enlarge/shrink icon *and* text together (1 ≈ default). */
  scale?: number;

  /* Gap / ring controls (unchanged) */
  gapDegrees?: number;
  gapCenterDeg?: number;
  innerRadius?: number;
  innerGapDegrees?: number;
  innerGapCenterDeg?: number;

  /* Optional toggles */
  showOuterNodes?: boolean;
  showInnerNodes?: boolean;

  /** Extra classes on the wrapper, if needed. */
  className?: string;
}

const BASE_ICON = 30; // px
const BASE_FONT = 20; // px ≈ Tailwind text-2xl

const CirclLogo: React.FC<CirclLogoProps> = ({
  scale = 1.3,
  gapDegrees = 90,
  gapCenterDeg = 270,
  innerRadius = 20,
  innerGapDegrees = 60,
  innerGapCenterDeg = gapCenterDeg + 180,
  showOuterNodes = false,
  showInnerNodes = false,
  className = '',
}) => {
  /* helpers --------------------------------------------------------------- */
  const polar = (r: number, deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  const buildArc = (radius: number, gapDeg: number, gapCenter: number) => {
    const startDeg = (gapCenter + gapDeg / 2) % 360;
    const endDeg   = (gapCenter - gapDeg / 2 + 360) % 360;
    const largeArc = gapDeg < 180 ? 1 : 0;
    const start = polar(radius, startDeg);
    const end   = polar(radius, endDeg);
    return {
      d: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      start,
      end,
    };
  };

  const outer = buildArc(40, gapDegrees, gapCenterDeg);
  const inner = buildArc(innerRadius, innerGapDegrees, innerGapCenterDeg);

  const iconPx  = BASE_ICON * scale;
  const fontPx  = BASE_FONT * scale;
  const nodeR   = 5 * scale;

  /* render ---------------------------------------------------------------- */
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Scalable “C” glyph */}
      <svg
        width={iconPx}
        height={iconPx}
        viewBox="0 0 100 100"
        className="inline-block align-baseline"
      >
        <path d={outer.d} stroke="#111827" strokeWidth={10} fill="none" />
        <path d={inner.d} stroke="#111827" strokeWidth={10} fill="none" />

        {showOuterNodes && (
          <>
            <circle cx={outer.start.x} cy={outer.start.y} r={nodeR} fill="#111827" />
            <circle cx={outer.end.x}   cy={outer.end.y}   r={nodeR} fill="#111827" />
          </>
        )}
        {showInnerNodes && (
          <>
            <circle cx={inner.start.x} cy={inner.start.y} r={nodeR} fill="#111827" />
            <circle cx={inner.end.x}   cy={inner.end.y}   r={nodeR} fill="#111827" />
          </>
        )}
      </svg>

      {/* Remaining letters scale with icon */}
      <span
        style={{ fontSize: `${fontPx}px`, lineHeight: 1 }}
        className="font-bold tracking-tight text-gray-900 flex-center"
      >
        IRCL
      </span>
    </span>
  );
};

export default CirclLogo;
