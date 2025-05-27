export interface boPhanSuDung {

  maBoPhanSuDung: string //MS01
  tenBoPhanSuDung: string //Ban Quản lý dự án
  boPhanSuDungCha: string // Ban Quản lý (có thể lưu maBoPhanSuDung của 1 bộ phận khác cũng đc)
  diaChi: string  //
  dienThoai:string //
}


export const mockBoPhanSuDung: boPhanSuDung[] = [
  {
    maBoPhanSuDung: "BP01",
    tenBoPhanSuDung: "Ban Quản lý dự án",
    boPhanSuDungCha: "",
    diaChi: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM",
    dienThoai: "02812345678",
  },
  {
    maBoPhanSuDung: "BP02",
    tenBoPhanSuDung: "Phòng Kế hoạch",
    boPhanSuDungCha: "BP01",
    diaChi: "456 Đường Lý Thường Kiệt, Quận 10, TP.HCM",
    dienThoai: "02823456789",
  },
  {
    maBoPhanSuDung: "BP03",
    tenBoPhanSuDung: "Phòng Tài chính",
    boPhanSuDungCha: "BP01",
    diaChi: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    dienThoai: "02834567890",
  },
  {
    maBoPhanSuDung: "BP04",
    tenBoPhanSuDung: "Văn phòng Tổng hợp",
    boPhanSuDungCha: "BP02",
    diaChi: "321 Đường Cách Mạng Tháng Tám, Quận 3, TP.HCM",
    dienThoai: "02845678901",
  }
];
