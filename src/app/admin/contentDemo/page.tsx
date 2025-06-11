/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { SetStateAction, useEffect, useRef, useState } from 'react';
import 'mathlive';

import CustomEditor from '@/components/CustomEditor';
import axios from 'axios';
import { Button, Select } from 'antd';


const { Option } = Select;

const ContentDemo = () => {
  const [options, setOptions] = useState<{ id: number; content: string }[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [content, setContent] = useState('');
  // const editorRef = useRef<{ handleSave: () => void; handleSaveDemo: () => void }>(null);

  useEffect(() => {
    axios.get('http://localhost:5015/api/api/contentdemo')
      .then(res => {
        // Giả sử API trả về một mảng các object { id, content }
        setOptions(res.data);
      })
      .catch(err => {
        console.error('Lỗi khi lấy dữ liệu contentdemo:', err);
      });
  }, []);

  useEffect(() => {
    if (!selected) return;

    axios.get(`http://localhost:5015/api/api/contentdemo/${selected}`)
      .then(res => {
        setContent(res.data?.content || '');
      })
      .catch(err => {
        console.error('Lỗi khi lấy content chi tiết:', err);
      });
  }, [selected]);

  const handleChange = (value: string) => {
    setSelected(value);
    //console.log('Bạn đã chọn ID:', value);
  };

  const handleEditorChange = (newContent: SetStateAction<string>) => {

    setContent(newContent);

  };

  const handleSave = async () => {
    try {
      const payload = {
        id: selected,       // hoặc selected.id nếu selected là object
        content: content,   // content hiện tại của editor
      };

      const response = await axios.post(`http://localhost:5015/api/api/contentdemo/${selected}`, payload);


      // console.log('Kết quả lưu:', response.data);
    } catch (error) {
      console.error('Lỗi khi lưu nội dung:', error);

    }
  };


  return (
    <>
      <label htmlFor="">chọn content: </label>
      <Select
        value={selected}
        style={{ width: 300 }}
        onChange={handleChange}
        placeholder="Chọn content demo"
      >
        {options.map((item) => (
          <Option key={item.id} value={item.id.toString()}>
            {item.id}
          </Option>
        ))}
      </Select>
      <CustomEditor
        //ref={editorRef}
        initialValue={content}
        onChange={handleEditorChange}
      />

      <Button
        onClick={handleSave}
        style={{ marginTop: 8 }}
      >
        update demo content
      </Button>
    </>
  );
};

export default ContentDemo;
