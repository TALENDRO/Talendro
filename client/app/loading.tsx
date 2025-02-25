"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null; // Hide the loader after 5 seconds

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <StyledWrapper>
          <div className="spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </StyledWrapper>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  .spinner {
    position: relative;
    width: 24.6px;
    height: 24.6px;
    animation-name: rotateSpin;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: normal;
    background-color: hsl(var(--primary));
  }

  @keyframes rotateSpin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .spinner div {
    width: 100%;
    height: 100%;
    background-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spinnerAni 1s infinite backwards;
  }

  .spinner div:nth-child(1) {
    animation-delay: 0.12s;
    opacity: 0.9;
  }

  .spinner div:nth-child(2) {
    animation-delay: 0.24s;
    opacity: 0.8;
  }

  .spinner div:nth-child(3) {
    animation-delay: 0.36s;
    opacity: 0.7;
  }

  .spinner div:nth-child(4) {
    animation-delay: 0.48s;
    opacity: 0.6;
  }

  .spinner div:nth-child(5) {
    animation-delay: 0.6s;
    opacity: 0.5;
  }

  @keyframes spinnerAni {
    0% {
      transform: rotate(0deg) translateY(-200%);
    }
    60%,
    100% {
      transform: rotate(360deg) translateY(-200%);
    }
  }
`;
