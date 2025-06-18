import 'mathlive'; // Import để có MathfieldElement
import type { MathfieldElement, MathfieldOptions } from 'mathlive';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> &
        Partial<MathfieldOptions> & { // Thêm các options của MathLive
          ref?: React.Ref<MathfieldElement>;
          class?: string; // Cho phép dùng class với Tailwind
          // Thêm các thuộc tính HTML chuẩn nếu cần
        },
        MathfieldElement
      >;
    }
  }
}

declare class MathfieldElement extends HTMLElement {
  value: string;
  defaultMode: 'math' | 'text';
  virtualKeyboardMode: 'manual' | 'onfocus' | 'off';
  showVirtualKeyboard(): void;
  // Thêm các thuộc tính khác ở đây nếu cần trong tương lai
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  MathfieldElement: typeof MathfieldElement;
  mathVirtualKeyboard?: {
    visible: boolean;
  };
  activeMathField?: MathfieldElement;
  currentLatexValue?: string;
  reactMathRoot?: { unmount: () => void };
}

// Đảm bảo file này được coi là một module
export {};