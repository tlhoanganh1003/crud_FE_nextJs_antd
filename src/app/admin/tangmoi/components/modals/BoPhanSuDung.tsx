import React from 'react'
import { Button, Form, Input, Modal, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { boPhanSuDung } from '@/data/boPhanSuDung';
import { themBoPhanSchema, YupValidator } from '../../schema/schema';
import TreeDonVi from '@/components/useTreeDonViData';



// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BoPhanSuDungFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newBoPhan: boPhanSuDung) => void

}

const BoPhanSuDung: React.FC<BoPhanSuDungFormProps> = ({ open, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const yupSync = YupValidator(themBoPhanSchema, form.getFieldsValue);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [treeData, setTreeData] = useState<any[]>([]);


  const handleClose = () => {
    form.resetFields()
    onClose()
  }




  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onAdd(values)
      onClose();
      form.resetFields()
    } catch (error) {
      console.log("Validation failed", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={'Thêm Bộ phận sử dụng'}
      footer={null}
      width={800}

    >
      <Form
        form={form}
        style={{
          maxWidth: 700,
        }}
      >
        {/* */}
        <Form.Item
          label={
            <span>
              Mã Bộ phận sử dụng
              <span className="text-red-500 ml-0.5 text-xs">*</span>
            </span>
          }
          name="maBoPhanSuDung"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
          rules={[yupSync]}
        >
          <Input />
        </Form.Item>


        {/* Tên Bộ phận sử dụng */}
        <Form.Item
          label={
            <span>
              Tên Bộ phận sử dụng
              <span className="text-red-500 ml-0.5 text-xs">*</span>
            </span>
          }
          name="tenBoPhanSuDung"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
          rules={[yupSync]}
        >
          <Input />
        </Form.Item>

        {/* Bộ phận sử dụng cha */}
        <Form.Item
          label={
            <span>
              Bộ phận sử dụng cha

            </span>
          }
          name="boPhanSuDungCha"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
        >
          <Select />
        </Form.Item>

        {/* địa chỉ */}
        <Form.Item
          label={
            <span>
              địa chỉ

            </span>
          }
          name="diaChi"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
        >
          <Input />
        </Form.Item>
        {/* Điện thoại */}
        <Form.Item
          label={
            <span>
              Điện thoại

            </span>
          }
          name="dienThoai"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        {/* Fax */}
        <Form.Item
          label={
            <span>
              Fax

            </span>
          }
          name="Fax"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
        >
          <Input />
        </Form.Item>

        {/* đơn vị */}


        <Form.Item
          label={
            <span>
              đơn Vị
            </span>
          }
          name="hihi"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          labelAlign="left"
        >
          <TreeDonVi />
        </Form.Item>


      </Form>
      <Button type="primary" onClick={handleSubmit}>
        <SaveOutlined />
        <span>Lưu</span>
      </Button>

    </Modal>
  )
}


export default BoPhanSuDung