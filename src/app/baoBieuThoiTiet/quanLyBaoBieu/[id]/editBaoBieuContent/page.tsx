'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import { Tabs, Button, Spin, message, Typography } from 'antd';
import type { TabsProps } from 'antd';
import axios from 'axios';
import CustomEditor from '@/components/CustomEditor';
import { exportToHtmlDoc } from '@/app/ultis/exportHelper';

// Định nghĩa các kiểu dữ liệu để làm việc với TypeScript
interface BaoBieuContent {
  id: number;
  content: string;
  soThuTu: number;
}

interface BaoBieu {
  id: number;
  tenBaoBieu: string;
  baseBaoBieuId: number;
  tenBaseBaoBieu: string;
  baoBieuContents: BaoBieuContent[];
}

const BaoBieuDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const baoBieuId = resolvedParams.id;

  const [baoBieu, setBaoBieu] = useState<BaoBieu | null>(null);
  const [originalBaoBieu, setOriginalBaoBieu] = useState<BaoBieu | null>(null); // Lưu trạng thái ban đầu để so sánh
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Hàm fetch dữ liệu
  const fetchData = useCallback(async () => {
    if (!baoBieuId) return;
    setLoading(true);
    try {
      const response = await axios.get<BaoBieu>(`http://localhost:5015/api/v1/bao-bieu/${baoBieuId}`);

      // Sắp xếp contents theo soThuTu để hiển thị đúng thứ tự
      const sortedData = {
        ...response.data,
        baoBieuContents: response.data.baoBieuContents.sort((a, b) => a.soThuTu - b.soThuTu)
      };

      setBaoBieu(sortedData);
      setOriginalBaoBieu(JSON.parse(JSON.stringify(sortedData))); // Tạo một bản sao sâu (deep copy)
      message.success('Tải dữ liệu báo biểu thành công!');
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu báo biểu:', error);
      message.error('Không thể tải dữ liệu báo biểu.');
    } finally {
      setLoading(false);
    }
  }, [baoBieuId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm xử lý khi nội dung của một editor thay đổi
  const handleEditorChange = (contentId: number, newContent: string) => {
    setBaoBieu(prevBaoBieu => {
      if (!prevBaoBieu) return null;

      const updatedContents = prevBaoBieu.baoBieuContents.map(item =>
        item.id === contentId ? { ...item, content: newContent } : item
      );

      return { ...prevBaoBieu, baoBieuContents: updatedContents };
    });
  };

  // Hàm xử lý khi nhấn nút lưu
  const handleSaveAll = async () => {
    if (!baoBieu || !originalBaoBieu) {
      message.warning('Không có dữ liệu để lưu.');
      return;
    }

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePromises: Promise<any>[] = [];

    baoBieu.baoBieuContents.forEach(currentItem => {
      const originalItem = originalBaoBieu.baoBieuContents.find(item => item.id === currentItem.id);

      // Chỉ gửi request nếu nội dung đã thay đổi
      if (originalItem && originalItem.content !== currentItem.content) {
        console.log(`Đang lưu content ID: ${currentItem.id}`);
        const payload = { content: currentItem.content };
        const promise = axios.put(
          `http://localhost:5015/api/v1/bao-bieu/${baoBieuId}/contents/${currentItem.id}`,
          payload
        );
        updatePromises.push(promise);
      }
    });

    if (updatePromises.length === 0) {
      message.info('Không có thay đổi nào để lưu.');
      setSaving(false);
      return;
    }

    try {
      await Promise.all(updatePromises);
      message.success(`Đã lưu thành công ${updatePromises.length} thay đổi!`);
      // Sau khi lưu thành công, cập nhật lại trạng thái ban đầu
      setOriginalBaoBieu(JSON.parse(JSON.stringify(baoBieu)));
    } catch (error) {
      console.error('Lỗi khi lưu các thay đổi:', error);
      message.error('Đã xảy ra lỗi trong quá trình lưu.');
    } finally {
      setSaving(false);
    }
  };

  // Render component
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!baoBieu) {
    return <Typography.Title level={3} style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu báo biểu.</Typography.Title>;
  }

  // Tạo các items cho Tabs
  const tabItems: TabsProps['items'] = baoBieu.baoBieuContents.map((item) => ({
    key: String(item.id),
    label: `Nội dung số ${item.soThuTu}`,
    children: (
      <CustomEditor
        initialValue={item.content}
        onChange={(newContent) => handleEditorChange(item.id, newContent)}
      />
    ),
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Typography.Title level={2}>{baoBieu.tenBaoBieu}</Typography.Title>
      <Typography.Text type="secondary">Dựa trên mẫu: {baoBieu.tenBaseBaoBieu}</Typography.Text>

      <Tabs defaultActiveKey="1" items={tabItems} style={{ marginTop: '16px' }} />

      <Button
        type="primary"
        onClick={handleSaveAll}
        loading={saving}
        style={{ marginTop: '24px' }}
      >
        Lưu tất cả thay đổi
      </Button>

      <Button
        onClick={() => {
          if (baoBieu) {
            exportToHtmlDoc(
              baoBieu.baoBieuContents,
              baoBieu.tenBaoBieu,
              `Mau_${baoBieu.tenBaoBieu}`
            );
          }
        }}
        disabled={!baoBieu}
      >
        📝 Tải về file Word (.doc)
      </Button>
    </div>
  );
};

export default BaoBieuDetailPage;