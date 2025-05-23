/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup'


export const qlsvSchema = Yup.object({
maSinhVien: Yup.string()
.required('vui lòng nhập mã sinh viên')
.max(20, 'không được phép nhập quá 20 ký tự!')
.matches(
  /^[a-zA-Z0-9_]+$/,
  'mã sinh viên không được chứa khoảng trắng và chỉ được phép chứa chữ cái, số và dấu gạch dưới (_)!'
),
tenSinhVien: Yup.string()
.required('Vui lòng nhập tên sinh viên!')
.max(50, 'Không được phép nhập quá 50 ký tự!')
.matches(
  /^[\p{L}0-9_ ]+$/u,
  'Tên sinh viên chỉ được phép chứa chữ cái (kể cả có dấu), số, dấu gạch dưới (_) và khoảng trắng!'
),
khoaId: Yup.string().required('Vui lòng chọn khoa!'),
gioiTinh: Yup.string().nullable().oneOf(['nam','nu',''] as const),
ngaySinh: Yup.date()
  .nullable()
  .notRequired()
  .test(
    'is-before-today',
    'Ngày sinh phải trước hoặc bằng ngày hiện tại',
    function (value) {
      // Nếu không có giá trị (null hoặc undefined), coi như hợp lệ
      if (value === null || value === undefined) return true;
      return value <= new Date();
    }
  )
})

export const YupValidator = <T extends Yup.AnyObject>(
  schema: Yup.ObjectSchema<T>,
  getFieldsValue: () => T
) => ({
  async validator({ field }: any) {
    await schema.validateSyncAt(field, getFieldsValue());
  },
});