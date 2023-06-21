import React from 'react';

export const LoadingIcon = () => (
  <svg
    width="48"
    height="47"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 1.5V10.3M24 36.7V45.5M8.446 7.946L14.672 14.172M33.328 32.828L39.554 39.054M2 23.5H10.8M37.2 23.5H46M8.446 39.054L14.672 32.828M33.328 14.172L39.554 7.946"
      stroke="#8B8682"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 24 24"
        to="360 24 24"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);
