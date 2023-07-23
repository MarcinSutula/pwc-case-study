type StationInfoPanelNearestBtnType = {
  label: string;
  color: string;
  sameBrand: boolean;
  onClick: (sameBrand: boolean) => Promise<void>;
};

function StationInfoPanelNearestBtn({
  label,
  color,
  sameBrand,
  onClick,
}: StationInfoPanelNearestBtnType) {
  return (
    <button
      type="button"
      className="text-black text-xl font-semibold h-16 w-full block rounded-md"
      style={{ backgroundColor: color }}
      onClick={() => onClick(sameBrand)}
    >
      {label}
    </button>
  );
}

export default StationInfoPanelNearestBtn;
