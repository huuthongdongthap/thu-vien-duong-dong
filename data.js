// ===== DỮ LIỆU THƯ VIỆN THPT DƯƠNG ĐÔNG =====
// Nguồn: https://tvthptduongdong.vsl.vn/lms/opac/ddc.php (trích xuất 22/04/2026)
// Tất cả dữ liệu dưới đây được lấy trực tiếp từ trang OPAC công khai của thư viện.

const LIBRARY_URL = "https://tvthptduongdong.vsl.vn/lms";

// Hàm tạo link tra cứu trực tiếp trên web thư viện
function searchLink(tag, words) {
  return `${LIBRARY_URL}/shared/biblio_search.php?tag=${tag}&tab=opac&words=${encodeURIComponent(words)}`;
}
function viewTmLink(tmts) {
  return `${LIBRARY_URL}/opac/viewtm.php?tm=ts&tab=opac&tmts=${encodeURIComponent(tmts)}`;
}

const LIBRARY_DATA = {

  // ===== BỘ SƯU TẬP (Collections) — từ /admin/collections_list.php =====
  collections: [
    { code:'TK', name:'Sách Tham Khảo', count:1574, loan:30, icon:'📘', color:'#3a6a5b', desc:'Sách tham khảo các môn, bài tập nâng cao' },
    { code:'GK', name:'Sách Giáo Khoa', count:518, loan:30, icon:'📗', color:'#2e7d32', desc:'SGK chính quy lớp 10–12, chương trình mới 2018' },
    { code:'LIBROS', name:'Sách Mượn (LIBROS)', count:164, loan:14, icon:'📙', color:'#e65100', desc:'Sách cho mượn ngắn hạn 14 ngày' },
    { code:'NV', name:'Sách Nghiệp Vụ', count:106, loan:255, icon:'📕', color:'#6a1b9a', desc:'Tài liệu nghiệp vụ dành cho giáo viên' },
    { code:'BT', name:'Báo & Tạp Chí', count:29, loan:30, icon:'📰', color:'#c62828', desc:'Báo thiếu nhi, tạp chí giáo dục' },
    { code:'TIENGANH', name:'Sách Tiếng Anh', count:9, loan:14, icon:'🇬🇧', color:'#00838f', desc:'Tài liệu học tiếng Anh, sách song ngữ' },
  ],

  // ===== TỦ SÁCH (Thư mục chuyên đề) — từ OPAC DDC page chunk 0–4 =====
  // Đây là danh sách TỦ SÁCH thực tế trên hệ thống, trích từ field 440a
  tuSach: [
    // --- Chuyên đề ---
    { name:'Tủ sách biển đảo', category:'Chuyên đề' },
    { name:'Tủ sách văn học Việt Nam', category:'Chuyên đề' },
    { name:'Tủ sách văn học nước ngoài', category:'Chuyên đề' },
    { name:'Văn học nước ngoài', category:'Chuyên đề' },
    { name:'Nhà giáo Việt Nam', category:'Chuyên đề' },
    { name:'Sáng kiến kinh nghiệm', category:'Nghiệp vụ' },
    { name:'Văn học', category:'Chuyên đề' },
    { name:'Sách tham khảo', category:'Tham khảo' },
    { name:'Mĩ thuật', category:'Nghệ thuật' },
    { name:'Sách Giáo Khoa', category:'SGK' },
    { name:'Sách Giáo viên', category:'SGK' },
    { name:'Sách Giáo Khoa Lớp 10', category:'SGK' },

    // --- Ngữ văn ---
    { name:'Ngữ văn 10', category:'SGK Lớp 10' },
    { name:'Chuyên đề học tập Ngữ văn 10', category:'Chuyên đề lớp 10' },
    { name:'Bài tập ngữ văn 10', category:'Bài tập lớp 10' },
    { name:'Ngữ văn 11', category:'SGK Lớp 11' },
    { name:'Chuyên đề học tập Ngữ văn 11', category:'Chuyên đề lớp 11' },
    { name:'Ngữ văn 12', category:'SGK Lớp 12' },
    { name:'Chuyên đề học tập ngữ văn 12', category:'Chuyên đề lớp 12' },
    { name:'Ngữ văn', category:'Môn học' },

    // --- Toán ---
    { name:'Toán 10', category:'SGK Lớp 10' },
    { name:'Bài tập Toán 10', category:'Bài tập lớp 10' },
    { name:'Chuyên đề học tập Toán 10', category:'Chuyên đề lớp 10' },
    { name:'Toán 12', category:'SGK Lớp 12' },
    { name:'Chuyên đề học tập Toán 12', category:'Chuyên đề lớp 12' },
    { name:'Môn Toán', category:'Môn học' },

    // --- Vật lí ---
    { name:'Vật lí 10', category:'SGK Lớp 10' },
    { name:'Bài tập vật lí 10', category:'Bài tập lớp 10' },
    { name:'Chuyên đề học tập Vật lí 10', category:'Chuyên đề lớp 10' },
    { name:'Vật lí 11', category:'SGK Lớp 11' },
    { name:'Bài tập vật lí 11', category:'Bài tập lớp 11' },
    { name:'Vật lí 12', category:'SGK Lớp 12' },
    { name:'Vật lí', category:'Môn học' },

    // --- Hoá học ---
    { name:'Hoá học 10', category:'SGK Lớp 10' },
    { name:'Hoá học 11', category:'SGK Lớp 11' },
    { name:'Chuyên đề học tập hoá học 11', category:'Chuyên đề lớp 11' },
    { name:'Chuyên đề học tập Hoá học 12', category:'Chuyên đề lớp 12' },
    { name:'Hoá học', category:'Môn học' },
    { name:'Môn hoá', category:'Môn học' },

    // --- Sinh học ---
    { name:'Sinh học 10', category:'SGK Lớp 10' },
    { name:'Bài tập sinh học 10', category:'Bài tập lớp 10' },
    { name:'Chuyên đề học tập Sinh học 10', category:'Chuyên đề lớp 10' },
    { name:'Sinh học 11', category:'SGK Lớp 11' },
    { name:'Chuyên đề học tập Sinh học 11', category:'Chuyên đề lớp 11' },
    { name:'Sinh học 12', category:'SGK Lớp 12' },
    { name:'Chuyên đề học tập Sinh học 12', category:'Chuyên đề lớp 12' },
    { name:'Sinh học', category:'Môn học' },

    // --- Lịch sử ---
    { name:'Lịch sử 10', category:'SGK Lớp 10' },
    { name:'Bài tập Lịch sử 10', category:'Bài tập lớp 10' },
    { name:'Chuyên đề học tập Lịch sử 10', category:'Chuyên đề lớp 10' },
    { name:'Bài tập Lịch sử 11', category:'Bài tập lớp 11' },
    { name:'Chuyên đề học tập lịch sử 11', category:'Chuyên đề lớp 11' },
    { name:'Lịch sử 12', category:'SGK Lớp 12' },
    { name:'Chuyên đề học tập lịch sử 12', category:'Chuyên đề lớp 12' },
    { name:'Lịch sử', category:'Môn học' },

    // --- Địa lí ---
    { name:'Địa lí 10', category:'SGK Lớp 10' },
    { name:'Bài tập địa lí 10', category:'Bài tập lớp 10' },
    { name:'Chuyên Đề Học Tập Địa lí 10', category:'Chuyên đề lớp 10' },
    { name:'Địa lí 12', category:'SGK Lớp 12' },
    { name:'Chuyên đề học tập Địa lí 12', category:'Chuyên đề lớp 12' },
    { name:'Atlat địa lí Việt Nam', category:'Công cụ' },
    { name:'Địa lí', category:'Môn học' },

    // --- Tin học ---
    { name:'Tin học 10', category:'SGK Lớp 10' },
    { name:'Bài tập Tin học 10', category:'Bài tập lớp 10' },
    { name:'Tin học 11 - Định hướng khoa học máy tính', category:'SGK Lớp 11' },
    { name:'Tin học 11 - Định hướng tin học ứng dụng', category:'SGK Lớp 11' },
    { name:'Tin học khoa học máy tính 11', category:'SGK Lớp 11' },
    { name:'Chuyên đề học tập tin học 11', category:'Chuyên đề lớp 11' },

    // --- Công nghệ ---
    { name:'Công nghệ trồng trọt', category:'Công nghệ' },
    { name:'Chuyên đề học tập Công nghệ 11', category:'Chuyên đề lớp 11' },
    { name:'Công nghệ 12', category:'SGK Lớp 12' },
    { name:'Công nghệ', category:'Môn học' },

    // --- GDKT&PL ---
    { name:'Giáo dục Kinh tế và Pháp luật 10', category:'SGK Lớp 10' },
    { name:'Giáo dục kinh tế và pháp luật 11', category:'SGK Lớp 11' },
    { name:'Giáo dục Kinh tế và Pháp luật 12', category:'SGK Lớp 12' },
    { name:'Pháp luật', category:'Môn học' },

    // --- Giáo dục thể chất ---
    { name:'Giáo dục thể chất 10', category:'SGK Lớp 10' },
    { name:'Giáo dục thể chất 11', category:'SGK Lớp 11' },
    { name:'Giáo dục thể chất - Bóng đá 11', category:'Thể chất lớp 11' },
    { name:'Giáo dục thể chất - Cầu lông 11', category:'Thể chất lớp 11' },
    { name:'Giáo dục thể chất - Bóng rổ 11', category:'Thể chất lớp 11' },

    // --- Khác ---
    { name:'Hoạt động trải nghiệm, hướng nghiệp 10', category:'SGK Lớp 10' },
    { name:'Nguyễn Phú Trọng', category:'Chính trị' },
    { name:'Sách tặng', category:'Khác' },
    { name:'Tâm lý học', category:'Chuyên đề' },
    { name:'Hướng nghiệp', category:'Chuyên đề' },
    { name:'Thiết kế dạy học', category:'Nghiệp vụ' },
    { name:'Âm nhạc', category:'Nghệ thuật' },
    { name:'Tiếng anh', category:'Ngoại ngữ' },
    { name:'Kỹ năng sống', category:'Chuyên đề' },
    { name:'Nuôi dạy trẻ em', category:'Chuyên đề' },
    { name:'Sách nghiệp vụ', category:'Nghiệp vụ' },
    { name:'Từ điển', category:'Công cụ' },
    { name:'Truyện ngắn', category:'Văn học' },
    { name:'Chuyện kể', category:'Văn học' },
    { name:'Tiểu thuyết', category:'Văn học' },
    { name:'Truyện tranh', category:'Văn học' },
    { name:'Khoa học thường thức', category:'Khoa học' },
    { name:'Văn học Việt Nam', category:'Văn học' },
    { name:'Kỹ năng ứng xử', category:'Kỹ năng' },
    { name:'Thơ ca', category:'Văn học' },
    { name:'Đố vui', category:'Giải trí' },
    { name:'Tiểu sử', category:'Lịch sử' },
    { name:'Việt Nam', category:'Đất nước' },
    { name:'Tục ngữ Việt Nam', category:'Văn hoá' },
    { name:'Truyện dài', category:'Văn học' },
    { name:'Địa phương kiên giang', category:'Địa phương' },
    { name:'Danh nhân thế giới', category:'Lịch sử' },
    { name:'khoa hoc công nghệ', category:'Khoa học' },
  ],

  // ===== PHÂN LOẠI DDC (Dewey Decimal) — từ OPAC DDC page chunk 6–24 =====
  ddc: [
    { num:'000', name:'Tổng quát', nameVi:'Tin học, thông tin & tác phẩm tổng quát' },
    { num:'100', name:'Triết học & Tâm lý', nameVi:'Triết học, tâm lý học, đạo đức' },
    { num:'200', name:'Tôn giáo', nameVi:'Tôn giáo, tín ngưỡng' },
    { num:'300', name:'Khoa học Xã hội', nameVi:'KHXH, luật, giáo dục, kinh tế',
      subs: [
        { num:'340', name:'Luật', subs: [
          { num:'341', name:'Luật quốc tế' },
          { num:'342', name:'Luật Hiến pháp và Hành chính' },
          { num:'343', name:'Luật Kinh tế, Tài chính, Thuế' },
          { num:'344', name:'Luật Xã hội', subs: [
            '344.01 Luật Lao động','344.02 Luật BHXH',
            '344.03 Luật Phúc lợi xã hội','344.0327 Luật Trẻ em',
            '344.07 Luật Giáo dục','344.09 Luật Văn hoá & Tôn giáo',
            '344.092 Luật Lưu trữ, thông tin và thư viện',
            '344.093 Luật Bảo tàng và di sản vật thể',
            '344.094 Luật Văn hóa và Di sản phi vật thể',
            '344.096 Luật Tôn giáo, tự do tín ngưỡng',
            '344.097 Luật Nghệ thuật, biểu diễn, nhiếp ảnh',
            '344.099 Luật Thể thao'
          ]},
          { num:'345', name:'Luật hình sự' },
          { num:'346', name:'Luật dân sự', subs: [
            '346.01 Luật Hôn nhân và gia đình',
            '346.02 Luật hợp đồng',
            '346.04 Luật tài sản, sở hữu trí tuệ',
            '346.043 Luật Bất động sản',
            '346.05 Luật công chứng',
            '346.06 Luật Doanh nghiệp',
            '346.07 Luật Kinh doanh và thương mại',
            '346.08 Luật Ngân hàng và Bảo hiểm'
          ]},
        ]},
        { num:'370', name:'Giáo dục', subs:[
          { num:'372', name:'Giáo dục tiểu học' },
          { num:'372.3', name:'Kiến thức, máy tính, công nghệ' }
        ]},
      ]
    },
    { num:'400', name:'Ngôn ngữ', nameVi:'Ngôn ngữ học, từ điển' },
    { num:'500', name:'Khoa học Tự nhiên', nameVi:'Toán, Lý, Hóa, Sinh, Địa lý tự nhiên' },
    { num:'600', name:'Công nghệ', nameVi:'Y học, kỹ thuật, nông nghiệp' },
    { num:'700', name:'Nghệ thuật', nameVi:'Nghệ thuật, âm nhạc, thể thao, giải trí' },
    { num:'800', name:'Văn học', nameVi:'Văn học Việt Nam & thế giới' },
    { num:'900', name:'Lịch sử & Địa lý', nameVi:'Lịch sử, địa lý, tiểu sử' },
  ],
};
