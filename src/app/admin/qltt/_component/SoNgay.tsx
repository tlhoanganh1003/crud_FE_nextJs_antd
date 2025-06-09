'use client';
import 'mathlive';
import { Button, Form, Input } from 'antd';
import { mockSoNgayIcon } from '@/data/kttt/soNgayIcon';

const iconList = Array.from(mockSoNgayIcon);

const SoNgay = () => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Kết quả submit:", values);
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <div style={{ textAlign: 'center', marginBottom: 16 , border: '1px solid grey'}}>
          <span className="text-blue-600 font-bold">SỐ NGÀY CÓ HIỆN TƯỢNG KHÍ TƯỢNG</span>
        </div>

        <table style={{ width: "100%" }}>
          <tbody>
            {[0, 1].map((row) => (
              <tr key={row}>
                {iconList.slice(row * 12, (row + 1) * 12).map((item) => (
                  <td
                    key={item.tenKhiTuong}
                    style={{
                      width: 100,
                      height: 70,
                      textAlign: "center",
                      verticalAlign: "middle",
                      padding: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <Form.Item
                        name={item.tenKhiTuong}
                        initialValue={item.soLanXuatHien}
                        style={{ margin: 0 }}
                      >
                        <Input type="number" style={{ width: 60, textAlign: "center" }} />
                      </Form.Item>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Button onClick={handleSubmit} type="primary" style={{ marginTop: 16 }}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SoNgay;
