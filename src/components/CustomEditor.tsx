/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false
});
import type { Editor as TinyMCEEditor } from 'tinymce';
import axios from 'axios';

interface CustomEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void
}
export interface CustomEditorHandle {
  handleSave: () => void;
  handleSaveDemo: () => void;
}
async function loadSvgSymbols(editor: TinyMCEEditor) {
  try {
    const res = await fetch('/symbols.svg');
    if (!res.ok) {
      throw new Error(`Không thể tải file symbols.svg: ${res.statusText}`);
    }
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const symbols = doc.querySelectorAll('symbol');

    editor.windowManager.open({
      title: 'Chọn biểu tượng SVG',
      body: {
        type: 'panel',
        items: [
          {
            type: 'htmlpanel',
            html: '<div id="custom-svg-list" style="display:flex;flex-wrap:wrap;gap:8px;max-height:400px;overflow:auto;"></div>'
          }
        ]
      },
      buttons: [{ type: 'cancel', text: 'Đóng' }]
    });

    setTimeout(() => {
      const list = document.getElementById('custom-svg-list');
      if (!list) return;
      list.innerHTML = '';
      symbols.forEach(symbol => {
        const viewBox = symbol.getAttribute('viewBox');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', viewBox ?? '0 0 24 24');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.style.cursor = 'pointer'; svg.style.border = '1px solid #ccc'; svg.style.margin = '4px';

        Array.from(symbol.childNodes).forEach(child => svg.appendChild(child.cloneNode(true)));
        svg.addEventListener('click', () => insertSvg(editor, symbol)); // Gọi hàm insertSvg đã sửa lỗi
        list.appendChild(svg);
      });
    }, 100);

  } catch (error) {
    console.error("Lỗi khi tải symbol:", error);
    editor.notificationManager.open({
      text: 'Đã xảy ra lỗi khi tải các biểu tượng SVG.',
      type: 'error'
    });
  }
}

function insertSvg(editor: { insertContent: (arg0: string) => void; windowManager: { close: () => void; }; }, symbol: SVGSymbolElement) {
  const viewBox = symbol.getAttribute('viewBox');


  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgEl.setAttribute('viewBox', viewBox ?? '0 0 24 24');
  svgEl.style.width = '1.5em';
  svgEl.style.height = '1.5em';
  svgEl.style.verticalAlign = 'middle';

  Array.from(symbol.childNodes).forEach(child => {
    svgEl.appendChild(child.cloneNode(true));
  });

  const wrapper = document.createElement('span');
  wrapper.contentEditable = 'false';
  wrapper.style.display = 'inline-block';
  wrapper.appendChild(svgEl);

  editor.insertContent(wrapper.outerHTML + ' ');

  editor.windowManager.close();
}



const CustomEditor = forwardRef<CustomEditorHandle, CustomEditorProps>(
  ({ initialValue, onChange}, ref) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    const handleSave = async () => {
      if (editorRef.current) {
        const content = editorRef.current.getContent();
        try {
          const res = await axios.post('http://localhost:5015/api/api/content', {
            content: content,
          });
          console.log(res);
        } catch (err) {
          console.error('❌ Lỗi khi tạo:', err);
        }
      }
    };

    const handleSaveDemo = async () => {
      if (editorRef.current) {
        const content = editorRef.current.getContent();
        try {
          const res = await axios.post('http://localhost:5015/api/api/contentdemo', {
            content: content,
          });
          console.log('tạo thành công' + res.data.id);
        } catch (err) {
          console.error('❌ Lỗi khi tạo:', err);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleSave,
      handleSaveDemo,
    }));

    const editorConfig = {
      promotion: false,
      fontsize_formats: "8pt 9pt 10pt 11pt 12pt 26pt 36pt",
      height: 500,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
      ],

      toolbar: "customsvg | undo redo | blocks | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help superscript subscript"
      ,
      relative_urls: false,
      branding: false,
      convert_urls: false,
      entity_encoding: 'raw' as any,
      entities: '160,nbsp',
      // Rất quan trọng: cho phép span có thuộc tính contenteditable
      extended_valid_elements: 'svg[*],use[*],path[*],circle[*],rect[*],line[*],g[*],span[contenteditable|style]',
      content_style: `
        svg {
          /* CSS cho SVG bên trong vùng soạn thảo */
          width: 1.5em;
          height: 1.5em;
          vertical-align: middle;
        }
      `,
      setup: function (editor:TinyMCEEditor) {
        editor.ui.registry.addButton('customsvg', {
          text: 'WMO',
          tooltip: 'Chèn ký hiệu thời tiết',
          onAction: function () {
            loadSvgSymbols(editor);
          }
        });
      }
    };




    return (
      <>
        <h3>📝 TinyMCE React - Chèn ký hiệu thời tiết WMO</h3>
        <Editor
          apiKey='70336sddggwtrn1w5yrff3pushljb0zaqufgjhosjcxxvynk'
          init={editorConfig}
          value={initialValue}
          onEditorChange={(content) => onChange?.(content)}
          onInit={(evt, editor) => {
            editorRef.current = editor;
          }}
        />
      </>
    );
  });


CustomEditor.displayName = 'CustomEditor';
export default CustomEditor;




