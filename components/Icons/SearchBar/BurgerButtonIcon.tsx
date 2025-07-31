import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

function BurgerButtonIcon() {
  return (
    <Svg width={40} height={38} viewBox="0 0 40 38">
      <G clipPath="url(#clip0_1517_213)">
        <Path
          d="M11 25v-2h18v2H11zm0-5v-2h18v2H11zm0-5v-2h18v2H11z"
          fill="#49454F"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1517_213">
          <Rect y={-1} width={40} height={40} rx={20} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default BurgerButtonIcon;
