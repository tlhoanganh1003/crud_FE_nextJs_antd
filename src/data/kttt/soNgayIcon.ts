export interface soNgayIcon {

  icon: string //	○
  tenKhiTuong: string //Cloudless
  soLanXuatHien: number // là 1 số
}


export const mockSoNgayIcon: soNgayIcon[] = [
  { icon: "○", tenKhiTuong: "Cloudless", soLanXuatHien: 10 },
  { icon: "◐", tenKhiTuong: "Partly Cloudy", soLanXuatHien: 12 },
  { icon: "●", tenKhiTuong: "Overcast", soLanXuatHien: 9 },
  { icon: "☁", tenKhiTuong: "Low Clouds", soLanXuatHien: 11 },
  { icon: "☁̲", tenKhiTuong: "Middle Clouds", soLanXuatHien: 6 },
  { icon: "☁̅", tenKhiTuong: "High Clouds", soLanXuatHien: 5 },
  { icon: "•", tenKhiTuong: "Light Rain", soLanXuatHien: 7 },
  { icon: "․․", tenKhiTuong: "Moderate Rain", soLanXuatHien: 4 },
  { icon: "⁚", tenKhiTuong: "Heavy Rain", soLanXuatHien: 3 },
  { icon: "☂", tenKhiTuong: "Rain Showers", soLanXuatHien: 2 },
  { icon: "◔", tenKhiTuong: "Hail", soLanXuatHien: 1 },
  { icon: "✽", tenKhiTuong: "Light Snow", soLanXuatHien: 5 },
  { icon: "❄", tenKhiTuong: "Snow", soLanXuatHien: 4 },
  { icon: "✼✼", tenKhiTuong: "Heavy Snow", soLanXuatHien: 2 },
  { icon: "⚡", tenKhiTuong: "Thunderstorm", soLanXuatHien: 3 },
  { icon: "⛈", tenKhiTuong: "Thunderstorm with Rain", soLanXuatHien: 2 },
  { icon: "⛈◔", tenKhiTuong: "Thunderstorm with Hail", soLanXuatHien: 1 },
  { icon: "≡", tenKhiTuong: "Fog", soLanXuatHien: 6 },
  { icon: "≈", tenKhiTuong: "Haze", soLanXuatHien: 4 },
  { icon: "≣", tenKhiTuong: "Smoke", soLanXuatHien: 2 },
  { icon: "∴", tenKhiTuong: "Dust/Sand", soLanXuatHien: 3 },
  { icon: "→", tenKhiTuong: "Light Wind", soLanXuatHien: 8 },
  { icon: "➤", tenKhiTuong: "Moderate Wind", soLanXuatHien: 5 },
  { icon: "🌀", tenKhiTuong: "Cyclone", soLanXuatHien: 1 },
];