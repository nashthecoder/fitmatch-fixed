import * as React from "react";
import Svg, { Path } from "react-native-svg";

function GaleryIcon() {
  return (
    <Svg width={22} height={20} viewBox="0 0 22 20" fill="none">
      <Path
        d="M2.833 19.75a2.418 2.418 0 01-1.662-.623C.724 18.694.5 18.18.5 17.583V2.417C.5 1.82.724 1.315 1.17.9A2.36 2.36 0 012.834.25h16.334A2.26 2.26 0 0120.8.9c.467.415.7.92.7 1.517v15.166c0 .596-.233 1.11-.7 1.544-.447.415-.992.623-1.633.623H2.833zm0-2.167h16.334V2.417H2.833v15.166zM4 15.417h14L13.625 10l-3.5 4.333-2.625-3.25L4 15.417zm-1.167 2.166V2.417v15.166z"
        fill="#FEF7FF"
      />
    </Svg>
  );
}

export default GaleryIcon;
