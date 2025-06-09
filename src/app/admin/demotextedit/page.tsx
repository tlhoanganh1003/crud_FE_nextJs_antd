/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { SetStateAction, useEffect, useRef, useState } from 'react';
import 'mathlive';

import CustomEditor from '@/components/CustomEditor';
import axios from 'axios';
import { Button } from 'antd';

const DemoTextEdit = () => {

  const [content, setContent] = useState('');
  const editorRef = useRef<{ handleSave: () => void; handleSaveDemo: () => void }>(null);

  useEffect(() => {
    axios.get('http://localhost:5015/api/api/content/2')
      .then(res => {
        setContent(res.data.content);
      });
  }, []);

  const handleEditorChange = (newContent: SetStateAction<string>) => {
    setContent(newContent);
    // Hoặc gọi API lưu nếu muốn realtime
  };


  return (
    <>

      <CustomEditor
        ref={editorRef}
        initialValue={content}
        onChange={handleEditorChange} />
      <Button
        onClick={() => editorRef.current?.handleSave()}
        style={{ marginTop: 24, backgroundColor: 'green', color: 'white' }}
      >
        📤 Lưu base 
      </Button>

      <Button
        onClick={() => editorRef.current?.handleSaveDemo()}
        style={{ marginTop: 8 }}
      >
        📤 Lưu demo content
      </Button>

    </>
  );
};

export default DemoTextEdit;
