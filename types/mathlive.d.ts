// types/mathlive.d.ts

import 'mathlive';
import 'react';
import type {
  MathfieldElement,
  MathfieldOptions as OriginalMathfieldOptions,
  VirtualKeyboardInterface,
  VirtualKeyboardLayout,
  VirtualKeyboardLayer,
} from 'mathlive';
import type { MathfieldElementAttributes as OriginalMathfieldElementAttributes } from 'mathlive';

declare module 'mathlive' {
  interface MathfieldOptions extends OriginalMathfieldOptions {
    virtualKeyboardMode?: 'manual' | 'onfocus' | 'off' | 'auto';
    virtualKeyboardLayout?: string;
    virtualKeyboardToolbar?: 'none' | 'all';

    customVirtualKeyboardLayers?: Record<string, VirtualKeyboardLayer>;
    customVirtualKeyboardLayouts?: Record<string, VirtualKeyboardLayout>;

    keypressSound?: string;
    plonkSound?: string;
    soundsDirectory?: string;
  }

  interface VirtualKeyboardInterface {
    visible?: boolean;
    keyboardLayer?: string;
    layers?: Record<string, VirtualKeyboardLayer>;
    layouts?: Record<string, VirtualKeyboardLayout>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> &
        Partial<OriginalMathfieldOptions> & {
          ref?: React.Ref<MathfieldElement>;
          class?: string;
        },
        MathfieldElement
      >;
    }
  }

  interface Window {
    mathVirtualKeyboard?: VirtualKeyboardInterface;
  }
}


type OptionalMathfieldElementAttributes = Partial<OriginalMathfieldElementAttributes> & 
                                          React.ClassAttributes<HTMLElement> & 
                                          React.HTMLAttributes<HTMLElement>;

// Sử dụng cú pháp module ES2015 để mở rộng (augment) module 'react'
declare module 'react' {
  namespace JSX {
    // Thêm 'math-field' vào danh sách các element mà JSX hiểu,
    // nhưng sử dụng kiểu "nới lỏng" của chúng ta.
    interface IntrinsicElements {
      'math-field': OptionalMathfieldElementAttributes;
    }
  }
}
