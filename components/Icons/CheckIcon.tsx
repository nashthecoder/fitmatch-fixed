import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

function CheckIcon() {
  return (
    <Svg width={48.24} height={48.24} viewBox="0 0 72 72" fill="none">
      <Circle cx={36} cy={36} r={36} fill="#fff" />
      <Path
        d="M56 25.5L28.5 53.917 16 41"
        stroke="#860404"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M55.167 25.5L28.125 50.25 15.833 39"
        stroke="#860404"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CheckIcon;
