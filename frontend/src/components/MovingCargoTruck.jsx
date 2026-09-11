import React from 'react';
import { motion } from 'framer-motion';

const MovingCargoTruck = ({ className = '', compact = false, showRoad = true }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden select-none ${className}`}>
      {/* Moving Truck Chassis & Cabin */}
      <motion.div
        animate={{
          y: [0, -2.5, 0, -1.5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: 'easeInOut',
        }}
        className="relative z-10 flex items-end"
      >
        {/* SVG Detailed Cargo Truck */}
        <svg
          viewBox="0 0 540 180"
          className={compact ? 'w-64 h-24' : 'w-80 md:w-96 h-32 md:h-36'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Headlight Beam Glow */}
          <polygon
            points="465,115 540,95 540,155 465,135"
            fill="url(#headlightBeam)"
            opacity="0.35"
          />

          {/* Exhaust Smoke Particle 1 */}
          <motion.g
            animate={{
              x: [0, -25, -50],
              y: [0, -15, -30],
              scale: [1, 2.2, 3.8],
              opacity: [0.7, 0.4, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
            style={{ originX: '40px', originY: '70px' }}
          >
            <circle cx={40} cy={70} r={4} fill="#94a3b8" />
          </motion.g>

          {/* Exhaust Smoke Particle 2 */}
          <motion.g
            animate={{
              x: [0, -20, -40],
              y: [0, -10, -22],
              scale: [0.8, 2.0, 3.2],
              opacity: [0.8, 0.5, 0],
            }}
            transition={{ repeat: Infinity, duration: 1.4, delay: 0.6, ease: 'easeOut' }}
            style={{ originX: '40px', originY: '70px' }}
          >
            <circle cx={40} cy={70} r={3} fill="#cbd5e1" />
          </motion.g>

          {/* Truck Body Shadow */}
          <ellipse cx={260} cy={162} rx={230} ry={8} fill="#020617" opacity={0.8} />

          {/* MAIN CARGO TRAILER CONTAINER */}
          <rect
            x="30"
            y="25"
            width="320"
            height="115"
            rx="12"
            fill="url(#trailerGradient)"
            stroke="#334155"
            strokeWidth="2.5"
          />

          {/* Trailer Modern Accent Stripe */}
          <path
            d="M 30 75 L 350 75 L 350 88 L 30 88 Z"
            fill="url(#accentStripeGradient)"
            opacity="0.9"
          />

          {/* Cargo Container Vertical Panel Ribs */}
          <line x1="85" y1="26" x2="85" y2="138" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          <line x1="140" y1="26" x2="140" y2="138" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          <line x1="195" y1="26" x2="195" y2="138" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          <line x1="250" y1="26" x2="250" y2="138" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          <line x1="305" y1="26" x2="305" y2="138" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />

          {/* PROJECT BRANDING BADGE ON CARGO TRAILER */}
          <g transform="translate(190, 52)">
            {/* Illuminated Glow Badge */}
            <rect
              x="-125"
              y="-18"
              width="250"
              height="34"
              rx="8"
              fill="#090d16"
              stroke="#0284c7"
              strokeWidth="1.5"
              opacity="0.95"
            />
            {/* CargoConnect Brand Logo Typography */}
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="900"
              letterSpacing="1.2"
            >
              CARGO<tspan fill="#38bdf8">CONNECT</tspan>
            </text>
            <text
              x="0"
              y="23"
              textAnchor="middle"
              fill="#94a3b8"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="7.5"
              fontWeight="700"
              letterSpacing="2.5"
            >
              EXPRESS B2B LOGISTICS
            </text>
          </g>

          {/* Trailer Rear Door Hardware */}
          <rect x="30" y="32" width="6" height="100" rx="2" fill="#475569" />
          <rect x="33" y="60" width="4" height="12" rx="1" fill="#cbd5e1" />
          <rect x="33" y="90" width="4" height="12" rx="1" fill="#cbd5e1" />

          {/* Safety Warning Reflector Strips */}
          <rect x="36" y="132" width="12" height="4" fill="#ef4444" rx="1" />
          <rect x="70" y="132" width="14" height="4" fill="#fbbf24" rx="1" />
          <rect x="120" y="132" width="14" height="4" fill="#fbbf24" rx="1" />
          <rect x="170" y="132" width="14" height="4" fill="#fbbf24" rx="1" />
          <rect x="220" y="132" width="14" height="4" fill="#fbbf24" rx="1" />
          <rect x="270" y="132" width="14" height="4" fill="#fbbf24" rx="1" />
          <rect x="320" y="132" width="14" height="4" fill="#fbbf24" rx="1" />

          {/* CABIN CONNECTOR HITCH */}
          <rect x="345" y="105" width="25" height="28" fill="#1e293b" />
          <rect x="350" y="115" width="15" height="12" rx="3" fill="#475569" />

          {/* DRIVER CABIN FRONT */}
          <path
            d="M 360 138 L 360 62 C 360 55 365 50 372 50 L 415 50 C 428 50 442 60 450 72 L 472 105 C 476 112 478 120 478 128 L 478 138 Z"
            fill="url(#cabinGradient)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Cabin Windshield Glass */}
          <path
            d="M 416 56 L 378 56 C 374 56 371 59 371 63 L 371 90 L 434 90 C 438 90 442 87 445 83 L 452 72 C 455 67 452 56 444 56 L 416 56 Z"
            fill="url(#windshieldGlass)"
            stroke="#0284c7"
            strokeWidth="1.2"
          />

          {/* Driver Silhouette */}
          <circle cx={395} cy={74} r={7} fill="#1e293b" opacity={0.8} />
          <path d="M 383 90 C 383 82 390 80 395 80 C 400 80 407 82 407 90 Z" fill="#1e293b" opacity={0.8} />

          {/* Cabin Chrome Grille & Aerodynamic Bumper */}
          <rect x="466" y="112" width="16" height="24" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <line x1="469" y1="117" x2="479" y2="117" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="469" y1="123" x2="479" y2="123" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="469" y1="129" x2="479" y2="129" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Glowing LED Headlight Unit */}
          <rect x="466" y="104" width="14" height="6" rx="2" fill="#38bdf8" />
          <circle cx={474} cy={107} r={2.5} fill="#ffffff" />

          {/* Aerodynamic Side Mirror */}
          <rect x="424" y="68" width="6" height="14" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <rect x="425" y="70" width="4" height="10" rx="1" fill="#38bdf8" opacity="0.8" />

          {/* Cabin Exhaust Pipe Stack */}
          <rect x="352" y="30" width="6" height="50" rx="2" fill="#64748b" />
          <rect x="350" y="24" width="10" height="8" rx="2" fill="#94a3b8" />

          {/* Underbody Chassis Guards */}
          <rect x="175" y="138" width="125" height="12" rx="3" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
          <rect x="180" y="141" width="40" height="6" rx="1" fill="#38bdf8" opacity="0.6" />

          {/* SPINNING TRUCK WHEELS (Dual Rear + Center + Front) */}
          {/* Wheel 1 (Rear Left) */}
          <g transform="translate(85, 144)">
            <circle cx={0} cy={0} r={21} fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx={0} cy={0} r={14} fill="#1e293b" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            >
              <circle cx={0} cy={0} r={7} fill="#0284c7" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Wheel 2 (Rear Right) */}
          <g transform="translate(138, 144)">
            <circle cx={0} cy={0} r={21} fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx={0} cy={0} r={14} fill="#1e293b" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            >
              <circle cx={0} cy={0} r={7} fill="#0284c7" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Wheel 3 (Cabin Rear) */}
          <g transform="translate(345, 144)">
            <circle cx={0} cy={0} r={21} fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx={0} cy={0} r={14} fill="#1e293b" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            >
              <circle cx={0} cy={0} r={7} fill="#0284c7" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Wheel 4 (Cabin Steer Front) */}
          <g transform="translate(438, 144)">
            <circle cx={0} cy={0} r={21} fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx={0} cy={0} r={14} fill="#1e293b" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            >
              <circle cx={0} cy={0} r={7} fill="#0284c7" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-12" x2="0" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* SVG GRADIENT DEFINITIONS */}
          <defs>
            <linearGradient id="trailerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <linearGradient id="cabinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>

            <linearGradient id="accentStripeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="windshieldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Animated Fast Highway Road Stripes */}
      {showRoad && (
        <div className="w-full max-w-md h-3.5 relative overflow-hidden mt-0 flex items-center justify-center">
          {/* Road Asphalt Bed */}
          <div className="absolute inset-x-0 h-1.5 bg-slate-800 rounded-full"></div>

          {/* Fast Moving Dashed White Road Lines */}
          <motion.div
            animate={{ x: [0, -120] }}
            transition={{
              repeat: Infinity,
              duration: 0.65,
              ease: 'linear',
            }}
            className="flex gap-6 whitespace-nowrap absolute"
          >
            {[...Array(16)].map((_, i) => (
              <span key={i} className="inline-block w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MovingCargoTruck;
