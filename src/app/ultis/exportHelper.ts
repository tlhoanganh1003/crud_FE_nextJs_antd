// src/app/ultis/exportHelper.ts

import { saveAs } from 'file-saver';
import { message } from 'antd';

// Kiểu dữ liệu
interface ContentItem {
    id: number;
    content: string;
    soThuTu: number;
}

/**
 * Tạo và tải về một file .doc từ nội dung HTML.
 * @param contents Mảng các mục nội dung.
 * @param documentTitle Tiêu đề chung của tài liệu.
 * @param fileName Tên file để lưu (không bao gồm .doc).
 */
export const exportToHtmlDoc = (contents: ContentItem[], documentTitle: string, fileName: string) => {
    if (typeof window === 'undefined') {
        return;
    }

    if (!contents || contents.length === 0) {
        message.error("Không có nội dung để xuất.");
        return;
    }

    // 1. Sắp xếp và gộp HTML
    const sortedContents = [...contents].sort((a, b) => a.soThuTu - b.soThuTu);
    
    // 2. Tạo một chuỗi HTML lớn, với các tiền tố đặc biệt cho Word
    const fullHtmlString = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${documentTitle}</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>90</w:Zoom>
                </w:WordDocument>
            </xml>
            <![endif]-->
            <style>
                /* Định dạng cơ bản cho Word */
                body {
                    font-family: 'Times New Roman', Times, serif;
                }
                .page-break {
                    page-break-before: always;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                }
                td, th {
                    border: 1px solid black;
                    padding: 8px;
                }
            </style>
        </head>
        <body>
            <h1>${documentTitle}</h1>
            ${sortedContents.map((item, index) => `
                <div class="${index > 0 ? 'page-break' : ''}">
                    <h2>Nội dung số ${item.soThuTu}</h2>
                    <div>
                        ${item.content}
                    </div>
                </div>
            `).join('')}
        </body>
        </html>
    `;

    // 3. Tạo một Blob từ chuỗi HTML
    // MIME type 'application/msword' là chìa khóa ở đây
    const blob = new Blob(['\ufeff', fullHtmlString], {
        type: 'application/msword;charset=utf-8'
    });
    
    // 4. Dùng file-saver để tải về file .doc
    saveAs(blob, `${fileName}.doc`);
};