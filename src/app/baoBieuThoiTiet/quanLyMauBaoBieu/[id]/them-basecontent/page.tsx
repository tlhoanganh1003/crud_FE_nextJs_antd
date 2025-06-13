// app/[id]/them-basecontent/page.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Spin, message, Typography, Card } from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Giả định bạn đã có component này ở đúng đường dẫn
import CustomEditor from '@/components/CustomEditor';

// Kiểu dữ liệu cho BaseBaoBieu (chỉ cần lấy tên là đủ)
interface BaseBaoBieuInfo {
  id: number;
  tenBaseBaoBieu: string;
}

// Kiểu dữ liệu cho payload gửi đi
interface CreateBaseContentPayload {
  content: string;
  // soThuTu đã được BE tự động xử lý, nên không cần gửi
}

const API_BASE_URL = 'http://localhost:5015/api/v1/base-bao-bieu';

const ThemBaseContentPage = ({ params }: { params: { id: string } }) => {
  const baseBaoBieuId = params.id;
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [baseBaoBieuInfo, setBaseBaoBieuInfo] = useState<BaseBaoBieuInfo | null>(null);
  const [content, setContent] = useState<string>(''); // State để lưu nội dung từ editor
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Hàm fetch thông tin cơ bản của mẫu báo biểu
  const fetchBaseBaoBieuInfo = useCallback(async () => {
    if (!baseBaoBieuId) return;
    setLoading(true);
    try {
      const response = await axios.get<BaseBaoBieuInfo>(`${API_BASE_URL}/${baseBaoBieuId}`);
      setBaseBaoBieuInfo(response.data);
    } catch (error) {
      console.error('Lỗi khi tải thông tin mẫu báo biểu:', error);
      messageApi.error('Không thể tải thông tin của mẫu báo biểu.');
      setBaseBaoBieuInfo(null); // Đặt lại nếu có lỗi
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseBaoBieuId]);

  useEffect(() => {
    fetchBaseBaoBieuInfo();
  }, [fetchBaseBaoBieuInfo]);

  // Hàm xử lý khi nội dung của editor thay đổi
  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  // Hàm xử lý khi nhấn nút lưu
  const handleSave = async () => {
    if (!content.trim()) {
      messageApi.warning('Vui lòng nhập nội dung trước khi lưu.');
      return;
    }

    setSaving(true);
    const payload: CreateBaseContentPayload = {
      content: content,
    };

    try {
      await axios.post(`${API_BASE_URL}/${baseBaoBieuId}/contents`, payload);
      messageApi.success('Thêm nội dung mới thành công!');
      // Sau khi lưu, có thể reset editor hoặc quay lại trang trước
      setContent('thêm nội dung thành công nhập base content mới hoặc quay lại');
      // Hoặc có thể điều hướng người dùng quay lại
      // router.back(); 
    } catch (error) {
      console.error('Lỗi khi thêm nội dung mới:', error);
      messageApi.error('Đã xảy ra lỗi trong quá trình lưu.');
    } finally {
      setSaving(false);
    }
  };

  // Render component
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!baseBaoBieuInfo) {
    return <Typography.Title level={3} style={{ textAlign: 'center' }}>Không tìm thấy mẫu báo biểu với ID này.</Typography.Title>;
  }

  return (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <Typography.Text type="secondary">Thêm nội dung mới cho mẫu:</Typography.Text>
              <Typography.Title level={2} style={{ marginTop: 0 }}>{baseBaoBieuInfo.tenBaseBaoBieu}</Typography.Title>
            </div>
            <div>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => router.back()} // Nút quay lại trang trước
                style={{ marginRight: '8px' }}
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
              >
                Lưu nội dung
              </Button>
            </div>
          </div>

          <CustomEditor
            initialValue={content}
            onChange={handleEditorChange}
          />
        </Card>
      </div>
    </>

  );
};

export default ThemBaseContentPage;