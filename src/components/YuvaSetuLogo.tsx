import React from 'react';

export interface YuvaSetuLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge' | 'footer';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  id?: string;
  theme?: 'dark' | 'light';
}

export const YuvaSetuLogo: React.FC<YuvaSetuLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
  id = 'yuvasetu-official-logo',
  theme = 'dark',
}) => {
  const iconSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-32 h-32',
  };

  const titleSizeMap = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  };

  const taglineSizeMap = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
    '2xl': 'text-base',
  };

  // Reusable SVG Emblem — The official YuvaSetu visual mark:
  // Sunburst Rays + Graduation Cap with Orange Tassel + Suspension Bridge + Converging Orange Road Arches + Open Book
  const LogoEmblem = ({ className: emblemClass = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${emblemClass} drop-shadow-md select-none shrink-0`}
      aria-label="YuvaSetu Official Logo"
    >
      <defs>
        {/* Royal Blue Pages Gradient */}
        <linearGradient id="yuvaPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0077d6" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Dynamic Orange Pathway Gradient */}
        <linearGradient id="yuvaOrangeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>

        <filter id="yuvaOrangeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f97316" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Clean Badge Backing Circle */}
      <circle cx="250" cy="250" r="240" fill="#FFFFFF" />

      {/* Center Logo Group */}
      <g transform="translate(250, 240) scale(0.96)">
        {/* 1. SUNBURST RAYS (Vibrant Orange #F25C05) */}
        <g stroke="#F25C05" strokeWidth="9" strokeLinecap="round">
          <line x1="0" y1="-170" x2="0" y2="-136" />
          <line x1="-50" y1="-160" x2="-35" y2="-128" />
          <line x1="50" y1="-160" x2="35" y2="-128" />
          <line x1="-95" y1="-134" x2="-68" y2="-108" />
          <line x1="95" y1="-134" x2="68" y2="-108" />
          <line x1="-122" y1="-92" x2="-90" y2="-79" />
          <line x1="122" y1="-92" x2="90" y2="-79" />
          <line x1="-132" y1="-42" x2="-100" y2="-42" />
          <line x1="132" y1="-42" x2="100" y2="-42" />
        </g>

        {/* 2. SUSPENSION BRIDGE SILHOUETTE (Navy #0A2540) */}
        <g fill="#0A2540" stroke="#0A2540">
          {/* Left Bridge Tower */}
          <g transform="translate(-145, 0)">
            <polygon points="-26,28 -18,-72 -14,-72 -14,28" />
            <polygon points="14,28 14,-72 18,-72 26,28" />
            <rect x="-15" y="-60" width="30" height="6" />
            <rect x="-17" y="-34" width="34" height="6" />
            <rect x="-21" y="-6" width="42" height="7" />
            <path d="M-14,28 L-14,0 Q0,-14 14,0 L14,28 Z" fill="#FFFFFF" />
          </g>

          {/* Right Bridge Tower */}
          <g transform="translate(145, 0)">
            <polygon points="-26,28 -18,-72 -14,-72 -14,28" />
            <polygon points="14,28 14,-72 18,-72 26,28" />
            <rect x="-15" y="-60" width="30" height="6" />
            <rect x="-17" y="-34" width="34" height="6" />
            <rect x="-21" y="-6" width="42" height="7" />
            <path d="M-14,28 L-14,0 Q0,-14 14,0 L14,28 Z" fill="#FFFFFF" />
          </g>

          {/* Main Suspension Cable Swags */}
          <path d="M-225,20 Q-185,0 -163,-70" fill="none" stroke="#0A2540" strokeWidth="4.5" />
          <path d="M-127,-70 Q0,2 127,-70" fill="none" stroke="#0A2540" strokeWidth="4.5" />
          <path d="M163,-70 Q185,0 225,20" fill="none" stroke="#0A2540" strokeWidth="4.5" />

          {/* Vertical Cable Hangers */}
          <line x1="-205" y1="18" x2="-205" y2="10" strokeWidth="2.5" />
          <line x1="-185" y1="18" x2="-185" y2="-5" strokeWidth="2.5" />
          <line x1="-100" y1="18" x2="-100" y2="-42" strokeWidth="2.5" />
          <line x1="-75" y1="18" x2="-75" y2="-26" strokeWidth="2.5" />
          <line x1="-50" y1="18" x2="-50" y2="-14" strokeWidth="2.5" />
          <line x1="-25" y1="18" x2="-25" y2="-5" strokeWidth="2.5" />
          <line x1="25" y1="18" x2="25" y2="-5" strokeWidth="2.5" />
          <line x1="50" y1="18" x2="50" y2="-14" strokeWidth="2.5" />
          <line x1="75" y1="18" x2="75" y2="-26" strokeWidth="2.5" />
          <line x1="100" y1="18" x2="100" y2="-42" strokeWidth="2.5" />
          <line x1="185" y1="18" x2="185" y2="-5" strokeWidth="2.5" />
          <line x1="205" y1="18" x2="205" y2="10" strokeWidth="2.5" />

          {/* Bridge Deck Beam */}
          <rect x="-230" y="16" width="460" height="9" rx="2" fill="#0A2540" stroke="none" />
          <rect x="-195" y="25" width="10" height="24" fill="#0A2540" stroke="none" />
          <rect x="185" y="25" width="10" height="24" fill="#0A2540" stroke="none" />
        </g>

        {/* 3. OPEN BOOK OF KNOWLEDGE (Bottom Base) */}
        <g transform="translate(0, 48)">
          <path d="M-190,22 Q-95,-22 0,20 Q95,-22 190,22 L175,34 Q90,-8 0,31 Q-90,-8 -175,34 Z" fill="#0A2540" />
          <path d="M-185,12 Q-95,-25 0,14 Q95,-25 185,12 L173,23 Q90,-12 0,22 Q-90,-12 -173,23 Z" fill="#0284c7" />
          <path d="M-175,2 Q-90,-30 0,6 Q90,-30 175,2 L165,14 Q90,-16 0,16 Q-90,-16 -165,14 Z" fill="#0369a1" />
          <path d="M-150,-6 Q-80,-34 0,0 Q80,-34 150,-6 L140,4 Q75,-22 0,6 Q-75,-22 -140,4 Z" fill="#38bdf8" />
          <path d="M-155,-10 Q-80,-38 -4,-6 L-4,-2 Q-80,-32 -150,-4 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M155,-10 Q80,-38 4,-6 L4,-2 Q80,-32 150,-4 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M0,-6 L0,30" stroke="#0A2540" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 4. DYNAMIC PATHWAYS OF SUCCESS (Rising Orange Road Ribbons) */}
        <g fill="#F25C05" filter="url(#yuvaOrangeGlow)">
          <path d="M-8,46 C-38,28 -72,-15 -12,-98 C-10,-100 -5,-100 -4,-96 C-34,-24 -24,24 -2,46 Z" />
          <path d="M8,46 C38,28 72,-15 12,-98 C10,-100 5,-100 4,-96 C34,-24 24,24 2,46 Z" />
        </g>

        {/* 5. GRADUATION CAP (Navy Blue with Orange Tassel) */}
        <g transform="translate(0, -114)">
          <polygon points="0,-36 86,-5 0,26 -86,-5" fill="#0A2540" stroke="#071a2e" strokeWidth="2" />
          <path d="M-42,10 C-42,26 0,36 42,10 L42,20 C42,36 0,47 -42,20 Z" fill="#071a2e" />
          <ellipse cx="0" cy="-6" rx="4" ry="2.5" fill="#071a2e" />
          
          <path d="M0,-6 Q30,-4 50,11 Q51,22 51,38" fill="none" stroke="#F25C05" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="51" cy="20" r="4.5" fill="#F25C05" />
          <path d="M46,24 L56,24 L58,50 L44,50 Z" fill="#F25C05" />
          <line x1="48" y1="50" x2="48" y2="54" stroke="#F25C05" strokeWidth="2" />
          <line x1="51" y1="50" x2="51" y2="55" stroke="#F25C05" strokeWidth="2" />
          <line x1="54" y1="50" x2="54" y2="54" stroke="#F25C05" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );

  // Icon only
  if (variant === 'icon') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${iconSizeMap[size]} ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''} ${className}`}
        title="YuvaSetu — Samajh Se Safalta Tak"
      >
        <LogoEmblem />
      </div>
    );
  }

  // Full Badge (Official complete emblem + brand typography + tagline)
  if (variant === 'full') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-b from-[#0c1222] to-[#060811] border border-slate-800/80 shadow-2xl ${onClick ? 'cursor-pointer hover:border-orange-500/40 transition-all' : ''} ${className}`}
      >
        <div className={iconSizeMap[size === 'xs' || size === 'sm' ? 'lg' : size]}>
          <LogoEmblem />
        </div>
        <div className="mt-4 flex items-baseline gap-1.5 tracking-tight font-black font-['Outfit']">
          <span className={`${titleSizeMap[size]} ${theme === 'light' ? 'text-[#0A2540]' : 'text-white'} drop-shadow-sm`}>
            Yuva
          </span>
          <span className={`${titleSizeMap[size]} text-[#F25C05] font-black drop-shadow-sm`}>
            Setu
          </span>
        </div>
        {showTagline && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="w-5 h-[2px] bg-[#F25C05] rounded-full inline-block" />
            <span className={`${taglineSizeMap[size]} ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} font-bold uppercase tracking-[0.22em]`}>
              Samajh Se Safalta Tak
            </span>
            <span className="w-5 h-[2px] bg-[#F25C05] rounded-full inline-block" />
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (Ideal for Navbar & Header)
  if (variant === 'horizontal') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      >
        <div className={`${iconSizeMap[size]} shrink-0 transition-transform group-hover:scale-105 duration-200`}>
          <LogoEmblem />
        </div>
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1 font-['Outfit'] font-black">
            <span className={`${titleSizeMap[size]} ${theme === 'light' ? 'text-[#0A2540]' : 'text-white'} font-black tracking-tight group-hover:text-orange-200 transition-colors`}>
              Yuva
            </span>
            <span className={`${titleSizeMap[size]} font-black tracking-tight text-[#F25C05]`}>
              Setu
            </span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-[1.5px] bg-[#F25C05] rounded-full" />
              <span className={`${taglineSizeMap[size]} font-bold tracking-[0.18em] ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'} uppercase whitespace-nowrap`}>
                Samajh Se Safalta Tak
              </span>
              <span className="w-2.5 h-[1.5px] bg-[#F25C05] rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Footer variant
  if (variant === 'footer') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`flex flex-col items-start gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className={`${iconSizeMap[size]} shrink-0`}>
            <LogoEmblem />
          </div>
          <div className="flex items-baseline gap-1 font-['Outfit'] font-black">
            <span className={`${titleSizeMap[size]} text-white font-black tracking-tight`}>
              Yuva
            </span>
            <span className={`${titleSizeMap[size]} font-black text-[#F25C05]`}>
              Setu
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-[2px] bg-[#F25C05] rounded-full" />
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] text-slate-200">
            Samajh Se Safalta Tak
          </span>
          <span className="w-4 h-[2px] bg-[#F25C05] rounded-full" />
        </div>
      </div>
    );
  }

  // Default Badge Pill
  return (
    <div
      id={id}
      onClick={onClick}
      className={`inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 ${className}`}
    >
      <div className={iconSizeMap[size]}>
        <LogoEmblem />
      </div>
      <div className="flex items-baseline gap-1 font-['Outfit'] font-bold">
        <span className="text-white text-sm font-extrabold">Yuva</span>
        <span className="text-sm font-extrabold text-[#F25C05]">
          Setu
        </span>
      </div>
    </div>
  );
};
