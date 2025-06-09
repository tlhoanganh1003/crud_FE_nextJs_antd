// types/mathlive.d.ts

import 'mathlive';
import type {
  MathfieldElement,
  MathfieldOptions as OriginalMathfieldOptions,
  VirtualKeyboardInterface,
  VirtualKeyboardLayout,
  VirtualKeyboardLayer,
} from 'mathlive';

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
