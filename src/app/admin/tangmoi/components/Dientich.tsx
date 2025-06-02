import { useSaveContext } from '@/components/SaveContext';
import { Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { dienTichSchema, YupValidator } from '../schema/schema';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DientichProps {

}


const Dientich: React.FC<DientichProps> = () => {
  const [form] = Form.useForm();
  const { registerForm } = useSaveContext();

  // const tongDienTichXayDung = Form.useWatch('tongDienTichXayDung', form)
  const yupSync = YupValidator(dienTichSchema, form.getFieldsValue);

  const truSoLamViec = Form.useWatch('truSoLamViec', form)
  const coSoHDSN = Form.useWatch('coSoHDSN', form)
  const choThue = Form.useWatch('choThue', form)
  const suDungKhac = Form.useWatch('suDungKhac', form)
  const kinhDoanh = Form.useWatch('kinhDoanh', form)
  const lienDoanhLienKet = Form.useWatch('lienDoanhLienKet', form)
  const suDungHonHop = Form.useWatch('suDungHonHop', form)




  useEffect(() => {
    registerForm("dienTich", form, validateOnly, handleSubmit);
  }, []);

  useEffect(() => {
    form.setFields([
      {
        name: 'tongHienTrangSuDung',
        errors: [],
      },
    ]);

  }, [truSoLamViec, coSoHDSN, choThue, suDungKhac, kinhDoanh, lienDoanhLienKet, suDungHonHop]);



  // useEffect(() => {
  //   const tongHienTrangSuDung = truSoLamViec+coSoHDSN+choThue+suDungKhac+kinhDoanh+lienDoanhLienKet+suDungHonHop
  //   form.setFieldsValue({tongHienTrangSuDung: tongHienTrangSuDung})

  // }, [truSoLamViec,coSoHDSN,choThue,suDungKhac,kinhDoanh,lienDoanhLienKet,suDungHonHop])


  const validateOnly = async () => {
    try {
      const values = await form.validateFields();

      const tongHienTrangSuDung =
        (Number(values.truSoLamViec) || 0) +
        (Number(values.coSoHDSN) || 0) +
        (Number(values.choThue) || 0) +
        (Number(values.suDungKhac) || 0) +
        (Number(values.kinhDoanh) || 0) +
        (Number(values.lienDoanhLienKet) || 0) +
        (Number(values.suDungHonHop) || 0);

      if (tongHienTrangSuDung !== Number(values.tongDienTichXayDung)) {
        form.setFields([
          {
            name: 'tongHienTrangSuDung',
            errors: ['Tổng hiện trạng sử dụng phải bằng tổng diện tích xây dựng.'],
          },
        ]);
        return false
      }

      return true
    } catch (err) {
      console.log("Validation failed:", err);
      return false
    }
  };


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Submitted from DienTich:", values);
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
          <h1>
            Diện Tích
          </h1>

          {/* nguồn ngân sách */}
          <div className="flex w-full gap-4">
            {/* Form Item 1 */}
            <Form.Item
              label={
                <span>
                  Diện tích xây dựng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="dienTichXayDung"
              rules={[yupSync]}
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
              (M2)
            </h1>

            {/* Form Item 2 */}
            <Form.Item
              label={
                <span>
                  Số tầng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="soTang"
              rules={[yupSync]}
              className='w-1/2'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            //labelAlign="left"
            >

              <Input
                type="Number"
                placeholder="nhập giá trị"
              />
            </Form.Item>
          </div>

          {/* tổng dt xây dựng */}
          <div className='flex w-20/41 gap-4'>
            <Form.Item
              label={
                <span>
                  Tổng diện tích xây dựng
                  <span className="text-red-500 ml-0.5 text-xs">*</span>
                </span>
              }
              name="tongDienTichXayDung"
              rules={[yupSync]}
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
              (M2)
            </h1>

          </div>




        </div>
        <div
          className="border border-gray-400 p-2 rounded-md"
        >

          <Form.Item
            label={
              <h1>
                hiện trạng sử dụng
                <span className="text-red-500 ml-0.5 text-xs">*</span>
              </h1>
            }
            name="tongHienTrangSuDung"
            className="flex-1 m-auto"
            // labelCol={{ span: 20 }}
            // wrapperCol={{ span: 24 }}
            labelAlign="left"
            colon={false}
          >
          </Form.Item>



          <div className='grid grid-cols-7 gap-2'>
            {/*Trụ sở làm việc  */}
            <Form.Item
              label={
                <span>
                  Trụ sở làm việc

                </span>
              }
              name="truSoLamViec"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />

            </Form.Item>
            {/*Cơ sở HDSN  */}
            <Form.Item
              label={
                <span>
                  Cơ sở HDSN

                </span>
              }
              name="coSoHDSN"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >

              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>
            {/*Cho thuê  */}
            <Form.Item
              label={
                <span>
                  Cho thuê

                </span>
              }
              name="choThue"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>
            {/*Sử dụng khác  */}
            <Form.Item
              label={
                <span>
                  Sử dụng khác

                </span>
              }
              name="suDungKhac"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >

              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>
            {/*Kinh doanh  */}
            <Form.Item
              label={
                <span>
                  Kinh doanh

                </span>
              }
              name="kinhDoanh"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>
            {/*Liên Doanh-Liên kết  */}
            <Form.Item
              label={
                <span>
                  Liên Doanh-Liên kết

                </span>
              }
              name="lienDoanhLienKet"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>
            {/*Sử dụng hỗn hợp  */}
            <Form.Item
              label={
                <span>
                  Sử dụng hỗn hợp

                </span>
              }
              name="suDungHonHop"
              className="flex-1"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              rules={[yupSync]}
            >
              <Input
                type="Number"
                placeholder="nhập giá trị"
                onBlur={validateOnly}
              />
            </Form.Item>

          </div>






        </div>

      </Form>



    </>
  )
}

export default Dientich