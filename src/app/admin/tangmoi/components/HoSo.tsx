import { useSaveContext } from '@/components/SaveContext';
import { Checkbox, DatePicker, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'



// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HoSoProps {

}

const HoSo: React.FC<HoSoProps> = () => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const { sharedData } = useSaveContext();
  const { registerForm } = useSaveContext();

  useEffect(() => {
    registerForm("HoSo", form, validateOnly, handleSubmit);
  }, []);

  const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setChecked(e.target.checked);
  };

  const validateOnly = async () => {
    try {
      const values = await form.validateFields();
      console.log("validate from HoSo:", values);
      return true
      // Gọi API ở đây nếu cần
    } catch (err) {
      console.log("Validation failed:", err);
      return false
    }

  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Submitted from HoSo:", values);
      // Gọi API ở đây nếu cần
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
          <Checkbox
            onChange={handleCheckboxChange}
          >
            có hồ sơ
          </Checkbox>
          {checked && (

            <>
              {/* Quyết định bàn giao */}
              <div className="flex w-full gap-10">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Quyết định bàn giao

                    </span>
                  }
                  name="quyetDinhBanGiao"
                  className="flex-1"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >

                  <Input
                    //placeholder='nhập năm xây dựng'
                    //disabled 
                    className="w-full"
                  />
                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      Ngày quyết định bàn giao
                    </span>
                  }
                  name="ngayQuyetDinhBanGiao"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                  rules={[
                    {
                      validator(_, value) {
                        const ngayDuaVaoSuDung = sharedData.ngayDuaVaoSuDung;
                        if (!ngayDuaVaoSuDung) {
                          return Promise.reject(
                            new Error("bạn phải chọn ngày đưa vào sử dụng")
                          );
                        }
                        if (!value) {
                          return Promise.resolve(); // Bỏ qua khi thiếu dữ liệu
                        }

                        if (
                          dayjs(value).isAfter(dayjs(ngayDuaVaoSuDung))
                        ) {
                          return Promise.reject(
                            new Error(" Ngày quyết định bàn giao phải nhỏ hơn hoặc bằng Ngày đưa vào sử dụng")
                          );
                        }

                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker className="w-full"
                    placeholder='yyyy/mm/dd'
                  />

                </Form.Item>

              </div>

              {/* Biên bản nghiệm thu */}
              <div className="flex w-full gap-10">
                {/* Form Item 1 */}
                <Form.Item
                  label={
                    <span>
                      Biên bản nghiệm thu

                    </span>
                  }
                  name="bienBanNghiemThu"
                  className="flex-1"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >

                  <Input
                    //placeholder='nhập năm xây dựng'
                    //disabled 
                    className="w-full"
                  />
                </Form.Item>

                {/* Form Item 2 */}
                <Form.Item
                  label={
                    <span>
                      Ngày nghiệm thu
                    </span>
                  }
                  name="ngayBienBanNghiemThu"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                  rules={[
                    {
                      validator(_, value) {
                        const ngayDuaVaoSuDung = sharedData.ngayDuaVaoSuDung;
                        if (!value || !ngayDuaVaoSuDung) {
                          return Promise.resolve(); // Bỏ qua khi thiếu dữ liệu
                        }

                        if (
                          dayjs(value).isAfter(dayjs(ngayDuaVaoSuDung))
                        ) {
                          return Promise.reject(
                            new Error("ngày nghiệm thu phải nhỏ hơn hoặc bằng Ngày đưa vào sử dụng")
                          );
                        }

                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker className="w-full"
                    placeholder='yyyy/mm/dd'
                  />

                </Form.Item>

              </div>

              <Form.Item 
              label={
                    <span>
                      Hồ sơ pháp lý khác

                    </span>
                  }
                  name="hoSoPhapLyKhac"
                  className="w-full"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 24 }}
                  labelAlign="left">
                <TextArea rows={4} />
              </Form.Item>

            </>

          )}

        </div>


      </Form>

    </>
  )
}

export default HoSo