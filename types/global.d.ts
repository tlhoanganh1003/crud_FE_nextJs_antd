declare global {
  interface Window {
    MathJax: {
      typesetPromise?: () => Promise<void>;
    };
  }
  
}

declare class MathfieldElement extends HTMLElement {
  value: string;
  focus(): void;
  // Các thuộc tính khác có thể được truy cập qua (el as any) nếu cần
}

// Dạy React/JSX về thẻ <math-field>
// Đây là phần quan trọng nhất để sửa lỗi JSX
declare namespace JSX {
  interface IntrinsicElements {
    'math-field': React.DetailedHTMLProps<
      React.HTMLAttributes<MathfieldElement>,
      MathfieldElement
    > & {
      // Khai báo các thuộc tính có dấu gạch ngang dưới dạng chuỗi
      'default-mode'?: 'text' | 'math';
      'virtual-keyboard-mode'?: 'manual' | 'onfocus' | 'off';
    };
  }
}

// Dạy TypeScript về các thuộc tính chúng ta thêm vào window
// Chúng ta sẽ tránh dùng chúng càng nhiều càng tốt
declare interface Window {
    reactMathRoot?: import('react-dom/client').Root;
    mathVirtualKeyboard?: { visible: boolean };
}