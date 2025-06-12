// src/app/ultis/exportHelper.ts
import { message } from 'antd';

// Kiểu dữ liệu
interface ContentItem {
    id: number;
    content: string;
    soThuTu: number;
}

/**
 * Mở hộp thoại in của trình duyệt với nội dung được tạo động từ HTML.
 * @param contents Mảng các mục nội dung.
 * @param documentTitle Tiêu đề chung của tài liệu.
 */
export const printHtmlContent = (contents: ContentItem[], documentTitle: string) => {
    // Đảm bảo code chỉ chạy trên trình duyệt
    if (typeof window === 'undefined') {
        return;
    }

    if (!contents || contents.length === 0) {
        message.error("Không có nội dung để in.");
        return;
    }

    // 1. Gộp HTML từ các nguồn lại thành một chuỗi lớn
    const sortedContents = [...contents].sort((a, b) => a.soThuTu - b.soThuTu);
    const printHtml = `
        <html>
        <head>
            <title>${documentTitle}</title>
            <style>
                /* Thêm các style cho trang in ở đây */
                body {
                    font-family: 'Times New Roman', Times, serif;
                    margin: 2cm;
                }
                h1, h2 {
                    text-align: center;
                }
                hr {
                    page-break-after: always;
                    border: 0;
                }
                img, svg {
                    max-width: 100%; /* Đảm bảo ảnh không bị tràn lề */
                    height: auto;
                }
            </style>
        </head>
        <body>
            <h1>${documentTitle}</h1>
            ${sortedContents.map(item => `
                <hr />
                <h2>Nội dung số ${item.soThuTu}</h2>
                <div>
                    ${item.content}
                </div>
            `).join('')}
        </body>
        </html>
    `;

    // 2. Mở một cửa sổ mới để in
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        message.error("Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt chặn pop-up của trình duyệt.");
        return;
    }
    
    // 3. Ghi nội dung HTML vào cửa sổ mới và gọi in
    printWindow.document.write(printHtml);
    printWindow.document.close(); // Quan trọng: cần có để đảm bảo trang tải xong
    printWindow.focus(); // Cần thiết cho một số trình duyệt như Firefox
    
    // Đợi một chút để đảm bảo nội dung render xong trước khi in
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};