/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef } from 'react';
import 'mathlive';
import { MathfieldElement } from 'mathlive';

interface MathInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const MathInput: React.FC<MathInputProps> = ({ value = '', onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathFieldRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    (window as any).MathfieldElement.soundsDirectory = null;

    const mathField = document.createElement('math-field') as MathfieldElement;

    // --- THAY ĐỔI Ở ĐÂY ---
    // Đặt chế độ mặc định là 'text' để cho phép gõ khoảng trắng
    // Chế độ 'math' (mặc định) sẽ dùng phím cách để điều hướng
    mathField.smartMode = true;

    // Bạn có thể bỏ dòng setAttribute này vì đã có defaultMode
    // mathField.setAttribute('math-mode', 'text'); 

    // Chỉ set manual để tự kiểm soát keyboard
    mathField.setAttribute('virtual-keyboard-mode', 'manual');
    mathField.setAttribute('virtual-keyboard-theme', 'material');
    mathField.setAttribute('virtual-keyboard-sound', 'none');

    mathField.style.width = '100%';
    containerRef.current.appendChild(mathField);
    mathFieldRef.current = mathField;

    const setupCustomKeyboard = () => {
      // ... code setup keyboard của bạn vẫn giữ nguyên ...
      const vk = (window as any).mathVirtualKeyboard;
      if (!vk) {
        console.warn('mathVirtualKeyboard không tồn tại');
        return;
      }
      
      // Layouts: sao chép hoặc khởi tạo mảng mới nếu chưa có
      const layoutsCopy = Array.isArray(vk.layouts) ? [...vk.layouts] : [];

      if (!layoutsCopy.some((l: any) => l.name === 'customSymbols')) {
        layoutsCopy.push({
          name: 'customSymbols',
          label: 'Custom',
          rows: [
            [
              // Thêm nút space vào đây nếu bạn muốn có một nút bấm riêng
              // { label: '␣', insert: ' ', class: 'small' }, 
              { label: '⋅', insert: '\\cdot', class: 'small' },
              { label: '∈', insert: '\\in', class: 'small' },
              { label: '∉', insert: '\\notin', class: 'small' },
              { label: '∀', insert: '\\forall', class: 'small' },
              { label: '∃', insert: '\\exists', class: 'small' },
              { label: '∅', insert: '\\emptyset', class: 'small' },
            ],
            [
              { label: '⊂', insert: '\\subset', class: 'small' },
              { label: '⊃', insert: '\\supset', class: 'small' },
              { label: '⊆', insert: '\\subseteq', class: 'small' },
              { label: '⊇', 'insert': '\\supseteq', class: 'small' },
              { label: '∞', 'insert': '\\infty', class: 'small' },
            ],
            [
              { label: '≠', insert: '\\neq', class: 'small' },
              { label: '≡', insert: '\\equiv', class: 'small' },
              { label: '≈', insert: '\\approx', class: 'small' },
              { label: '≤', insert: '\\leq', class: 'small' },
              { label: '≥', insert: '\\geq', class: 'small' },
              { label: '→', insert: '\\rightarrow', class: 'small' },
            ],
            [
              { label: '←', insert: '\\leftarrow', class: 'small' },
              { label: '↔', insert: '\\leftrightarrow', class: 'small' },
              { label: '∪', insert: '\\cup', class: 'small' },
              { label: '∩', insert: '\\cap', class: 'small' },
              { label: 'ℝ', insert: '\\mathbb{R}', class: 'small' },
              { label: '∂', insert: '\\partial', class: 'small' },
            ],
          ],
        });
      }
      if (!layoutsCopy.some((l: any) => l.name === 'custom2')) {
        layoutsCopy.push({
          name: 'custom2',
          label: 'custom2',
          rows: [
            [
              { label: '∫', insert: '\\int', class: 'small' },
              { label: '∇', insert: '\\nabla', class: 'small' },
              { label: '⊕', insert: '\\oplus', class: 'small' },
              { label: '⊗', insert: '\\otimes', class: 'small' },
              { label: '⊥', insert: '\\perp', class: 'small' },
              { label: '⊤', insert: '\\top', class: 'small' },
            ],
          ],
        });
      }

      vk.layouts = layoutsCopy;

      // Tabs: kiểm tra và khởi tạo mảng rỗng nếu không phải mảng
      const tabsCopy = Array.isArray(vk.tabs) ? [...vk.tabs] : [];

      if (!tabsCopy.includes('customSymbols')) {
        tabsCopy.push('customSymbols');
      }
      vk.tabs = tabsCopy;

      vk.visible = true;
    };

    mathField.addEventListener('focus', () => {
      setupCustomKeyboard();
      (mathField as any).showVirtualKeyboard();
    });

    mathField.addEventListener('input', () => {
      const latex = mathField.getValue();
      onChange?.(latex);
    });

    if (value) {
      mathField.setValue(value);
    }
  }, []);

  useEffect(() => {
    if (mathFieldRef.current && value !== mathFieldRef.current.getValue()) {
      mathFieldRef.current.setValue(value ?? '');
    }
  }, [value]);

  return <div ref={containerRef} />;
};

export default MathInput;