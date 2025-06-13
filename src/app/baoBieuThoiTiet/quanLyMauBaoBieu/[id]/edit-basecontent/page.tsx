'use client';

import React, { useEffect, useState, useCallback, use } from 'react';

import { Tabs, Button, Spin, message, Typography } from 'antd';
import type { TabsProps } from 'antd';
import axios from 'axios';
import CustomEditor from '@/components/CustomEditor';
import { exportToHtmlDoc } from '@/app/ultis/exportHelper';
import { printHtmlContent } from '@/app/ultis/exportPDF';
import { useRouter } from 'next/navigation';
import { RollbackOutlined } from '@ant-design/icons';


interface BaseContent {
  id: number;
  content: string;
  soThuTu: number;
}

interface BaseBaoBieu {
  id: number;
  tenBaseBaoBieu: string;
  baseContents: BaseContent[];
}



const API_URL = 'http://localhost:5015/api/v1/base-bao-bieu';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const baseBaoBieuId = resolvedParams.id;

  const [messageApi, contextHolder] = message.useMessage();
  const [baseBaoBieu, setBaseBaoBieu] = useState<BaseBaoBieu | null>(null);
  const [originalBaseBaoBieu, setOriginalBaseBaoBieu] = useState<BaseBaoBieu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Hàm fetch dữ liệu
  const fetchData = useCallback(async () => {
    if (!baseBaoBieuId) return;
    setLoading(true);
    try {
      // === BƯỚC 3: GỌI ĐÚNG API ENDPOINT ===
      const response = await axios.get<BaseBaoBieu>(`${API_URL}/${baseBaoBieuId}`);

      // Sắp xếp contents theo soThuTu để hiển thị đúng thứ tự
      const sortedData = {
        ...response.data,
        // Sửa tên thuộc tính thành 'baseContents'
        baseContents: response.data.baseContents.sort((a, b) => a.soThuTu - b.soThuTu)
      };

      setBaseBaoBieu(sortedData);
      setOriginalBaseBaoBieu(JSON.parse(JSON.stringify(sortedData)));
      messageApi.success('Tải dữ liệu mẫu báo biểu thành công!');
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu mẫu báo biểu:', error);
      messageApi.error('Không thể tải dữ liệu mẫu báo biểu.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseBaoBieuId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Hàm xử lý khi nội dung của một editor thay đổi
  const handleEditorChange = (contentId: number, newContent: string) => {
    setBaseBaoBieu(prevBaseBaoBieu => {
      if (!prevBaseBaoBieu) return null;

      // === BƯỚC 4: CẬP NHẬT ĐÚNG STATE VÀ THUỘC TÍNH ===
      const updatedContents = prevBaseBaoBieu.baseContents.map(item =>
        item.id === contentId ? { ...item, content: newContent } : item
      );

      return { ...prevBaseBaoBieu, baseContents: updatedContents };
    });
  };

  // Hàm xử lý khi nhấn nút lưu
  const handleSaveAll = async () => {
    if (!baseBaoBieu || !originalBaseBaoBieu) {
      messageApi.warning('Không có dữ liệu để lưu.');
      return;
    }

    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePromises: Promise<any>[] = [];

    // Lặp qua 'baseContents'
    baseBaoBieu.baseContents.forEach(currentItem => {
      const originalItem = originalBaseBaoBieu.baseContents.find(item => item.id === currentItem.id);

      if (originalItem && originalItem.content !== currentItem.content) {
        console.log(`Đang lưu base content ID: ${currentItem.id}`);
        const payload = { content: currentItem.content };

        // === BƯỚC 5: GỌI ĐÚNG API UPDATE (ĐANG GIẢ ĐỊNH) ===
        // API này bạn cần xây dựng ở backend
        const promise = axios.put(
          `${API_URL}/${baseBaoBieuId}/contents/${currentItem.id}`,
          payload
        );
        updatePromises.push(promise);
      }
    });

    if (updatePromises.length === 0) {
      messageApi.info('Không có thay đổi nào để lưu.');
      setSaving(false);
      return;
    }

    try {
      await Promise.all(updatePromises);
      messageApi.success(`Đã lưu thành công ${updatePromises.length} thay đổi!`);
      // Cập nhật lại trạng thái ban đầu
      setOriginalBaseBaoBieu(JSON.parse(JSON.stringify(baseBaoBieu)));
    } catch (error) {
      console.error('Lỗi khi lưu các thay đổi:', error);
      messageApi.error('Đã xảy ra lỗi. API cập nhật có thể chưa được xây dựng.');
    } finally {
      setSaving(false);
    }
  };

  // Render component
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!baseBaoBieu) {
    return <Typography.Title level={3} style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu mẫu báo biểu.</Typography.Title>;
  }

  // Tạo các items cho Tabs
  const tabItems: TabsProps['items'] = baseBaoBieu.baseContents.map((item) => ({
    key: String(item.id),
    label: `Nội dung số ${item.soThuTu}`,
    children: (
      <CustomEditor
        initialValue={item.content}
        onChange={(newContent) => handleEditorChange(item.id, newContent)}
      />
    ),
  }));

  const handlePrintPdf = () => {
    if (baseBaoBieu) {
      printHtmlContent(
        baseBaoBieu.baseContents,
        baseBaoBieu.tenBaseBaoBieu
      );
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>

        <Typography.Title level={2}>Sửa Mẫu: {baseBaoBieu.tenBaseBaoBieu}</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
        </div>

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
            if (baseBaoBieu) {
              exportToHtmlDoc(
                baseBaoBieu.baseContents,
                baseBaoBieu.tenBaseBaoBieu,
                `Mau_${baseBaoBieu.tenBaseBaoBieu}`
              );
            }
          }}
          disabled={!baseBaoBieu}
        >
          📝 Tải về file Word (.doc)
        </Button>

        <Button onClick={handlePrintPdf}>
          📄 In ra PDF
        </Button>
      </div>
    </>
  );
}