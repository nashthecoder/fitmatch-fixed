import * as React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

function PencilIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_1144_282)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.187.166a.626.626 0 01.885 0l3.75 3.75a.625.625 0 010 .885l-12.5 12.5a.624.624 0 01-.21.137l-6.25 2.5a.625.625 0 01-.812-.813l2.5-6.25a.626.626 0 01.137-.21l12.5-12.5zm-1.174 2.942l2.867 2.866 1.616-1.616-2.866-2.866-1.617 1.616zm1.983 3.75L13.13 3.992l-8.125 8.125v.366h.625a.625.625 0 01.625.625v.625h.625a.625.625 0 01.625.625v.625h.366l8.125-8.125zM3.795 13.327l-.133.132-1.91 4.776 4.776-1.91.133-.132a.626.626 0 01-.406-.585v-.625H5.63a.625.625 0 01-.625-.625v-.625H4.38a.624.624 0 01-.585-.406z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1144_282">
          <Path fill="#fff" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default PencilIcon;
