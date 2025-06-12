'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { Table, Button, Space, Modal, Form, Input, Popconfirm, message, Typography, Breadcrumb } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';


// Đinterface cho kết quả từ API
interface BaoBieu {
  id: number;
  tenBaoBieu: string;
  baseBaoBieuId: number;
  tenBaseBaoBieu: string;
}


// interface CreateBaoBieuValues {
//     tenBaoBieu: string;
// }

const API_BAOBIEU_URL = 'http://localhost:5015/api/v1/bao-bieu';
const API_BASEBAOBIEU_URL = 'http://localhost:5015/api/v1/base-bao-bieu';


const BaoBieuByBaseIdPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const baseBaoBieuId = resolvedParams.id;

  const [data, setData] = useState<BaoBieu[]>([]);
  const [baseBaoBieuName, setBaseBaoBieuName] = useState<string>(''); // Lưu tên của mẫu cha để hiển thị
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();


  const fetchData = useCallback(async () => {
    if (!baseBaoBieuId) return;
    setLoading(true);
    try {
      // Gọi API để lấy danh sách các báo biểu con
      const response = await axios.get<BaoBieu[]>(`${API_BAOBIEU_URL}/by-base?baseId=${baseBaoBieuId}`);
      setData(response.data);
      // Lấy tên của mẫu cha để hiển thị tiêu đề
      if (response.data.length > 0) {
        setBaseBaoBieuName(response.data[0].tenBaseBaoBieu);
      } else {
        // Nếu không có báo biểu nào, phải gọi API khác để lấy tên mẫu
        const baseInfo = await axios.get<{ tenBaseBaoBieu: string }>(`${API_BASEBAOBIEU_URL}/${baseBaoBieuId}`);
        setBaseBaoBieuName(baseInfo.data.tenBaseBaoBieu);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách báo biểu:', error);
      message.error('Không thể tải danh sách báo biểu.');
    } finally {
      setLoading(false);
    }
  }, [baseBaoBieuId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        baseBaoBieuId: Number(baseBaoBieuId), // Gán ID của mẫu đang xem
        tenBaoBieu: values.tenBaoBieu,
      };
      
      await axios.post(API_BAOBIEU_URL, payload);
      message.success('Tạo báo biểu thành công!');
      setIsModalOpen(false);
      fetchData(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi khi tạo báo biểu:', error);
      message.error('Đã xảy ra lỗi trong quá trình tạo.');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BAOBIEU_URL}/${id}`);
      message.success('Xóa báo biểu thành công!');
      fetchData(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi khi xóa báo biểu:', error);
      message.error('Không thể xóa báo biểu này.');
    }
  };


  const handleEdit = (id: number) => {
    // Điều hướng đến trang sửa báo biểu (trang có các tab editor)
    router.push(`/baoBieuThoiTiet/quanLyBaoBieu/${id}/editBaoBieuContent`);
  };


  const columns: ColumnsType<BaoBieu> = [
    {
      title: 'STT',
      key: 'stt',
      width: '10%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên báo biểu',
      dataIndex: 'tenBaoBieu',
      key: 'tenBaoBieu',
    },
    {
      title: 'chức năng',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            Sửa & Nhập liệu
          </Button>
          <Popconfirm
            title="Xóa báo biểu"
            description="Bạn có chắc muốn xóa báo biểu này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const breadcrumbItems = [
  {
    title: 'Quản lý Mẫu Báo biểu',
    onClick: () => router.push('/baoBieuThoiTiet/quanLyMauBaoBieu'),
    style: { cursor: 'pointer' } // Bạn có thể thêm style nếu muốn
  },
  {
    title: baseBaoBieuName || 'Đang tải...', // Item thứ hai
  },
];

  return (
    <div style={{ padding: '24px' }}>
      {/* 2. Sử dụng prop 'items' để render Breadcrumb */}
    <Breadcrumb 
      items={breadcrumbItems} 
      style={{ marginBottom: '16px' }} 
    />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography.Title level={2}>Danh sách Báo biểu</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Tạo báo biểu mới từ mẫu này
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title={`Tạo báo biểu mới cho mẫu: "${baseBaoBieuName}"`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="tenBaoBieu"
            label="Tên báo biểu mới"
            rules={[{ required: true, message: 'Vui lòng nhập tên báo biểu!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BaoBieuByBaseIdPage;