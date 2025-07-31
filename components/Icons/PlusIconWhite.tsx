import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PlusIconWhite() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 10v28M10 24h28"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PlusIconWhite;
