/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <Button type="primary" onClick={() => 
        router.push('/admin')
        //message.success('Thông báo thành công!')
        }>
      Đến trang chủ
    </Button>
    <Button type="primary" onClick={() => 
        router.push('/baoBieuThoiTiet')
        //message.success('Thông báo thành công!')
        }>
      Đến báo biểu thời tiết
    </Button>
    </div>
  );
}
