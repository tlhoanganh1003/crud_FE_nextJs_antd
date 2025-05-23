'use client';

import { Layout, Menu } from "antd";
import { ReactNode } from "react";
import { useRouter } from 'next/navigation';

const { Header, Footer, Content, Sider } = Layout;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const menuItems = [
    { key: 'home', label: 'Trang chủ', path: '/admin' },
    { key: 'qlsv', label: 'Quản lý sinh viên', path: '/admin/qlsv' },
    { key: 'tangmoi', label: 'Tăng mới', path: '/admin/tangmoi' },
    // thêm nữa nếu cần
  ];


  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{
        background: '#001529',
        color: '#fff',
        fontSize: '20px',
        fontWeight: 'bold',
        paddingLeft: '20px'
      }}
      className="sticky top-0 z-10"
      >
        Hệ thống quản lý sinh viên
      </Header>

      {/* Main Layout: Sider + Content */}
      <Layout>
        {/* Sidebar */}
        <Sider
          width={240}
          style={{
            background: '#fff',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key} onClick={() => router.push(item.path)}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        {/* Content */}

        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(66, 57, 57, 0.1)'
          }}
        >
          {children}
        </Content>

      </Layout>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        ©2025 Thiên Hoàng - All rights reserved
      </Footer>
    </Layout>

  );
}
