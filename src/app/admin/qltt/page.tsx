/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useEffect, useMemo, useState } from 'react';
import 'mathlive';
import { Button, Form, Table, TableProps } from 'antd';
import { dataHtktSource, DataType } from '@/data/qltt';
import MathInput from '@/components/MathInput';
import SoNgay from './_component/SoNgay';
import CloudForm from './_component/SoLan';
import MyEditor from '@/components/TestTinyMCE';
import CustomEditor from '@/components/CustomEditor';
//import MathInput from '@/libs/MathInput';

// import dynamic from 'next/dynamic';

// const MathInput = dynamic(() => import('@/libs/MathInput'), { ssr: false });

const Qltt = () => {
  const [dataTable, setDataTable] = useState<DataType[]>(dataHtktSource);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ rows: dataHtktSource });
  }, []);



  const columns: TableProps<DataType>['columns'] = useMemo(
    () => [
      {
        title: <span className="text-blue-600 font-bold ">Ngày</span>,
        dataIndex: 'key',
        key: 'key',
        render: (_: any, __: any, index: number) => <>{index + 1}</>,
        align: 'center',
        width: '10%',
      },
      {
        title: <span className="text-blue-600 font-bold">HIỆN TƯỢNG KHÍ TƯỢNG</span>,
        dataIndex: 'htkt',
        key: 'htkt',
        render: (_: any, record: DataType, index: number) => (
          <Form.Item
            name={['rows', index, 'htkt']}
            style={{ width: '100%', margin: 0 }}
            className="h-full"
          >
            <MathInput
            // value={form.getFieldValue(['rows', index, 'htkt'])}
            // onChange={(val) => {
            //   // Cập nhật form field khi input thay đổi
            //   form.setFields([
            //     {
            //       name: ['rows', index, 'htkt'],
            //       value: val,
            //     },
            //   ]);
            // }}
            />

          </Form.Item>
        ),
        align: 'center',
        width: '90%',
      }


    ],
    []
  );



  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("hi:", values);
      // Gọi API ở đây nếu cần
    } catch (err) {
      console.log("Validation failed:", err);
    }

  }

  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmit}
        labelCol={{ span: 4 }}

      >
        <Table<DataType>
          columns={columns}
          dataSource={dataTable}
          pagination={false}
        />
        <Button onClick={handleSubmit}>submit</Button>
      </Form>
      <SoNgay />
      <CloudForm />

 
      <CustomEditor />



         <MyEditor />
    </>
  );
};

export default Qltt;
