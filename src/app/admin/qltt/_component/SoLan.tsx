'use client';
import React from 'react';
import { Form } from 'antd';

const CloudForm = () => {
  const [form] = Form.useForm();


  return (
    <>
      <h1 style={{ textAlign: 'center', marginBottom: 16 }}>SỐ LẦN CÓ LOẠI MÂY</h1>
      <Form form={form} >
        

      </Form>
    </>
  );
};

export default CloudForm;