// file: MathInput.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef } from 'react';
import 'mathlive';

// Kiểu toàn cục MathfieldElement đã được 'mathlive' cung cấp
// Bạn có thể cần khai báo `declare class MathfieldElement ...` nếu TS báo lỗi
// Nhưng hãy thử không có nó trước.

interface MathInputProps {
  initialValue?: string;
  onValueChange: (value: string) => void;
}


const MathInput: React.FC<MathInputProps> = ({ initialValue = '', onValueChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathFieldRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    // Chỉ chạy một lần duy nhất
    if (mathFieldRef.current || !containerRef.current) return;

    if ((window as any).MathfieldElement) {
      (window as any).MathfieldElement.soundsDirectory = null;
    }

    const mathField = new (window as any).MathfieldElement() as MathfieldElement;

    // Định nghĩa macro tùy chỉnh cho MathLive
    // Macro này sẽ dạy MathLive cách "hiểu" lệnh \wmosymbol
    // Nó sẽ biến \wmosymbol{ID} thành một thẻ span có class đặc biệt và một ký tự giữ chỗ.
     (mathField as any).customMacros = {
      ...((mathField as any).customMacros || {}),
      wmosymbol: `\\class{wmo-symbol wmo-symbol-#1}{\\phantom{W}}`,
    };

    const setupCustomKeyboardWithPagination = async () => {
      try {
        const res = await fetch('/symbols.svg');
        if (!res.ok) throw new Error('Không thể tải symbols.svg');
        
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const symbols = Array.from(doc.querySelectorAll('symbol'));

        // Chuyển đổi tất cả symbols thành các nút bấm
        const allSvgButtons = symbols.map(symbol => {
          const originalSymbolId = symbol.id
          if (!originalSymbolId) return null

          // ----- THAY ĐỔI QUAN TRỌNG -----
          // Thay thế dấu '_' bằng '-' để tránh lỗi phân tích của LaTeX/MathLive.
          const safeSymbolId = originalSymbolId.replace(/_/g, '-');
          // ----- KẾT THÚC THAY ĐỔI -----

          return {
            label: `<svg viewBox="${symbol.getAttribute('viewBox') ?? '0 0 24 24'}" style="width: 24px; height: 24px;">${symbol.innerHTML}</svg>`,
            
            // Sử dụng ID an toàn để tạo lệnh insert
            insert: `\\wmosymbol{${safeSymbolId}} `,
            
            id: originalSymbolId, // Giữ id gốc cho mục đích khác nếu cần
          };
        }).filter(Boolean);
        
        const vk = (window as any).mathVirtualKeyboard;
        if (!vk) return;
        
        const BUTTONS_PER_PAGE = 24; // Mỗi tab có tối đa 24 biểu tượng
        const totalPages = Math.ceil(allSvgButtons.length / BUTTONS_PER_PAGE);
        const newLayouts = [];

        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * BUTTONS_PER_PAGE;
          const endIndex = startIndex + BUTTONS_PER_PAGE;
          const pageButtons = allSvgButtons.slice(startIndex, endIndex);

          const rows = [];
          const BUTTONS_PER_ROW = 6;
          for (let i = 0; i < pageButtons.length; i += BUTTONS_PER_ROW) {
            rows.push(pageButtons.slice(i, i + BUTTONS_PER_ROW));
          }

          newLayouts.push({
            label: `Biểu tượng ${page + 1}`,
            id: `svg-symbols-page-${page + 1}`,
            rows: rows,
          });
        }
        
        vk.layouts = [
          ...vk.layouts,
          ...newLayouts
        ];

      } catch (error) {
        console.error("Lỗi khi tùy chỉnh bàn phím với SVG:", error);
      }
    };

    setupCustomKeyboardWithPagination();

    mathField.style.width = '100%';
    mathField.style.minHeight = '200px';
    (mathField as any).defaultMode = 'math';
    (mathField as any).virtualKeyboardMode = 'manual';
    
    mathField.addEventListener('input', () => onValueChange(mathField.value));
    mathField.value = initialValue;
    onValueChange(initialValue);
    
    containerRef.current.appendChild(mathField);
    mathFieldRef.current = mathField;

    setTimeout(() => {
      mathField.focus();
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.visible = true;
      }
    }, 150);

    return () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.remove();
        mathFieldRef.current = null;
      }
    };
  }, [initialValue, onValueChange]);

  return <div ref={containerRef} />;
};

export default MathInput;