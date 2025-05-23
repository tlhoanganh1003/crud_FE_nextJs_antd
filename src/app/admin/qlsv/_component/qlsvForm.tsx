/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
// QlsvForm.tsx
import { Button, DatePicker, Form, Input, Modal, Radio, TreeSelect } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { qlsvSchema, YupValidator } from '../schema/schema';
import { qlsvServices } from '../services/qlsvService';


interface DataType {
  maSinhVien: string;
  tenSinhVien: string;
  gioiTinh: string;
  ngaySinh: string; // nên là string vì lấy từ API, nếu muốn định dạng thì format về sau
  tenKhoa: string;
}


interface QlsvFormProps {
  open: boolean;
  onCancel: () => void;
  mode: 'view' | 'edit' | 'create';
  initialData?: DataType
}


const QlsvForm: React.FC<QlsvFormProps> = ({ open, onCancel, mode, initialData }) => {
  const [form] = Form.useForm();
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const [khoaDropdown, setkhoaDropdown] = useState([]);
  const yupSync = YupValidator(qlsvSchema, form.getFieldsValue);

  useEffect(() => {
    const fetchKhoa = async () => {
      try {
        const listKhoa = await qlsvServices.getListKhoa();
        const formatted = listKhoa.data.data.map((i: any) => ({
          title: i.tenKhoa,
          value: i.khoaId,
        }));
        setkhoaDropdown(formatted);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message
        alert(`Lỗi khi thêm sinh viên: ${errorMessage}`)
        console.error("Lỗi khi fetch khoa:", error);
      }
    };

    fetchKhoa();
  }, []);

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        ngaySinh: initialData.ngaySinh ? dayjs(initialData.ngaySinh) : null,
      };
      form.setFieldsValue(formattedData);
    } else {
      form.resetFields(); // nếu muốn reset form khi không có initialData
    }


  }, [form, initialData]);



  //const [formData, setFormData] = useState<sinhvien>()

  const handleSubmit = async (formData: any) => {
    const sinhvien = {
      ...formData,
      ngaySinh: formData.ngaySinh?.format('DD/MM/YYYY'), // hoặc format khác tuỳ bạn
    };
    //console.log(sinhvien);
    if (mode === 'create') {
      try {
        const createSuccess = await qlsvServices.createSinhVien(sinhvien);
        // console.log(createSuccess);
        //message.success('Thêm sinh viên thành công!');
        alert('Thêm sinh viên thành công!')
        form.resetFields();
        onCancel();
        return createSuccess;
      } catch (e: any) {
        // Lấy ra lỗi cụ thể từ response (nếu có)
        const errorMessage = e.response?.data?.message || 'Đã xảy ra lỗi không xác định';
        console.error("Lỗi khi thêm sinh viên:", errorMessage);
        alert(`Lỗi khi thêm sinh viên: ${errorMessage}`)
        //message.error(`Thêm sinh viên thất bại! Lỗi: ${errorMessage}`);
      }
    } else if (mode === 'edit') {
      try {
        console.log(sinhvien)
        const updateSinhVien = await qlsvServices.updateSinhVien(sinhvien)
        alert('sửa sinh viên thành công!')
        //form.resetFields();
        onCancel()
        return updateSinhVien

      } catch (e: any) {
        const errorMessage = e.response?.data?.message
        console.error("Lỗi khi update sinh viên:", e)
        alert(`Lỗi khi thêm sinh viên: ${errorMessage}`)
        //message.error(`Thêm sinh viên thất bại! lỗi: ${e}`)
      }

    }
  }

  return (

    <Modal
      open={open}
      onCancel={onCancel}
      title={isView ? 'Xem sinh viên' : isEdit ? 'Sửa sinh viên' : 'Thêm sinh viên'}
      footer={null}
      width={700}
    >
      {/* Nội dung form ở đây */}
      <Form
        form={form}
        style={{
          maxWidth: 1000,
        }}
        onFinish={handleSubmit}
        labelCol={{ span: 4 }}

      >
        <Form.Item label="Mã sinh viên:" name="maSinhVien" rules={[yupSync]}>
          <Input placeholder='Mã sinh viên' disabled={mode == "view" || mode == "edit"} />
        </Form.Item>
        <Form.Item
          label="Tên sinh viên:"
          name="tenSinhVien"
          rules={[yupSync]}
        >
          <Input placeholder='Tên sinh viên' disabled={mode == "view"} />
        </Form.Item>
        <Form.Item
          label="giới tính"
          name="gioiTinh"
          rules={[yupSync]}
        >
          <Radio.Group>
            <Radio value="nam" disabled={mode == "view"}> Nam </Radio>
            <Radio value="nu" disabled={mode == "view"}> Nữ </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Ngày Sinh"
          name="ngaySinh"
          rules={[yupSync]}
        >
          <DatePicker disabled={mode == "view"} />
        </Form.Item>
        <Form.Item label="khoa" 
        name="khoaId"
        rules={[yupSync]}
        >
          <TreeSelect placeholder="Please select" variant="outlined" treeData={khoaDropdown} disabled={mode == "view"} />
        </Form.Item>
        {!isView && (
          <div className='flex justify-end gap-2 mt-4'>
            <Button type="primary" htmlType="submit" >
              {isCreate ? 'Thêm sinh viên' : isEdit ? 'Sửa sinh viên' : ''}
            </Button>
            <Button onClick={onCancel}>
              hủy
            </Button>
          </div>
        )}


      </Form>
    </Modal>

  );
};

export default QlsvForm;
