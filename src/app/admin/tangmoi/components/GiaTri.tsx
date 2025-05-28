/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSaveContext } from '@/components/SaveContext';
import { Form, Input, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { mockNhomTaiSanList } from '@/data/nhomTaiSan';
import dayjs from 'dayjs';
import { giaTriSchema, YupValidator } from '../schema/schema';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface GiaTriProps {

}

const Giatri: React.FC<GiaTriProps> = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);
  const [localData, setLocalData] = useState<any>(null);
  const { registerForm } = useSaveContext();
  const { sharedData } = useSaveContext();
    const yupSync = YupValidator(giaTriSchema, form.getFieldsValue);
  const tyLeHaoMon = Form.useWatch('tyLeHaoMon', form)
  const giaTri = Form.useWatch('giaTri', form)
  const tyLeKhauHao = Form.useWatch('tyLeKhauHao', form)

     useEffect(() => {
        registerForm("GiaTri", form, validateOnly, handleSubmit);
      }, []);

  //reset radio nếu ngày đưa vào sử dụng bị đổi thành dạng không hợp lệ 
  useEffect(() => {
    const date = sharedData.ngayDuaVaoSuDung;
    const invalidDate = !date || dayjs(date).year() < 2023;

    if (invalidDate && value !== 1) {
      setValue(1);
    }
  }, [sharedData.ngayDuaVaoSuDung]);

  // Đồng bộ dữ liệu khi chọn nhóm tài sản
  useEffect(() => {
    if (!sharedData.maNhomTaiSan) return;

    const data = mockNhomTaiSanList.find(
      item => item.maNhomTaiSan === sharedData.maNhomTaiSan
    );
    if (!data) return;


    setLocalData(data);
  }, [sharedData.maNhomTaiSan]);

  // Cập nhật Form khi value thay đổi (và khi localData đã có)
  useEffect(() => {
    if (!localData) return;

    const valuesToSet: any = {
      thoiGianSuDungConLai: localData.thoiGianSuDungConLai,
    };

    if (value === 1) {
      valuesToSet.tyLeHaoMon = localData.tyLeHaoMon;
    } else if (value === 2) {
      valuesToSet.tyLeKhauHao = localData.tyLeKhauHao;
      valuesToSet.apDungTheo = localData.apDungTheo;
      valuesToSet.phuongPhapTinhKhauHao = localData.phuongPhapTinhKhauHao;
    } else if (value === 3) {
      valuesToSet.tyLeHaoMon = localData.tyLeHaoMon;
      valuesToSet.tyLeKhauHao = localData.tyLeKhauHao;
      valuesToSet.apDungTheo = localData.apDungTheo;
      valuesToSet.phuongPhapTinhKhauHao = localData.phuongPhapTinhKhauHao;
      valuesToSet.tyLeSuDungHDNS = localData.tyLeSuDungHDNS
      valuesToSet.tyLeSuDungSXKD = localData.tyLeSuDungSXKD
    }


    // Delay để đảm bảo Form.Item đã xuất hiện
    setTimeout(() => {
      form.setFieldsValue(valuesToSet);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, localData]);



  const handleRadioChange = (e: any) => {
    const selectedValue = e.target.value;

    if (
      sharedData.ngayDuaVaoSuDung &&
      dayjs(sharedData.ngayDuaVaoSuDung).year() >= 2023
    ) {
      setValue(selectedValue); // ✅ Cho phép thay đổi
    } else {
      alert("Chỉ được thay đổi nếu năm đưa vào sử dụng >= 2023");
    }
  }

  const tinhGiaTri = (changedField: string, newValue: number) => {
    const values = {
      nguonNganSach: Number(form.getFieldValue("nguonNganSach") || 0),
      NguonSuNghiep: Number(form.getFieldValue("NguonSuNghiep") || 0),
      nguonVienTro: Number(form.getFieldValue("nguonVienTro") || 0),
      nguonKhac: Number(form.getFieldValue("nguonKhac") || 0),
    };

    // Cập nhật giá trị mới
    values[changedField as keyof typeof values] = newValue;
    //console.log(values)

    const giaTri =values.nguonNganSach + values.NguonSuNghiep +values.nguonVienTro +values.nguonKhac;

    // console.log(giaTri)

    form.setFieldsValue({ giaTri });
  };

  //tính giá trị luy kế
  useEffect(() => {
    let giaTriLuyKe = 0
    // console.log(tyLeHaoMon)
    // console.log(giaTri)
    // console.log(tyLeKhauHao)
    if (value == 1 && tyLeHaoMon != 0 && giaTri > 0) {
      giaTriLuyKe = Math.round(giaTri / tyLeHaoMon)
      form.setFieldsValue({ giaTriConLai: giaTriLuyKe })
    }
    if (value == 2 && tyLeKhauHao != 0 && giaTri > 0) {
      giaTriLuyKe = Math.round(giaTri / tyLeKhauHao)
      form.setFieldsValue({ giaTriConLai: giaTriLuyKe })
    }
    if (value == 3 && tyLeHaoMon != 0 && giaTri > 0) {
      giaTriLuyKe = Math.round(giaTri / tyLeHaoMon)
      form.setFieldsValue({ giaTriConLai: giaTriLuyKe })
    }



  }, [tyLeHaoMon, giaTri, tyLeKhauHao, value])

  const validateOnly = async () => {
    try {
      const values = await form.validateFields();
      console.log("validate from giaTri:", values);
      return true
    } catch (err) {
      console.log("Validation failed:", err);
      return false
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Submitted from giaTri:", values);
    } catch (err) {
      console.log("Validation failed:", err);
    }
  }


  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 4 }}

      >
        <div
          className="border border-gray-400 p-2 rounded-md"
        >
          <h1>
            Giá trị
          </h1>

          {/* giá trị*/}
          <div className='flex gap-4'>
            <Form.Item
              label={
                <span>
                  Giá trị
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="giaTri"
              className='w-1/2'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="number"
                placeholder="0"
                disabled
              />

            </Form.Item>
            <h1 className="text-base">
              (VNĐ)
            </h1>

          </div>

          {/* nguồn ngân sách */}
          <div className="flex w-full gap-4">
            {/* Form Item 1 */}
            <Form.Item
              label={
                <span>
                  Nguồn ngân sách

                </span>
              }
              name="nguonNganSach"
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              initialValue={0}
            >

              <div className="flex items-center gap-1">
                <Input
                  type="Number"
                  placeholder="nhập giá trị"
                  onBlur={(e) =>
                    tinhGiaTri("nguonNganSach", Number(e.target.value || 0))
                  }
                />
                <h1 className="text-base">
                  (VNĐ)
                </h1>
              </div>

            </Form.Item>

            {/* Form Item 2 */}
            <Form.Item
              label={
                <span>
                  Nguồn sự nghiệp

                </span>
              }
              name="NguonSuNghiep"
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValue={0}
            //labelAlign="left"
            >

              <div className="flex items-center gap-1">
                <Input
                  type="Number"
                  placeholder="nhập giá trị"
                  onBlur={(e) =>
                    tinhGiaTri("NguonSuNghiep", Number(e.target.value || 0))
                  }

                />
                <h1 className="text-base">
                  (VNĐ)
                </h1>
              </div>
            </Form.Item>
          </div>


          {/* nguồn viện trợ */}
          <div className="flex w-full gap-4">
            {/* Form Item 1 */}
            <Form.Item
              label={
                <span>
                  Nguồn viện trợ

                </span>
              }
              name="nguonVienTro"
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              initialValue={0}
            >

              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  placeholder="nhập giá trị"
                  onBlur={(e) =>
                    tinhGiaTri("nguonVienTro", Number(e.target.value || 0))
                  }
                />
                <h1 className="text-base">
                  (VNĐ)
                </h1>
              </div>

            </Form.Item>

            {/* Form Item 2 */}
            <Form.Item
              label={
                <span>
                  Nguồn khác

                </span>
              }
              name="nguonKhac"
              className="flex-1"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValue={0}
            //labelAlign="left"
            >

              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  placeholder="nhập giá trị"
                  onBlur={(e) =>
                    tinhGiaTri("nguonKhac", Number(e.target.value || 0))
                  }
                />
                <h1 className="text-base">
                  (VNĐ)
                </h1>
              </div>
            </Form.Item>
          </div>

          {/*Tỉ lệ hao mòn*/}
          {value === 1 &&

            <div className='flex w-20/41 gap-4'>
              <Form.Item
                label={
                  <span>
                    Ty lệ hao mòn
                    <span className="text-red-500 ml-0.5 text-xs">*</span>
                  </span>
                }
                name="tyLeHaoMon"
                className="flex-1"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
              >

                <Input
                  type="Number"
                  placeholder="nhập giá trị"
                  disabled
                />


              </Form.Item>

              <h1 className="text-base">
                (%)
              </h1>

            </div>
          }

          {/* radio hao mon */}
          <div
            className='flex'
          >
            <Form.Item
              label={
                <span>
                </span>
              }
              className="w-1/6"
              colon={false}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              labelAlign="left"
            >
            </Form.Item>

            <Radio.Group
              onChange={handleRadioChange}
              value={value}
              name="radiogroup"
            >
              <div
                className="flex gap-50"
              >

                <Radio value={1}>Chỉ tính khấu hao</Radio>
                <Radio value={2}>Chỉ tính hao mòn</Radio>
                <Radio value={3}>Tính cả khấu hao lẫn hao mòn</Radio>
              </div>
            </Radio.Group>
          </div>

          {value === 1 &&

            <div className="flex w-full gap-4">
              {/* Form Item 1 */}
              <Form.Item
                label={
                  <span>
                    Giá trị còn lại

                  </span>
                }
                name="giaTriConLai"
                className="flex-1"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
              >
                <Input
                  type="Number"
                  placeholder="nhập giá trị"
                />
              </Form.Item>
              <h1 className="text-base">
                (VNĐ)
              </h1>

              {/* Form Item 2 */}
              <Form.Item
                label={
                  <span>
                    thời gian sử dụng còn lại

                  </span>
                }
                name="thoiGianSuDungConLai"
                className="flex-1"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}

              //labelAlign="left"
              >

                <Input
                  type="Number"
                  placeholder="something"
                  disabled
                />
              </Form.Item>
              <h1 className="text-base">
                (năm)
              </h1>
            </div>

          }




          {value === 2 &&
            <>
              {/* áp dụng theo */}
              <div className="flex w-full gap-4">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Áp dụng theo
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  name="apDungTheo"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                  initialValue={"Thông tư xxx"}
                >

                  <Input
                    placeholder="tự động"
                    disabled
                  />
                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      Tỷ lệ khấu hao
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name={"tyLeKhauHao"}
                //labelAlign="left"
                >

                  <Input
                    type="Number"
                    placeholder="something"
                    disabled
                  />
                </Form.Item>
                <h1 className="text-base">
                  (%)
                </h1>
              </div>

              {/* phương pháp tính khấu hao */}
              <div className="flex w-full gap-4">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Phương pháp tính khấu hao
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                  name={"phuongPhapTinhKhauHao"}
                >
                  <Input
                    placeholder="tự động"
                    disabled
                  />
                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      Thời gian khấu hao còn lại
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  //labelAlign="left"
                  name={"thoiGianSuDungConLai"}
                >
                  <Input
                    type="Number"
                    placeholder="something"
                    disabled
                  />
                </Form.Item>
                <h1 className="text-base">
                  (năm)
                </h1>
              </div>
              {/* Giá trị khấu hao lũy kế */}
              <div className='flex w-1/2 gap-4'>
                <Form.Item
                  label={
                    <span>
                      Giá trị khấu hao lũy kế
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  name="giaTriConLai"
                  className="w-full"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >
                  <Input
                    type="Number"
                    placeholder="0"
                  />
                </Form.Item>
                <h1 className="text-base">
                  (VNĐ)
                </h1>

              </div>
            </>


          }
          {value === 3 &&
            <>
              {/* tỉ lệ sử dụng HĐNS */}
              <div className="flex w-full gap-4">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      tỷ lệ sử dụng HĐNS
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  name="tyLeSuDungHDNS"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                  rules={[yupSync]}
                >

                  <Input
                    type="Number"
                    placeholder="tự động"
                    disabled
                  />


                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      tỷ lệ sử dụng SXKĐ-DV
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  //labelAlign="left"
                  name={"tyLeSuDungSXKD"}
                >

                  <Input
                    type="Number"
                    placeholder="something"
                    disabled
                  />
                </Form.Item>
                <h1 className="text-base">
                  (%)
                </h1>
              </div>

              {/* áp dụng theo */}
              <div className="flex w-full gap-4">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Áp dụng theo
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  name="apDungTheo"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >

                  <Input
                    placeholder="tự động"
                    disabled
                  />


                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      Tỷ lệ Hao mòn
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  //labelAlign="left"
                  name="tyLeHaoMon"
                >

                  <Input
                    type="Number"
                    placeholder="something"
                    disabled
                  />
                </Form.Item>
                <h1 className="text-base">
                  (%)
                </h1>
              </div>

              {/* phương pháp tính khấu hao */}
              <div className="flex w-full gap-4">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Phương pháp tính khấu hao

                    </span>
                  }
                  name="phuongPhapTinhKhauHao"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >

                  <Input
                    placeholder="tự động"
                    disabled
                  />


                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      thời gian sử dụng còn lại
                    </span>
                  }
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  //labelAlign="left"
                  name="thoiGianSuDungConLai"
                >

                  <Input
                    type="Number"
                    placeholder="something"
                    disabled
                  />

                </Form.Item>
                <h1 className="text-base">
                  (năm)
                </h1>
              </div>

              {/* Giá trị khấu hao lũy kế */}
              <div
                className='flex w-1/2 gap-4'
              >

                <Form.Item
                  label={
                    <span>
                      Giá trị lũy kế đã tính
                      <span className="text-red-500 ml-0.5 text-xs">*</span>
                    </span>
                  }
                  name="giaTriConLai"
                  className="w-full"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >
                  <Input
                    type="Number"
                    placeholder="0"
                  />
                </Form.Item>
                <h1 className="text-base">
                  (VNĐ)
                </h1>
              </div>

            </>
          }


        </div>

      </Form>
    </>
  )
}

export default Giatri
