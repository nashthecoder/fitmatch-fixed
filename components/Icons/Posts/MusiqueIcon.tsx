import * as React from "react";
import Svg, { Path } from "react-native-svg";

function MusiqueIcon() {
  return (
    <Svg width={35} height={34} viewBox="0 0 35 34">
      <Path
        d="M12.375 27V5.333L32.875 2v21.667M12.375 27c0 2.761-2.294 5-5.125 5-2.83 0-5.125-2.239-5.125-5s2.295-5 5.125-5 5.125 2.239 5.125 5zm20.5-3.333c0 2.761-2.294 5-5.125 5-2.83 0-5.125-2.239-5.125-5 0-2.762 2.294-5 5.125-5 2.83 0 5.125 2.238 5.125 5z"
        stroke="#1E1E1E"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MusiqueIcon;
