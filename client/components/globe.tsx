// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";

// interface OrbitingCirclesProps {
//   icons: React.ReactNode[];
//   children: React.ReactNode;
//   radius?: number;
//   speed?: number;
// }

// export function OrbitingCircles({
//   icons,
//   children,
//   radius = 120,
//   speed = 10,
// }: OrbitingCirclesProps) {
//   const [rotation, setRotation] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRotation((prev) => (prev + 1) % 360);
//     }, 1000 / speed);

//     return () => clearInterval(interval);
//   }, [speed]);

//   return (
//     <div className="relative h-[300px] w-[300px]">
//       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
//         {children}
//       </div>
//       {icons.map((icon, index) => {
//         const angle =
//           (rotation + (index * 360) / icons.length) * (Math.PI / 180);
//         const x = Math.cos(angle) * radius;
//         const y = Math.sin(angle) * radius;

//         return (
//           <div
//             key={index}
//             className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
//             style={{
//               transform: `translate(${x}px, ${y}px)`,
//             }}
//           >
//             {icon}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface OrbitProps {
  icons: React.ReactNode[];
  radius: number;
  speed: number;
}

interface OrbitingCirclesProps {
  orbits: OrbitProps[];
  children: React.ReactNode;
}

function Orbit({ icons, radius, speed }: OrbitProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <>
      {icons.map((icon, index) => {
        const angle =
          (rotation + (index * 360) / icons.length) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            {icon}
          </div>
        );
      })}
    </>
  );
}

export function OrbitingCircles({ orbits, children }: OrbitingCirclesProps) {
  return (
    <div className="relative h-[400px] w-[400px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        {children}
      </div>
      {orbits.map((orbit, index) => (
        <Orbit key={index} {...orbit} />
      ))}
    </div>
  );
}
