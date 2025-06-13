'use client'
import { Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter()
  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Button type="primary" onClick={() => {
          router.push('/admin')
          messageApi.success('đang điều hướng trang vui lòng đợi!')
        }
        }>
          Đến trang chủ
        </Button>
        <Button type="primary" onClick={() => {
          router.push('/baoBieuThoiTiet')

          messageApi.success('đang điều hướng trang vui lòng đợi!')
        }
        }>
          Đến báo biểu thời tiết
        </Button>
      </div>
    </>
  );
}
