// app/quan-ly-mau/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Space, Modal, Form, Input, Popconfirm, message, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho BaseBaoBieu (phần response)
interface BaseBaoBieu {
  id: number;
  tenBaseBaoBieu: string;
  // baseContents không cần thiết cho màn hình danh sách, nhưng để đây cho đầy đủ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseContents: any[]; 
}

// Định nghĩa kiểu dữ liệu cho việc tạo mới
interface CreateBaseBaoBieuValues {
    tenBaseBaoBieu: string;
}

const API_URL = 'http://localhost:5015/api/v1/base-bao-bieu';

const QuanLyMauBaoBieuPage = () => {
  const [data, setData] = useState<BaseBaoBieu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  // Hàm fetch dữ liệu
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<BaseBaoBieu[]>(API_URL);
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách mẫu báo biểu:', error);
      message.error('Không thể tải danh sách mẫu báo biểu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Xử lý Modal tạo mới ---
  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateBaseBaoBieuValues = {
        tenBaseBaoBieu: values.tenBaseBaoBieu,
      };
      
      await axios.post('http://localhost:5015/api/v1/base-bao-bieu', payload);
      message.success('Tạo mẫu báo biểu thành công!');
      setIsModalOpen(false);
      fetchData(); // Tải lại dữ liệu sau khi tạo thành công
    } catch (error) {
      console.error('Lỗi khi tạo mẫu báo biểu:', error);
      message.error('Đã xảy ra lỗi trong quá trình tạo.');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // --- Xử lý xóa ---
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5015/api/v1/base-bao-bieu/${id}`);
      message.success('Xóa mẫu báo biểu thành công!');
      fetchData(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi khi xóa mẫu báo biểu:', error);
      message.error('Không thể xóa mẫu báo biểu. Có thể nó đang được sử dụng.');
    }
  };

  // --- Xử lý điều hướng ---
  const handleAddContent = (id: number) => {
    // Điều hướng đến trang thêm content cho mẫu, ví dụ: /quan-ly-mau/{id}/them-content
    router.push(`/baoBieuThoiTiet/quanLyMauBaoBieu/${id}/them-basecontent`);
  };

  const handleEdit = (id: number) => {
    // Điều hướng đến trang sửa mẫu, ví dụ: /quan-ly-mau/{id}/sua
    router.push(`/baoBieuThoiTiet/quanLyMauBaoBieu/${id}/edit-basecontent`);
  };

  // --- Định nghĩa các cột cho bảng ---
  const columns: ColumnsType<BaseBaoBieu> = [
    {
      title: 'STT',
      key: 'stt',
      width: '10%',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên mẫu báo biểu',
      dataIndex: 'tenBaseBaoBieu',
      key: 'tenBaseBaoBieu',
    },
    {
      title: 'Chức năng',
      key: 'action',
      width: '30%',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<FileAddOutlined />} onClick={() => handleAddContent(record.id)}>
            Thêm mới baseContent
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            Sửa baseContent
          </Button>
          <Popconfirm
            title="Xóa mẫu báo biểu"
            description="Bạn có chắc muốn xóa mẫu này không?"
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography.Title level={2}>Quản lý Mẫu Báo biểu</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Tạo mẫu mới
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
        title="Tạo mẫu báo biểu mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="tenBaseBaoBieu"
            label="Tên mẫu báo biểu"
            rules={[{ required: true, message: 'Vui lòng nhập tên mẫu báo biểu!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyMauBaoBieuPage;