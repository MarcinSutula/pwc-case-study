import { ThreeCircles } from "react-loader-spinner";
import { BP_GREEN_RGB, ORLEN_RED_RGB, SHELL_YELLOW_RGB } from "../config";

function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <ThreeCircles
      height="100"
      width="100"
      color={BP_GREEN_RGB}
      wrapperStyle={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      wrapperClass=""
      visible={isLoading}
      ariaLabel="three-circles-rotating"
      outerCircleColor={SHELL_YELLOW_RGB}
      innerCircleColor=""
      middleCircleColor={ORLEN_RED_RGB}
    />
  );
}

export default LoadingSpinner;
