import * as React from "react";
import Svg, { Path } from "react-native-svg";

function HeartIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Path
        d="M24.313 5.378a6.415 6.415 0 00-9.076 0L14 6.615l-1.237-1.237a6.418 6.418 0 10-9.077 9.077L14 24.768l10.313-10.313a6.416 6.416 0 000-9.077z"
        stroke="#FFFEFE"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HeartIcon;
