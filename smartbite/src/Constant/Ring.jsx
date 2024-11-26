import React from 'react';

const Ring = ({ data, size, strokeWidth, label, icon }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((ring, index) => {
        const offset = circumference * (1 - ring.value);
        return (
          <g key={index}>
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={ring.startColor || '#FF5733'} />
                <stop offset="100%" stopColor={ring.endColor || '#FFC300'} />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.3)" />
              </filter>
            </defs>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth={strokeWidth + 2}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#gradient-${index})`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease',
                filter: 'url(#shadow)',
              }}
            />
          </g>
        );
      })}
      {/* {data[0]?.icon && (  
        <image
          href={icon}
          x={(size - 40) / 2}
          y={(size - 40) / 2 - 60} 
          width="40"           
          height="40"       
        />
      )}
      {label && ( 
        <text
          x="50%"
          y={(size / 2) + 30} 
          textAnchor="middle"
          fill="#FF5733"
          fontSize="24" 
          fontWeight="bold"
          style={{ filter: 'url(#shadow)' }} 
        >
          {label}
        </text>
      )} */}
    </svg>
  );
};

export default Ring;
