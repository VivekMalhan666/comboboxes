import * as React from "react";
import { SVGProps } from "react";
const TickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="m21.358 7-12 12-5.5-5.5 1.41-1.41 4.09 4.08 10.59-10.58L21.358 7Z"
    />
  </svg>
);
export default TickIcon;
