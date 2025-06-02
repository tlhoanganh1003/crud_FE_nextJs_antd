export interface donVi {
  don_vi_id: number;
  ma_don_vi: string;
  ten_don_vi: string;
  ma_don_vi_cha?: string;
  don_vi_cha_id?: number;
}

export const donViMockData: donVi[] = [
  { don_vi_id: 1, ma_don_vi: "038", ten_don_vi: "Bảo hiểm xã hội Việt Nam" },
  { don_vi_id: 2, ma_don_vi: "038001", ten_don_vi: "BHXH thành phố Hà Nội", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 3, ma_don_vi: "038001001", ten_don_vi: "Bảo hiểm xã hội Tp.Hà Nội", ma_don_vi_cha: "038001", don_vi_cha_id: 2 },
  { don_vi_id: 4, ma_don_vi: "038002", ten_don_vi: "BHXH thành phố Hồ Chí Minh", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 5, ma_don_vi: "038002001", ten_don_vi: "Bảo hiểm xã hội Tp.Hồ Chí Minh", ma_don_vi_cha: "038002", don_vi_cha_id: 4 },
  { don_vi_id: 6, ma_don_vi: "038003", ten_don_vi: "BHXH tỉnh An Giang", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 7, ma_don_vi: "038003001", ten_don_vi: "Bảo hiểm xã hội tỉnh An Giang", ma_don_vi_cha: "038003", don_vi_cha_id: 6 },
  { don_vi_id: 8, ma_don_vi: "038004", ten_don_vi: "BHXH tỉnh Bà Rịa - Vũng Tàu", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 9, ma_don_vi: "038004001", ten_don_vi: "Bảo hiểm xã hội tỉnh Bà Rịa - Vũng Tàu", ma_don_vi_cha: "038004", don_vi_cha_id: 8 },
  { don_vi_id: 10, ma_don_vi: "038005", ten_don_vi: "BHXH tỉnh Bạc Liêu", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 11, ma_don_vi: "038005001", ten_don_vi: "Bảo hiểm xã hội tỉnh Bạc Liêu", ma_don_vi_cha: "038005", don_vi_cha_id: 10 },
  { don_vi_id: 12, ma_don_vi: "038006", ten_don_vi: "BHXH tỉnh Bắc Giang", ma_don_vi_cha: "038", don_vi_cha_id: 1 },
  { don_vi_id: 13, ma_don_vi: "038006001", ten_don_vi: "Bảo hiểm xã hội huyện Tân Yên", ma_don_vi_cha: "038006", don_vi_cha_id: 12 },
  { don_vi_id: 14, ma_don_vi: "038006003", ten_don_vi: "Bảo hiểm xã hội huyện Lạng Giang", ma_don_vi_cha: "038006", don_vi_cha_id: 12 },
  { don_vi_id: 15, ma_don_vi: "038006004", ten_don_vi: "Bảo hiểm xã hội huyện Lục Nam", ma_don_vi_cha: "038006", don_vi_cha_id: 12 },
  { don_vi_id: 16, ma_don_vi: "038006005", ten_don_vi: "Bảo hiểm xã hội Tp.Bắc Giang", ma_don_vi_cha: "038006", don_vi_cha_id: 12 },
  { don_vi_id: 17, ma_don_vi: "038006007", ten_don_vi: "Bảo hiểm xã hội huyện Lục Nam", ma_don_vi_cha: "038006", don_vi_cha_id: 12 },
  { don_vi_id: 18, ma_don_vi: "038006008", ten_don_vi: "Bảo hiểm xã hội huyện Việt Yên", ma_don_vi_cha: "038006", don_vi_cha_id: 12 }
];

// [
//   { "don_vi_id": 1, "ma_don_vi": "038", "ten_don_vi": "Bảo hiểm xã hội Việt Nam" },
//   { "don_vi_id": 4, "ma_don_vi": "038002", "ten_don_vi": "BHXH thành phố Hồ Chí Minh", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },
//   { "don_vi_id": 2, "ma_don_vi": "038001", "ten_don_vi": "BHXH thành phố Hà Nội", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },
//   { "don_vi_id": 6, "ma_don_vi": "038003", "ten_don_vi": "BHXH tỉnh An Giang", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },
//   { "don_vi_id": 8, "ma_don_vi": "038004", "ten_don_vi": "BHXH tỉnh Bà Rịa - Vũng Tàu", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },
//   { "don_vi_id": 10, "ma_don_vi": "038005", "ten_don_vi": "BHXH tỉnh Bạc Liêu", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },
//   { "don_vi_id": 12, "ma_don_vi": "038006", "ten_don_vi": "BHXH tỉnh Bắc Giang", "ma_don_vi_cha": "038", "don_vi_cha_id": 1 },


//   { "don_vi_id": 3, "ma_don_vi": "038001001", "ten_don_vi": "Bảo hiểm xã hội Tp.Hà Nội", "ma_don_vi_cha": "038001", "don_vi_cha_id": 2 },
//   { "don_vi_id": 5, "ma_don_vi": "038002001", "ten_don_vi": "Bảo hiểm xã hội Tp.Hồ Chí Minh", "ma_don_vi_cha": "038002", "don_vi_cha_id": 4 },
//   { "don_vi_id": 7, "ma_don_vi": "038003001", "ten_don_vi": "Bảo hiểm xã hội tỉnh An Giang", "ma_don_vi_cha": "038003", "don_vi_cha_id": 6 },
//   { "don_vi_id": 9, "ma_don_vi": "038004001", "ten_don_vi": "Bảo hiểm xã hội tỉnh Bà Rịa - Vũng Tàu", "ma_don_vi_cha": "038004", "don_vi_cha_id": 8 },
//   { "don_vi_id": 11, "ma_don_vi": "038005001", "ten_don_vi": "Bảo hiểm xã hội tỉnh Bạc Liêu", "ma_don_vi_cha": "038005", "don_vi_cha_id": 10 },
//   { "don_vi_id": 13, "ma_don_vi": "038006001", "ten_don_vi": "Bảo hiểm xã hội huyện Tân Yên", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 },
//   { "don_vi_id": 14, "ma_don_vi": "038006003", "ten_don_vi": "Bảo hiểm xã hội huyện Lạng Giang", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 },
//   { "don_vi_id": 15, "ma_don_vi": "038006004", "ten_don_vi": "Bảo hiểm xã hội huyện Lục Nam", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 },
//   { "don_vi_id": 16, "ma_don_vi": "038006005", "ten_don_vi": "Bảo hiểm xã hội Tp.Bắc Giang", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 },
//   { "don_vi_id": 17, "ma_don_vi": "038006007", "ten_don_vi": "Bảo hiểm xã hội huyện Lục Nam", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 },
//   { "don_vi_id": 18, "ma_don_vi": "038006008", "ten_don_vi": "Bảo hiểm xã hội huyện Việt Yên", "ma_don_vi_cha": "038006", "don_vi_cha_id": 12 }
// ]


