import { useState, useEffect, useRef } from "react";
import { MousePointerClick } from "lucide-react";

const MouseFollower = () => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [isOverProjectCard, setIsOverProjectCard] = useState(false);
  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };

      // Get the element under the cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        // Check if we're over a service card
        const isOverProjectsCard = element.closest(".explore-project") !== null;
        setIsOverProjectCard(isOverProjectsCard);

        // Get the background color of the closest parent with a background
        let currentElement: Element | null = element;
        let bgColor = "";
        while (currentElement && !bgColor) {
          const style = window.getComputedStyle(currentElement);
          if (
            style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            style.backgroundColor !== "transparent"
          ) {
            bgColor = style.backgroundColor;
            break;
          }
          currentElement = currentElement.parentElement;
        }

        if (bgColor) {
          const rgb = bgColor.match(/\d+/g);
          if (rgb) {
            const brightness =
              (parseInt(rgb[0]) * 299 +
                parseInt(rgb[1]) * 587 +
                parseInt(rgb[2]) * 114) /
              1000;
            setIsDarkBackground(brightness < 128);
          }
        }
      }
    };

    const springStrength = 0.08;
    const friction = 0.85;

    const animate = () => {
      const dx = targetPosition.current.x - currentPosition.current.x;
      const dy = targetPosition.current.y - currentPosition.current.y;

      currentPosition.current.x += dx * springStrength;
      currentPosition.current.y += dy * springStrength;

      currentPosition.current.x =
        targetPosition.current.x * (1 - friction) +
        currentPosition.current.x * friction;
      currentPosition.current.y =
        targetPosition.current.y * (1 - friction) +
        currentPosition.current.y * friction;

      const dot = document.getElementById("following-dot");
      if (dot) {
        dot.style.left = `${currentPosition.current.x}px`;
        dot.style.top = `${currentPosition.current.y}px`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const getDotColor = () => {
    if (isDarkBackground) {
      return "#ffffff"; // primary color for dark backgrounds
    } else if (isOverProjectCard) {
      return "#000000"; // black for service cards (primary background)
    } else {
      return "#000000"; // black for light backgrounds
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        id="following-dot"
        className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center ${
          isOverProjectCard ? "scale-[7]" : ""
        }`}
        style={{
          backgroundColor: getDotColor(),
        }}
      >
        {isOverProjectCard && (
          <span className="text-[1.6px] text-background">
            <MousePointerClick size={5} strokeWidth={1} />
          </span>
        )}
      </div>
    </div>
  );
};

export default MouseFollower;
