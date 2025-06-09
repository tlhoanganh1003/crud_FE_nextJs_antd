// types/mathlive.d.ts
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

// Đảm bảo file này được coi là một module
export {};