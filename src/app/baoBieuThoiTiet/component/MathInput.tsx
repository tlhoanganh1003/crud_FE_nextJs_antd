/* eslint-disable @typescript-eslint/no-explicit-any */
// file: MathInput.tsx (PHIÊN BẢN TỐI GIẢN - KHÔNG JSX)

'use client';

import React, { useEffect, useRef } from 'react';
import 'mathlive';

// Kiểu toàn cục MathfieldElement đã được 'mathlive' cung cấp, chúng ta không cần khai báo lại

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
    // Sử dụng kiểu toàn cục MathfieldElement
    const mathField = new (window as any).MathfieldElement() as MathfieldElement;

    // Cấu hình
    mathField.style.width = '100%';
    mathField.style.minHeight = '100px';
    mathField.style.border = '1px solid #ccc';
    mathField.style.padding = '8px';
    mathField.style.fontSize = '1.2em';
    
    // Ép kiểu 'any' để thiết lập các thuộc tính mà TypeScript không nhận ra
    (mathField as any).defaultMode = 'text';
    (mathField as any).virtualKeyboardMode = 'manual';
    
    // Gắn listener
    mathField.addEventListener('input', () => onValueChange(mathField.value));

    // Đặt giá trị ban đầu
    mathField.value = initialValue;
    onValueChange(initialValue);
    
    // Gắn vào DOM
    containerRef.current.appendChild(mathField);
    mathFieldRef.current = mathField;

    // Tự động hiển thị và focus
    setTimeout(() => {
      mathField.focus();
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.visible = true;
      }
    }, 150);

    return () => {
      // Hàm dọn dẹp
      if (mathFieldRef.current) {
        mathFieldRef.current.remove();
        mathFieldRef.current = null;
      }
    };
  }, [initialValue, onValueChange]);

  // Trả về một div container đơn giản
  return <div ref={containerRef} />;
};

export default MathInput;