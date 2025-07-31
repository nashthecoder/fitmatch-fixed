import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

function SearchButtonIcon() {
  return (
    <Svg width={48} height={38} viewBox="0 0 48 38">
      <G clipPath="url(#clip0_1517_220)">
        <Path
          d="M31.6 28l-6.3-6.3a6.096 6.096 0 01-3.8 1.3c-1.817 0-3.354-.63-4.613-1.887C15.63 19.854 15 18.317 15 16.5c0-1.817.63-3.354 1.887-4.613C18.146 10.63 19.683 10 21.5 10c1.817 0 3.354.63 4.613 1.887C27.37 13.146 28 14.683 28 16.5a6.096 6.096 0 01-1.3 3.8l6.3 6.3-1.4 1.4zm-10.1-7c1.25 0 2.313-.438 3.188-1.313S26 17.75 26 16.5c0-1.25-.438-2.313-1.313-3.188C23.813 12.438 22.75 12 21.5 12c-1.25 0-2.313.438-3.188 1.313C17.438 14.187 17 15.25 17 16.5c0 1.25.438 2.313 1.313 3.188S20.25 21 21.5 21z"
          fill="#49454F"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1517_220">
          <Rect x={4} y={-1} width={40} height={40} rx={20} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SearchButtonIcon;
