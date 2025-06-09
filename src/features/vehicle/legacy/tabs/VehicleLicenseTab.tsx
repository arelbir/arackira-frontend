import React from "react";

interface Props {
  form: any;
}

const VehicleLicenseTab: React.FC<Props> = ({ form }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-white rounded-lg p-6 shadow">
      {/* Ruhsat bilgileri alanları buraya eklenecek */}
      <div className="col-span-2 text-center text-muted-foreground">Ruhsat bilgileri alanları burada olacak.</div>
    </div>
  );
};

export default VehicleLicenseTab;
