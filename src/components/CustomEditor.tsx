// file: CustomEditor.tsx
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
        svg.addEventListener('click', () => insertSvg(editor, symbol));
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


// === HÀM ĐÃ ĐƯỢC SỬA LẠI: Mở Dialog để chỉnh sửa công thức ===
// Logic đã được đơn giản hóa để xử lý đúng dữ liệu từ MathInput.
function openMathEditorDialog(editor: TinyMCEEditor) {
  const selectedNode = editor.selection.getNode();
  const isEditing = selectedNode.nodeName === 'SPAN' && selectedNode.classList.contains('math-container');
  const initialLatex = isEditing ? selectedNode.getAttribute('data-latex') ?? '' : '';

  // Sử dụng một biến tạm trên `window` để lưu trữ giá trị LaTeX từ component React bên trong dialog.
  // Đây là một cách đáng tin cậy để giao tiếp giữa `htmlpanel` và dialog API của TinyMCE.
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
    // Hàm này được gọi khi người dùng nhấn nút "Chèn"
    onSubmit: (api: Ui.Dialog.DialogInstanceApi<any>) => {
      // Lấy giá trị LaTeX đã được "dọn dẹp" từ biến tạm.
      const rawValue = (window as any).currentLatexValue;

      if (typeof rawValue === 'string' && rawValue.trim() !== '') {
        // GIẢI THÍCH LOGIC MỚI:
        // MathInput luôn trả về một chuỗi LaTeX thuần túy, ví dụ: '\\frac{a}{b}' hoặc '\\wmosymbol{WW_01}'.
        // Logic phân nhánh cũ (kiểm tra #html{...}) đã được loại bỏ vì nó không bao giờ được thực thi.
        //
        // Luồng xử lý luôn giống nhau cho mọi loại nội dung từ MathInput:
        // 1. Lấy chuỗi LaTeX.
        // 2. Bọc nó trong một thẻ <span> với các thuộc tính cần thiết (`data-latex`, `class`, `contenteditable`).
        // 3. Đặt chuỗi LaTeX vào bên trong `\\(...\\)` để MathJax nhận diện và render.
        //
        // MathJax đã được cấu hình trong onInit để hiểu cả LaTeX tiêu chuẩn và macro `\wmosymbol` của chúng ta.
        // Do đó, cách tiếp cận thống nhất này hoạt động cho cả công thức toán học và các ký hiệu thời tiết.

        // Rất quan trọng: Escape dấu ngoặc kép trong chuỗi LaTeX để không làm hỏng thuộc tính HTML.
        const escapedLatex = rawValue.replace(/"/g, '"');

        const contentToInsert = `<span class="math-container" contenteditable="false" data-latex="${escapedLatex}">\\(${rawValue}\\)</span> `;

        // Nếu đang sửa, hãy thay thế node cũ. Nếu không, chèn vào vị trí con trỏ.
        if (isEditing) {
          editor.selection.select(selectedNode);
        }
        editor.selection.setContent(contentToInsert);
      }
      api.close();
    },
    onClose: () => {
      // Dọn dẹp component React và các biến tạm khi đóng dialog.
      if ((window as any).reactMathRoot) {
        (window as any).reactMathRoot.unmount();
        delete (window as any).reactMathRoot;
      }
      delete (window as any).currentLatexValue;
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.visible = false;
      }
    }
  });

  // Render component MathInput vào dialog.
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
              // Phần "dọn dẹp" này rất tốt và được giữ lại.
              // Nó loại bỏ các dấu $ hoặc $$ mà MathLive có thể thêm vào.
              let cleanedLatex = rawLatex;
              if (cleanedLatex.startsWith('$$') && cleanedLatex.endsWith('$$')) {
                cleanedLatex = cleanedLatex.substring(2, cleanedLatex.length - 2);
              }
              if (cleanedLatex.startsWith('$') && cleanedLatex.endsWith('$')) {
                cleanedLatex = cleanedLatex.substring(1, cleanedLatex.length - 1);
              }
              // Lưu giá trị đã được "dọn dẹp" và cắt bỏ khoảng trắng thừa.
              (window as any).currentLatexValue = cleanedLatex.trim();
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

      setup: function (editor: TinyMCEEditor) {
        editor.ui.registry.addButton('mathbutton', {
          icon: 'formula',
          tooltip: 'Chèn/Sửa công thức hoặc ký hiệu',
          onAction: function () {
            openMathEditorDialog(editor);
          }
        });
        editor.ui.registry.addButton('customsvg', {
          text: 'WMO',
          tooltip: 'Chèn ký hiệu thời tiết (dạng SVG trực tiếp)',
          onAction: function () {
            loadSvgSymbols(editor);
          }
        })

        editor.on('dblclick', function (e) {
          const target = e.target as HTMLElement;
          if (target.nodeName === 'SPAN' && target.classList.contains('math-container')) {
            openMathEditorDialog(editor);
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
          onEditorChange={(content, editor) => {
            onChange?.(content);
            setTimeout(() => {
              const iframeWin = editor.getDoc().defaultView as any;
              if (iframeWin?.MathJax?.typesetPromise) {
                iframeWin.MathJax.typesetPromise();
              }
            }, 100);
          }}
         onInit={(evt, editor) => {
            editorRef.current = editor;
            const doc = editor.getDoc();

            if (doc && doc.head) {
              if (!doc.getElementById('mathjax-script')) {
                fetch('/symbols.svg')
                  .then(res => res.text())
                  .then(text => {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
                    const symbols = svgDoc.querySelectorAll('symbol');
                    let cssRules = '';

                    symbols.forEach(symbol => {
                      const originalSymbolId = symbol.id;
                      if (originalSymbolId) {
                        const safeSymbolId = originalSymbolId.replace(/_/g, '-');
                        
                        // ----- BẮT ĐẦU CSS TINH CHỈNH -----
                        const viewBox = symbol.getAttribute('viewBox');
                        let aspectRatio = '1 / 1'; // Mặc định là hình vuông
                        if (viewBox) {
                          const parts = viewBox.split(' ');
                          if (parts.length === 4) {
                            const w = parseFloat(parts[2]);
                            const h = parseFloat(parts[3]);
                            if (w > 0 && h > 0) {
                              aspectRatio = `${w} / ${h}`;
                            }
                          }
                        }

                        // Tạo SVG hoàn chỉnh từ symbol, đảm bảo nó có thể đổi màu
                        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        if (viewBox) svgEl.setAttribute('viewBox', viewBox);
                        // QUAN TRỌNG: Đặt fill="currentColor" để SVG nhận màu từ text
                        svgEl.setAttribute('fill', 'currentColor'); 
                        svgEl.innerHTML = symbol.innerHTML;

                        const dataUri = 'data:image/svg+xml;base64,' + btoa(svgEl.outerHTML);

                        // Quy tắc CSS mới, chính xác hơn
                        cssRules += `
                          .wmo-symbol-${safeSymbolId} {
                            /* Bỏ qua nội dung của \phantom{W} */
                            display: inline-block;
                            text-indent: -9999px; /* Ẩn chữ 'W' của phantom đi */
                            
                            /* Kích thước và tỷ lệ */
                            width: 1.3em; /* Có thể điều chỉnh giá trị này */
                            aspect-ratio: ${aspectRatio};
                            
                            /* Căn chỉnh theo chiều dọc */
                            vertical-align: middle; /* Điều chỉnh để thẳng hàng với văn bản */

                            /* Thay thế mask bằng background để kiểm soát tốt hơn */
                            background-image: url("${dataUri}");
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: contain;
                          }
                        `;
                        // ----- KẾT THÚC CSS TINH CHỈNH -----
                      }
                    });

                    if (cssRules) {
                      const styleEl = doc.createElement('style');
                      styleEl.id = 'wmo-symbols-style';
                      styleEl.innerHTML = cssRules;
                      doc.head.appendChild(styleEl);
                    }
                  }).catch(err => console.error("Lỗi nghiêm trọng khi xử lý SVG để tạo CSS:", err));

                // Cấu hình MathJax không cần thay đổi, vì macro `wmosymbol` chỉ đơn giản
                // là nhận một chuỗi và dùng nó để tạo tên class.
                const config = doc.createElement('script');
                config.type = 'text/javascript';
                config.innerHTML = `
                  window.MathJax = {
                    tex: {
                      inlineMath: [['\\\\(', '\\\\)']], 
                      displayMath: [['\\\\[', '\\\\]']],
                      processEscapes: true,
                      macros: {
                        wmosymbol: ['\\\\class{wmo-symbol wmo-symbol-#1}{\\\\phantom{W}}', 1]
                      }
                    },
                    svg: { fontCache: 'global' },
                    startup: { typeset: true }
                  };
                `;

                const script = doc.createElement('script');
                script.id = 'mathjax-script';
                script.type = 'text/javascript';
                script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
                script.async = true;

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