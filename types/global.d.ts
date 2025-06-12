declare module 'html-docx-js' {
  interface Options {
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
      header?: number;
      footer?: number;
      gutter?: number;
    };
  }
  function asBlob(html: string, options?: Options): Blob;
}