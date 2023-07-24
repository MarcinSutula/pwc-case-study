type StationDetailType = {
  label: string;
  formatDetail?: boolean;
  detail: string;
  color: string;
};

function StationDetail({
  label,
  formatDetail = false,
  detail,
  color,
}: StationDetailType) {
  const detailFormatted = detail
    .split(" ")
    .map(
      (partDetail: string) =>
        partDetail.charAt(0).toUpperCase() + partDetail.slice(1).toLowerCase()
    )
    .join(" ");

  return (
    <div
      className="flex align-middle justify-between my-1 mx-5 p-3 border-solid border-b-2 items-center"
      style={{ borderColor: color }}
    >
      <h2 className="text-center text-white text-lg font-bold">{label}</h2>
      <p className="text-center text-white text-lg">
        {formatDetail ? detailFormatted : detail}
      </p>
    </div>
  );
}

export default StationDetail;
