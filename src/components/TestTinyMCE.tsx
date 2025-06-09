import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function MyEditor() {
  // Dùng useState để lưu trữ nội dung của editor
  const [editorContent, setEditorContent] = useState('<p>Đây là nội dung ban đầu.</p>');

  // Dùng useRef để có thể truy cập trực tiếp vào instance của editor
  const editorRef = useRef(null);
  
  // Hàm để log nội dung hiện tại ra console khi nhấn nút
  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      alert('Nội dung đã được log ra console!');
    }
  };

  return (
    <>
      <h1>TinyMCE React Demo</h1>
      <Editor
        apiKey='70336sddggwtrn1w5yrff3pushljb0zaqufgjhosjcxxvynk' // <-- THAY BẰNG API KEY CỦA BẠN
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>Chào mừng bạn đến với TinyMCE!</p>"
        init={{
          height: 500,
          menubar: false, // Ẩn menu bar
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        // Cập nhật state mỗi khi nội dung trong editor thay đổi
        onEditorChange={(newContent, editor) => setEditorContent(newContent)}
      />
      <button onClick={logContent} style={{ marginTop: '10px' }}>Lấy nội dung Editor</button>

      {/* Vùng hiển thị nội dung đã lưu */}
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Nội dung được lưu trong state:</h2>
        {/* Sử dụng dangerouslySetInnerHTML để render HTML, hãy cẩn thận với XSS */}
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>
    </>
  );
}