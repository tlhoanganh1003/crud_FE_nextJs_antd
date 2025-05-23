export interface Country {
  countryId: number;
  name: string;
  level: string;
  parentId: number | null;
}

export const countries: Country[] = [
  { countryId: 1, name: "Việt Nam", level: "Quốc gia", parentId: null },
  { countryId: 2, name: "Hà Nội", level: "tinh", parentId: 1 },
  { countryId: 3, name: "Quận Ba Đình", level: "huyen", parentId: 2 },
  { countryId: 4, name: "Phường Giảng Võ", level: "xa", parentId: 3 },
  { countryId: 5, name: "Phường Thành Công", level: "xa", parentId: 3 },
  { countryId: 6, name: "TP Hồ Chí Minh", level: "tinh", parentId: 1 },
  { countryId: 7, name: "Quận 1", level: "huyen", parentId: 6 },
  { countryId: 8, name: "Phường Bến Nghé", level: "xa", parentId: 7 },
  { countryId: 9, name: "Quận 3", level: "huyen", parentId: 6 },
  { countryId: 10, name: "Phường Võ Thị Sáu", level: "xa", parentId: 9 }
];
