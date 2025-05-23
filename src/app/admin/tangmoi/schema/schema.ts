/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'


export const thongTinTaiSanSchema = Yup.object({
maDonVi: Yup.string()
.required('mã đơn vị không dược trống')
.max(20, 'không được phép nhập quá 20 ký tự!')
.matches(
  /^[a-zA-Z0-9_]+$/,
  'mã đơn vị không được chứa khoảng trắng và chỉ được phép chứa chữ cái, số và dấu gạch dưới (_)!'
),
tenDonVi: Yup.string()
.required('Vui lòng nhập tên Tài sản!')
.max(50, 'Không được phép nhập quá 50 ký tự!')
.matches(
  /^[\p{L}0-9_ ]+$/u,
  'Tên Tài sản chỉ được phép chứa chữ cái (kể cả có dấu), số, dấu gạch dưới (_) và khoảng trắng!'
),
maTaiSan: Yup.string()
.required('vui lòng chọn nhóm tài sản để tự sinh mã tài sản')
.max(20, 'không được phép nhập quá 20 ký tự!')
.matches(
  /^[a-zA-Z0-9_]+$/,
  'mã Tài sản không được chứa khoảng trắng và chỉ được phép chứa chữ cái, số và dấu gạch dưới (_)!'
),
tenTaiSan: Yup.string()
.required('Vui lòng nhập tên Tài sản!')
.max(50, 'Không được phép nhập quá 50 ký tự!')
.matches(
  /^[\p{L}0-9_ ]+$/u,
  'Tên Tài sản chỉ được phép chứa chữ cái (kể cả có dấu), số, dấu gạch dưới (_) và khoảng trắng!'
),
thanhPho: Yup.number().required('phải chọn thành phố'),
tinh: Yup.number().required('phải chọn thành phố'),

// khoaId: Yup.string().required('Vui lòng chọn khoa!'),
// gioiTinh: Yup.string().nullable().oneOf(['nam','nu',''] as const),
ngayDuaVaoSuDung: Yup.date()
  .nullable()
  .required('phải nhập ngày đưa vào sử dụng'),
 /* .test(
    'is-before-today',
    'Ngày sinh phải trước hoặc bằng ngày hiện tại',
    function (value) {
      // Nếu không có giá trị (null hoặc undefined), coi như hợp lệ
      if (value === null || value === undefined) return true;
      return value <= new Date();
    }
  )*/
  namXayDung: Yup.number().required('phải nhập số năm xây dựng'),
 nhomTaiSan: Yup.string().required('phải chọn nhóm tài sản'),
 pheDuyetQuyetToan: Yup.string().required('phải chọn phê duyệt'),
 lyDoTang: Yup.string().required('phải chọn lý do'),
 thuocKhuonVienDat: Yup.string().required('phải chọn khuôn viên đất')

})


export const giaTriSchema = Yup.object({
giaTri: Yup.number().required('phải có giá trị'),
tyLeKhauHao: Yup.string().required('phải có tỉ lệ khấu hao'),
apDungTheo: Yup.string().required('phải có điều khoản thông tư'),
tyLeSuDungSXKD: Yup.number().required('phải có tỷ lệ sử dụng')

})

export const dienTichSchema = Yup.object({
dienTichXayDung: Yup.number().required('phải có diện tích xây dựng'),
soTang: Yup.number().required('phải có số tầng'),
tongDTSanXayDung: Yup.number().required('phải có tổng diện tích sàn xây dựng'),

})


export const YupValidator = <T extends Yup.AnyObject>(
  schema: Yup.ObjectSchema<T>,
  getFieldsValue: () => T
) => ({
  async validator({ field }: any) {
    await schema.validateSyncAt(field, getFieldsValue());
  },
});