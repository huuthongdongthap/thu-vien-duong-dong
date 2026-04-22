// Script cào dữ liệu 100% từ thư viện Dương Đông
// Cách dùng: Mở DevTools (F12) trên trang web thư viện (đã đăng nhập), dán toàn bộ script này vào tab Console và nhấn Enter.
// Script sẽ tự động lướt qua các trang để lấy Dữ liệu và tải xuống 1 file 'thuvien_data_full.json'.

(async function extractAllBooks() {
    console.log("🚀 Bắt đầu cào 100% dữ liệu sách...");
    let allBooks = [];
    let page = 1;
    let hasMore = true;

    // Lặp qua các trang tìm kiếm (giả sử pagination dùng query param 'page' hoặc tương tự, 
    // cần điều chỉnh params theo thực tế của OpenBiblio)
    while (hasMore) {
        console.log(`Đang tải trang ${page}...`);
        try {
            // Fetch URL tìm kiếm (Biblio search) - lấy toàn bộ
            let res = await fetch(`https://tvthptduongdong.vsl.vn/lms/shared/biblio_search.php?page=${page}`);
            let text = await res.text();
            
            // Phân tích HTML HTML
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            
            // Tìm các dòng chứa sách (cấu trúc của OpenBiblio thường là các thẻ <tr> hoặc <table>)
            let rows = doc.querySelectorAll('table.primary tr'); // CSS selector này cần check lại trên thực tế trang web
            
            if (rows.length <= 1 && page > 1) { // Không còn dữ liệu mới
                hasMore = false;
                break;
            }

            rows.forEach((row, index) => {
                // Bỏ qua header
                if (index === 0 && row.querySelector('th')) return; 
                
                let cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    allBooks.push({
                        title: cells[1]?.innerText?.trim() || '',
                        author: cells[2]?.innerText?.trim() || '',
                        // Các field khác tuỳ theo cột hiển thị trên web
                    });
                }
            });

            // Kiểm tra xem có nút "Next" hay không
            let nextBtn = doc.querySelector('a:contains("Tiếp")') || doc.querySelector('a.nextUrl'); 
            if (!nextBtn) {
                hasMore = false;
            } else {
                page++;
            }
            
            // Delay tránh bị block
            await new Promise(r => setTimeout(r, 500));
            
        } catch (e) {
            console.error("Lỗi khi tải trang:", e);
            hasMore = false;
        }
    }

    console.log(`✅ Hoàn thành! Thu thập được ${allBooks.length} tài liệu.`);
    
    // Tải xuống file JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allBooks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "thuvien_data_full.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
})();
