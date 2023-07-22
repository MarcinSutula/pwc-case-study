function StationDetailInfo({ label, detailInfo, color }: any) {
  return (
    <div
      className="flex align-middle justify-between my-1 mx-12 p-3 border-solid border-b-2"
      style={{ borderColor: color }}
    >
      <h2 className="text-center text-white text-lg font-bold">{label}</h2>
      <p className="text-center text-white text-lg">{detailInfo}</p>
    </div>
  );
}

export default StationDetailInfo;
