import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CloseIcon() {
  return (
    <Svg width={33} height={36} viewBox="0 0 33 36" fill="none">
      <Path
        d="M24.75 9L8.25 27m0-18l16.5 18"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CloseIcon;
