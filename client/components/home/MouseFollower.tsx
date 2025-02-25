"use client";
import { useState, useEffect, useRef } from "react";
import { MousePointerClick } from "lucide-react";

const MouseFollower = () => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [isOverServiceCard, setIsOverServiceCard] = useState(false);
  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const lastKnownMousePosition = useRef({ x: 0, y: 0 });

  const checkElementUnderPosition = (x: number, y: number) => {
    const element = document.elementFromPoint(x, y);
    if (element) {
      // Check if we're over a service card
      const isOverCard = element.closest(".explore-project") !== null;
      setIsOverServiceCard(isOverCard);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      lastKnownMousePosition.current = { x: e.clientX, y: e.clientY };
      checkElementUnderPosition(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      const { x, y } = lastKnownMousePosition.current;
      checkElementUnderPosition(x, y);
    };

    // Throttled scroll handler
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Set up intersection observer for service cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(() => {
          const { x, y } = lastKnownMousePosition.current;
          checkElementUnderPosition(x, y);
        });
      },
      {
        threshold: [0, 0.5, 1],
      }
    );

    // Observe all service cards
    document.querySelectorAll(".explore-project").forEach((card) => {
      observer.observe(card);
    });

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
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    animationFrameId.current = requestAnimationFrame(animate);

    // Initial check for the element under the cursor
    const { x, y } = lastKnownMousePosition.current;
    checkElementUnderPosition(x, y);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", throttledScrollHandler);
      observer.disconnect();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const getDotColor = () => {
    if (isDarkBackground) {
      return "#ffffff"; // primary color for dark backgrounds
    } else if (isOverServiceCard) {
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
          isOverServiceCard ? "scale-[7]" : ""
        }`}
        style={{
          left: currentPosition.current.x,
          top: currentPosition.current.y,
          background: getDotColor(),
          willChange: "transform, width, height",
        }}
      >
        {isOverServiceCard && (
          <span className="text-[1.6px] text-background">
            <MousePointerClick size={5} strokeWidth={1} />
          </span>
        )}
      </div>
    </div>
  );
};

export default MouseFollower;
