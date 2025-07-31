import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CommentsIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 17 17">
      <Path
        d="M4.25 9.917h8.5V8.5h-8.5v1.417zm0-2.125h8.5V6.375h-8.5v1.417zm0-2.125h8.5V4.25h-8.5v1.417zm11.333 9.916L12.75 12.75H2.833c-.39 0-.723-.139-1-.416a1.364 1.364 0 01-.416-1v-8.5c0-.39.138-.724.416-1.001.277-.278.61-.416 1-.416h11.334c.39 0 .723.138 1 .416.277.277.416.61.416 1v12.75zm-12.75-4.25h10.519l.814.797V2.833H2.833v8.5z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CommentsIcon;
