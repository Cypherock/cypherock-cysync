import * as React from 'react';
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  SvgProps,
} from 'react-native-svg';
export const LogotypeOdixIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={81}
    height={27}
    viewBox="0 0 81 27"
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="url(#b)"
        d="M.327 7.96C.327 3.797 2.735.123 7.715.123s7.348 3.633 7.348 7.837v10.655c0 4.245-2.123 7.715-7.388 7.715-5.266 0-7.348-3.715-7.348-7.715V7.96Zm3.061 11.104c0 2.49 1.225 4.572 4.287 4.572 3.061 0 4.327-2.041 4.327-4.572V7.43c0-2.817-1.43-4.572-4.287-4.572S3.388 4.53 3.388 7.43v11.634Z"
      />
      <Path
        fill="url(#c)"
        d="M28.004 26.126c-.858 0-1.552-.653-1.552-1.388V1.796c0-.735.653-1.388 1.552-1.388h4.857c5.348 0 7.226 3.674 7.226 7.838V18.41c0 4.001-1.837 7.716-7.185 7.716h-4.898Zm1.55-22.983v20.289h3.389c3.02 0 4.123-2.164 4.123-4.654V7.838c0-2.899-1.47-4.654-4.164-4.654h-3.347v-.04Z"
      />
      <Path
        fill="url(#d)"
        d="M54.62 24.983c0 .735-.654 1.388-1.552 1.388s-1.551-.653-1.551-1.388V1.55c0-.735.653-1.388 1.551-1.388.898 0 1.551.653 1.551 1.388v23.432Z"
      />
      <Path
        fill="url(#e)"
        d="M66.743.123c.572 0 1.103.285 1.388.816l4.042 8.9 3.918-8.9c.245-.49.735-.816 1.307-.816 1.143 0 1.674.938 1.306 1.796l-4.817 10.613 5.756 11.961c.082.163.123.367.123.53 0 .736-.654 1.348-1.47 1.348a1.516 1.516 0 0 1-1.347-.817l-4.776-10.327L67.6 25.554c-.245.531-.776.817-1.347.817-.776 0-1.47-.572-1.47-1.347a1 1 0 0 1 .163-.49L70.5 12.818 65.355 2.041c-.367-.857.204-1.918 1.347-1.918h.041Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={0.355}
        x2={15.091}
        y1={13.226}
        y2={13.226}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E1A68C" />
        <Stop offset={0.37} stopColor="#FFC8AF" />
        <Stop offset={1} stopColor="#B37D65" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={26.478}
        x2={40.113}
        y1={13.267}
        y2={13.267}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E1A68C" />
        <Stop offset={0.37} stopColor="#FFC8AF" />
        <Stop offset={1} stopColor="#B37D65" />
      </LinearGradient>
      <LinearGradient
        id="d"
        x1={51.523}
        x2={54.625}
        y1={13.267}
        y2={13.267}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E1A68C" />
        <Stop offset={0.37} stopColor="#FFC8AF" />
        <Stop offset={1} stopColor="#B37D65" />
      </LinearGradient>
      <LinearGradient
        id="e"
        x1={64.813}
        x2={79.794}
        y1={13.247}
        y2={13.247}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#E1A68C" />
        <Stop offset={0.37} stopColor="#FFC8AF" />
        <Stop offset={1} stopColor="#B37D65" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h80.01v26.534H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
