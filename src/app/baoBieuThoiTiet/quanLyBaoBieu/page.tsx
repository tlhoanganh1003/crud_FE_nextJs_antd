'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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


const QuanLyBaoBieu = () => {


  const [data, setData] = useState<BaoBieu[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API để lấy danh sách các báo biểu con
      const response = await axios.get<BaoBieu[]>(API_BAOBIEU_URL);
      setData(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách báo biểu:', error);
      messageApi.error('Không thể tải danh sách báo biểu.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);





  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BAOBIEU_URL}/${id}`);
      messageApi.success('Xóa báo biểu thành công!');
      fetchData(); // Tải lại dữ liệu
    } catch (error) {
      console.error('Lỗi khi xóa báo biểu:', error);
      messageApi.error('Không thể xóa báo biểu này.');
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

  return (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Typography.Title level={2}>Danh sách Báo biểu</Typography.Title>

        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          bordered
        />
      </div>
    </>
  );
};

export default QuanLyBaoBieu;