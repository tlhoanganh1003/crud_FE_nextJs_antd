import { useSaveContext } from '@/components/SaveContext';
import { Checkbox, DatePicker, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react'



// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HoSoProps {

}

const HoSo: React.FC<HoSoProps> = () => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const { registerForm } = useSaveContext();

   useEffect(() => {
     registerForm("HoSo", form);
   }, []);


  const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setChecked(e.target.checked);
  };

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
                  labelCol={{ span: 8 }}
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
                      Ngày
                    </span>
                  }
                  name="ngayQuyetDinhBanGiao"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
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
                  labelCol={{ span: 8 }}
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
                      Ngày
                    </span>
                  }
                  name="ngayBienBanNghiemThu"
                  className="flex-1"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"
                >
                  <DatePicker className="w-full"
                    placeholder='yyyy/mm/dd'
                  />

                </Form.Item>

              </div>

            </>

          )}

        </div>


      </Form>

    </>
  )
}

export default HoSo