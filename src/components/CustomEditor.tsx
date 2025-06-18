/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from 'react-dom/client'
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import dynamic from 'next/dynamic';
import MathInput from '@/app/baoBieuThoiTiet/component/MathInput';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false
});
import type { Editor as TinyMCEEditor, Ui } from 'tinymce';
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

// === HÀM MỚI: Mở Dialog để chỉnh sửa công thức ===



function openMathEditorDialog(editor: TinyMCEEditor) {
  const selectedNode = editor.selection.getNode();
  const isEditing = selectedNode.nodeName === 'SPAN' && selectedNode.classList.contains('math-container');
  const initialLatex = isEditing ? selectedNode.getAttribute('data-latex') ?? '' : '';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface MathDialogData { latexValue: string; }

  // Sử dụng lại giải pháp dự phòng dùng `window` vì nó đã được chứng minh là đáng tin cậy nhất
  // để truyền dữ liệu ra khỏi một htmlpanel.
  (window as any).currentLatexValue = initialLatex;

  editor.windowManager.open({
    title: isEditing ? 'Sửa công thức' : 'Chèn công thức',
    body: {
      type: 'panel',
      items: [{ type: 'htmlpanel', html: `<div id="math-dialog-react-container"></div>` }]
    },
    buttons: [
      { type: 'cancel', text: 'Hủy' },
      { type: 'submit', text: 'Chèn', buttonType: 'primary' }
    ],
    onSubmit: (api: Ui.Dialog.DialogInstanceApi<any>) => {
      const latexValue = (window as any).currentLatexValue;
      if (typeof latexValue === 'string' && latexValue.trim() !== '') {
        const content = `<span class="math-container" contenteditable="false" data-latex="${latexValue}">\\(${latexValue}\\)</span> `;
        if (isEditing) { editor.selection.select(selectedNode); }
        editor.selection.setContent(content);
      }
      api.close();
    },
    onClose: () => {
      if ((window as any).reactMathRoot) {
        (window as any).reactMathRoot.unmount();
        delete (window as any).reactMathRoot;
      }
      delete (window as any).currentLatexValue;
      if ((window as any).mathVirtualKeyboard) {
        (window as any).mathVirtualKeyboard.visible = false;
      }
    }
  });

  setTimeout(() => {
    const container = document.getElementById('math-dialog-react-container');
    if (container) {
      const root = createRoot(container);
      (window as any).reactMathRoot = root;
      root.render(
        <React.StrictMode>
          <MathInput
            initialValue={initialLatex}
            onValueChange={(rawLatex: string) => {
              // ==========================================================
              // ĐÂY LÀ PHẦN "DỌN DẸP" QUAN TRỌNG
              // ==========================================================
              let cleanedLatex = rawLatex;

              // Kiểm tra và loại bỏ cặp dấu $$ ở đầu và cuối
              if (cleanedLatex.startsWith('$$') && cleanedLatex.endsWith('$$')) {
                cleanedLatex = cleanedLatex.substring(2, cleanedLatex.length - 2);
              }

              // Kiểm tra và loại bỏ cặp dấu $ ở đầu và cuối
              // (chạy sau $$ để không bị lỗi với trường hợp $$...$$)
              if (cleanedLatex.startsWith('$') && cleanedLatex.endsWith('$')) {
                cleanedLatex = cleanedLatex.substring(1, cleanedLatex.length - 1);
              }
              
              // Chỉ lưu giá trị đã được "dọn dẹp" vào biến tạm
              (window as any).currentLatexValue = cleanedLatex;
              // ==========================================================
            }}
          />
        </React.StrictMode>
      );
    }
  }, 100);
}



const CustomEditor = forwardRef<CustomEditorHandle, CustomEditorProps>(
  ({ initialValue, onChange }, ref) => {
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

      toolbar: "customsvg mathbutton togglekeyboard | undo redo | blocks | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help superscript subscript"
      ,
      relative_urls: false,
      branding: false,
      convert_urls: false,
      entity_encoding: 'raw' as any,
      entities: '160,nbsp',
      verify_html: false,
      // Rất quan trọng: cho phép span có thuộc tính contenteditable
      extended_valid_elements: 'span[class|contenteditable|data-latex],svg[*],use[*],path[*],circle[*],rect[*],line[*],g[*]',
      content_style: `
        .math-container {
          cursor: pointer;
          padding: 2px 5px;
          border: 1px dashed transparent;
        }
        .math-container:hover {
          background-color: #f0f0f0;
          border-color: #ccc;
        }
        body { font-family:Helvetica,Arial,sans-serif; font-size:14pt }
      `,
      // file: CustomEditor.tsx

      setup: function (editor: TinyMCEEditor) {
        // CHỈ GIỮ LẠI NÚT NÀY. Các nút khác đã bị xóa.
        editor.ui.registry.addButton('mathbutton', {
          icon: 'formula',
          tooltip: 'Chèn/Sửa công thức',
          onAction: function () {
            // Hàm này chỉ có một nhiệm vụ: mở dialog.
            openMathEditorDialog(editor);
          }
        });
        editor.ui.registry.addButton('customsvg', {
          text: 'WMO',
          tooltip: 'Chèn ký hiệu thời tiết',
          onAction: function () {
            loadSvgSymbols(editor);
          }
        })

        // Sự kiện double click để sửa công thức (vẫn rất hữu ích)
        editor.on('dblclick', function (e) {
          const target = e.target as HTMLElement;
          if (target.nodeName === 'SPAN' && target.classList.contains('math-container')) {
            openMathEditorDialog(editor);
          }
        });
      }


    };




    // Trong component CustomEditor của bạn

    return (
      <>
        <h3>📝 TinyMCE React - Chèn ký hiệu thời tiết WMO</h3>
        <Editor
          apiKey='70336sddggwtrn1w5yrff3pushljb0zaqufgjhosjcxxvynk'
          init={editorConfig}
          value={initialValue}
          // CHANGED: Lấy đối tượng `editor` từ callback
          onEditorChange={(content, editor) => {
            onChange?.(content);

            // 👇 Đảm bảo MathJax typeset một cách an toàn và nhất quán
            setTimeout(() => {
              // Dùng đối tượng `editor` được cung cấp sẵn
              const iframeWin = editor.getDoc().defaultView as any;
              if (iframeWin?.MathJax?.typesetPromise) {
                iframeWin.MathJax.typesetPromise();
              }
            }, 100);
          }}
          onInit={(evt, editor) => {
            editorRef.current = editor;

            // 👇 Dùng editor.getDoc() để truy cập iframe một cách an toàn.
            // Đây là "source of truth" duy nhất.
            const doc = editor.getDoc();

            // Kiểm tra xem `doc` và `doc.head` có tồn tại không.
            // Đây là cách xử lý an toàn cho các giá trị có thể là null.
            if (doc && doc.head) {
              if (!doc.getElementById('mathjax-script')) {
                // Tất cả các thao tác đều dựa trên `doc`, không dùng `iframe` nữa.
                const config = doc.createElement('script');
                config.type = 'text/javascript';
                config.innerHTML = `
  window.MathJax = {
    tex: {
      // ==========================================================
      // ĐÂY LÀ THAY ĐỔI QUAN TRỌNG NHẤT
      //
      // Chỉ cho phép MỘT loại cú pháp inline mà chúng ta tạo ra.
      // Xóa bỏ hoàn toàn quy tắc ['$', '$'].
      inlineMath: [['\\\\(', '\\\\)']], 
      
      // Giữ lại cú pháp display math nếu bạn cần
      displayMath: [['\\\\[', '\\\\]']],
      // ==========================================================

      // Tắt các bộ lọc "thông minh" có thể gây ra vấn đề
      processEscapes: true 
    },
    svg: {
      // Cấu hình này giúp tăng hiệu suất
      fontCache: 'global'
    },
    startup: {
      // Cho phép MathJax tự chạy khi tải xong
      typeset: true
    }
  };
`;

                const script = doc.createElement('script');
                script.id = 'mathjax-script';
                script.type = 'text/javascript';
                script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
                script.async = true;

                // Thêm vào head của document trong iframe
                doc.head.appendChild(config);
                doc.head.appendChild(script);
              }
            }
          }}
        />
      </>
    );
  });


CustomEditor.displayName = 'CustomEditor';
export default CustomEditor;




