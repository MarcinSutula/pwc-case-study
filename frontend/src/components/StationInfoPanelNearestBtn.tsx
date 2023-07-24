import { BTN_BLOCKED_COLOR } from "../config";

type StationInfoPanelNearestBtnType = {
  label: string;
  color: string;
  sameBrand: boolean;
  onClick: (sameBrand: boolean) => Promise<void>;
  disabled: boolean;
};

function StationInfoPanelNearestBtn({
  label,
  color,
  sameBrand,
  onClick,
  disabled,
}: StationInfoPanelNearestBtnType) {
  return (
    <button
      type="button"
      className="text-black text-xl font-semibold h-16 w-full block rounded-md"
      style={{ backgroundColor: disabled ? BTN_BLOCKED_COLOR : color }}
      onClick={() => onClick(sameBrand)}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default StationInfoPanelNearestBtn;
