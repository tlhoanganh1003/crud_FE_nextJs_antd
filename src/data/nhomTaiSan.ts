export interface nhomTaiSan {
  maNhomTaiSan: number      // 202
  nhomTaiSan: string     //nhà cấp 1
  tyLeSuDungSXKD: number  //100
  apDungTheo: string  // thông tư TT23/2023/TT-BTC
  phuongPhapTinhKhauHao: string //khấu hao theo đường thẳng
  thoiGianSuDungConLai: number //80
  tyLeHaoMon: number//1.5
  tyLeKhauHao: number//1.5
  tyLeSuDungHDNS: number//1.5
}


export const mockNhomTaiSanList: nhomTaiSan[] = [
  {
    maNhomTaiSan: 202,
    nhomTaiSan: "Nhà cấp 1",
    tyLeSuDungSXKD: 100,
    apDungTheo: "TT23/2023/TT-BTC",
    phuongPhapTinhKhauHao: "Khấu hao theo đường thẳng",
    thoiGianSuDungConLai: 80,
    tyLeHaoMon: 1.5,
    tyLeKhauHao: 1.5,
    tyLeSuDungHDNS:1.1
  },
  {
    maNhomTaiSan: 203,
    nhomTaiSan: "Máy móc thiết bị",
    tyLeSuDungSXKD: 90,
    apDungTheo: "TT23/2023/TT-BTC",
    phuongPhapTinhKhauHao: "Khấu hao theo số dư giảm dần có điều chỉnh",
    thoiGianSuDungConLai: 60,
    tyLeHaoMon: 1.15,
    tyLeKhauHao: 1.5,
    tyLeSuDungHDNS:1.2
    
  },
  {
    maNhomTaiSan: 204,
    nhomTaiSan: "Xe ô tô con",
    tyLeSuDungSXKD: 70,
    apDungTheo: "TT23/2023/TT-BTC",
    phuongPhapTinhKhauHao: "Khấu hao theo đường thẳng",
    thoiGianSuDungConLai: 40,
    tyLeHaoMon: 1.75,
    tyLeKhauHao: 1.5,
    tyLeSuDungHDNS:1.3
  },
  {
    maNhomTaiSan: 205,
    nhomTaiSan: "Nhà kho",
    tyLeSuDungSXKD: 95,
    apDungTheo: "TT23/2023/TT-BTC",
    phuongPhapTinhKhauHao: "Khấu hao theo đường thẳng",
    thoiGianSuDungConLai: 100,
    tyLeHaoMon: 1.25,
    tyLeKhauHao: 1.5,
    tyLeSuDungHDNS:1.4
  },
  {
    maNhomTaiSan: 206,
    nhomTaiSan: "Thiết bị điện",
    tyLeSuDungSXKD: 85,
    apDungTheo: "TT23/2023/TT-BTC",
    phuongPhapTinhKhauHao: "Khấu hao theo số lượng sản phẩm",
    thoiGianSuDungConLai: 55,
    tyLeHaoMon: 1.75,
    tyLeKhauHao: 1.5,
    tyLeSuDungHDNS:1.5
  }
];
