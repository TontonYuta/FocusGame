export interface VocabItem {
  id: string;
  en: string;
  vi: string;
  cat: 'daily' | 'toeic' | 'academic' | 'tech';
  ipa: string;
  hint: string;
}

export const VOCABULARY_LIST: VocabItem[] = [
  // --- DAILY (26 items) ---
  { id: 'd01', en: 'Courage', vi: 'Lòng can đảm', cat: 'daily', ipa: '/ˈkɜːrɪdʒ/', hint: 'Khả năng đối mặt khó khăn' },
  { id: 'd02', en: 'Gratitude', vi: 'Lòng biết ơn', cat: 'daily', ipa: '/ˈɡrætɪtjuːd/', hint: 'Cảm kích sự giúp đỡ' },
  { id: 'd03', en: 'Resilience', vi: 'Sự kiên cường', cat: 'daily', ipa: '/rɪˈzɪliəns/', hint: 'Phục hồi nhanh sau thất bại' },
  { id: 'd04', en: 'Patience', vi: 'Sự kiên nhẫn', cat: 'daily', ipa: '/ˈpeɪʃns/', hint: 'Khả năng chờ đợi bình tĩnh' },
  { id: 'd05', en: 'Compassion', vi: 'Lòng trắc ẩn', cat: 'daily', ipa: '/kəmˈpæʃn/', hint: 'Sự đồng cảm và thương yêu' },
  { id: 'd06', en: 'Adventure', vi: 'Cuộc phiêu lưu', cat: 'daily', ipa: '/ədˈventʃər/', hint: 'Chuyến đi khám phá mạo hiểm' },
  { id: 'd07', en: 'Curiosity', vi: 'Tính tò mò', cat: 'daily', ipa: '/ˌkjʊəriˈɒsəti/', hint: 'Ham muốn tìm hiểu kiến thức' },
  { id: 'd08', en: 'Harmony', vi: 'Sự hòa hợp', cat: 'daily', ipa: '/ˈhɑːməni/', hint: 'Yên bình và đồng điệu' },
  { id: 'd09', en: 'Sincerity', vi: 'Sự chân thành', cat: 'daily', ipa: '/sɪnˈserəti/', hint: 'Thật thà, không giả dối' },
  { id: 'd10', en: 'Wisdom', vi: 'Sự thông thái', cat: 'daily', ipa: '/ˈwɪzdəm/', hint: 'Hiểu biết sâu rộng' },
  { id: 'd11', en: 'Diligence', vi: 'Sự siêng năng', cat: 'daily', ipa: '/ˈdɪlɪdʒəns/', hint: 'Làm việc chăm chỉ chu đáo' },
  { id: 'd12', en: 'Generosity', vi: 'Sự hào phóng', cat: 'daily', ipa: '/ˌdʒenəˈrɒsəti/', hint: 'Rộng lượng cho đi' },
  { id: 'd13', en: 'Inspiration', vi: 'Nguồn cảm hứng', cat: 'daily', ipa: '/ˌɪnspəˈreɪʃn/', hint: 'Thôi thúc sáng tạo mạnh mẽ' },
  { id: 'd14', en: 'Friendship', vi: 'Tình bạn bè', cat: 'daily', ipa: '/ˈfrendʃɪp/', hint: 'Gắn kết giữa tri kỷ' },
  { id: 'd15', en: 'Serenity', vi: 'Sự thanh thản', cat: 'daily', ipa: '/səˈrenəti/', hint: 'Tâm trí tĩnh lặng bình an' },
  { id: 'd16', en: 'Optimism', vi: 'Sự lạc quan', cat: 'daily', ipa: '/ˈɒptɪmɪzəm/', hint: 'Luôn nhìn về điều tốt đẹp' },
  { id: 'd17', en: 'Empathy', vi: 'Sự thấu cảm', cat: 'daily', ipa: '/ˈempəθi/', hint: 'Hiểu thấu cảm xúc người khác' },
  { id: 'd18', en: 'Integrity', vi: 'Tính chính trực', cat: 'daily', ipa: '/ɪnˈteɡrəti/', hint: 'Liêm chính, trung thực' },
  { id: 'd19', en: 'Perseverance', vi: 'Sự kiên trì', cat: 'daily', ipa: '/ˌpɜːsɪˈvɪərəns/', hint: 'Không bao giờ bỏ cuộc' },
  { id: 'd20', en: 'Courtesy', vi: 'Sự lịch sự', cat: 'daily', ipa: '/ˈkɜːtəsi/', hint: 'Nhã nhặn và tôn trọng' },
  { id: 'd21', en: 'Creativity', vi: 'Sức sáng tạo', cat: 'daily', ipa: '/ˌkriːeɪˈtɪvəti/', hint: 'Tạo ra cái mới độc đáo' },
  { id: 'd22', en: 'Discipline', vi: 'Kỷ luật tự giác', cat: 'daily', ipa: '/ˈdɪsəplɪn/', hint: 'Kiểm soát hành vi bản thân' },
  { id: 'd23', en: 'Loyalty', vi: 'Lòng trung thành', cat: 'daily', ipa: '/ˈlɔɪəlti/', hint: 'Thủy chung gắn bó' },
  { id: 'd24', en: 'Humility', vi: 'Sự khiêm tốn', cat: 'daily', ipa: '/hjuːˈmɪləti/', hint: 'Không khoe khoang tự phụ' },
  { id: 'd25', en: 'Passion', vi: 'Niềm đam mê', cat: 'daily', ipa: '/ˈpæʃn/', hint: 'Nhiệt huyết cháy bỏng' },
  { id: 'd26', en: 'Ambition', vi: 'Tham vọng vươn lên', cat: 'daily', ipa: '/æmˈbɪʃn/', hint: 'Khát khao đạt thành tựu' },

  // --- TOEIC & BUSINESS (26 items) ---
  { id: 't01', en: 'Negotiate', vi: 'Đàm phán thương lượng', cat: 'toeic', ipa: '/nɪˈɡəʊʃieɪt/', hint: 'Thảo luận đi đến hợp đồng' },
  { id: 't02', en: 'Strategy', vi: 'Chiến lược kinh doanh', cat: 'toeic', ipa: '/ˈstrætədʒi/', hint: 'Kế hoạch hành động dài hạn' },
  { id: 't03', en: 'Revenue', vi: 'Tổng doanh thu', cat: 'toeic', ipa: '/ˈrevənjuː/', hint: 'Tiền thu về từ bán hàng' },
  { id: 't04', en: 'Contract', vi: 'Hợp đồng kinh tế', cat: 'toeic', ipa: '/ˈkɒntrækt/', hint: 'Văn bản pháp lý cam kết' },
  { id: 't05', en: 'Agenda', vi: 'Chương trình nghị sự', cat: 'toeic', ipa: '/əˈdʒendə/', hint: 'Nội dung các mục cuộc họp' },
  { id: 't06', en: 'Inventory', vi: 'Hàng tồn kho', cat: 'toeic', ipa: '/ˈɪnvəntri/', hint: 'Danh sách hàng hóa lưu kho' },
  { id: 't07', en: 'Deficit', vi: 'Khoản thâm hụt', cat: 'toeic', ipa: '/ˈdefɪsɪt/', hint: 'Chi vượt quá thu' },
  { id: 't08', en: 'Mergers', vi: 'Sự sáp nhập', cat: 'toeic', ipa: '/ˈmɜːdʒərz/', hint: 'Hợp nhất hai doanh nghiệp' },
  { id: 't09', en: 'Compliance', vi: 'Sự tuân thủ quy định', cat: 'toeic', ipa: '/kəmˈplaɪəns/', hint: 'Chấp hành đúng luật lệ' },
  { id: 't10', en: 'Candidate', vi: 'Ứng viên tiềm năng', cat: 'toeic', ipa: '/ˈkændɪdət/', hint: 'Người nộp đơn phỏng vấn' },
  { id: 't11', en: 'Incentive', vi: 'Chính sách khích lệ', cat: 'toeic', ipa: '/ɪnˈsentɪv/', hint: 'Phần thưởng khuyến khích làm việc' },
  { id: 't12', en: 'Efficiency', vi: 'Hiệu suất vận hành', cat: 'toeic', ipa: '/ɪˈfɪʃnsi/', hint: 'Làm việc nhanh và ít hao phí' },
  { id: 't13', en: 'Benchmark', vi: 'Tiêu chuẩn đối sánh', cat: 'toeic', ipa: '/ˈbentʃmɑːk/', hint: 'Mốc tiêu chuẩn để so sánh' },
  { id: 't14', en: 'Expansion', vi: 'Sự mở rộng quy mô', cat: 'toeic', ipa: '/ɪkˈspænʃn/', hint: 'Tăng trưởng thị trường chi nhánh' },
  { id: 't15', en: 'Prototype', vi: 'Mẫu thử nghiệm', cat: 'toeic', ipa: '/ˈprəʊtətaɪp/', hint: 'Bản mẫu sản phẩm sơ khởi' },
  { id: 't16', en: 'Budget', vi: 'Ngân sách tài chính', cat: 'toeic', ipa: '/ˈbʌdʒɪt/', hint: 'Kế hoạch thu chi tài chính' },
  { id: 't17', en: 'Delegate', vi: 'Ủy quyền nhiệm vụ', cat: 'toeic', ipa: '/ˈdelɪɡeɪt/', hint: 'Giao phó công việc cho cấp dưới' },
  { id: 't18', en: 'Voucher', vi: 'Phiếu chứng từ ưu đãi', cat: 'toeic', ipa: '/ˈvaʊtʃər/', hint: 'Phiếu giảm giá hoặc thanh toán' },
  { id: 't19', en: 'Quorum', vi: 'Số lượng đại biểu tối thiểu', cat: 'toeic', ipa: '/ˈkwɔːrəm/', hint: 'Số người đủ để họp biểu quyết' },
  { id: 't20', en: 'Endorsement', vi: 'Sự bảo chứng công khai', cat: 'toeic', ipa: '/ɪnˈdɔːsmənt/', hint: 'Người nổi tiếng ủng hộ sản phẩm' },
  { id: 't21', en: 'Audit', vi: 'Kiểm toán tài chính', cat: 'toeic', ipa: '/ˈɔːdɪt/', hint: 'Kiểm tra sổ sách kế toán' },
  { id: 't22', en: 'Logistics', vi: 'Dịch vụ hậu cần vận tải', cat: 'toeic', ipa: '/ləˈdʒɪstɪks/', hint: 'Quản lý chuỗi cung ứng giao nhận' },
  { id: 't23', en: 'Dividend', vi: 'Tiền cổ tức chia lãi', cat: 'toeic', ipa: '/ˈdɪvɪdend/', hint: 'Lợi nhuận chia cho cổ đông' },
  { id: 't24', en: 'Policy', vi: 'Chính sách công ty', cat: 'toeic', ipa: '/ˈpɒləsi/', hint: 'Quy tắc hướng dẫn hành động' },
  { id: 't25', en: 'Warranty', vi: 'Cam kết bảo hành', cat: 'toeic', ipa: '/ˈwɒrənti/', hint: 'Bảo đảm sửa chữa khi có lỗi' },
  { id: 't26', en: 'Clause', vi: 'Điều khoản văn bản', cat: 'toeic', ipa: '/klɔːz/', hint: 'Mục thỏa thuận trong hợp đồng' },

  // --- ACADEMIC & IELTS (26 items) ---
  { id: 'a01', en: 'Hypothesis', vi: 'Giả thuyết khoa học', cat: 'academic', ipa: '/haɪˈpɒθəsɪs/', hint: 'Dự đoán ban đầu cần kiểm chứng' },
  { id: 'a02', en: 'Empirical', vi: 'Mang tính thực nghiệm', cat: 'academic', ipa: '/ɪmˈpɪrɪkl/', hint: 'Dựa trên quan sát và thực nghiệm' },
  { id: 'a03', en: 'Synthesize', vi: 'Tổng hợp phân tích', cat: 'academic', ipa: '/ˈsɪnθəsaɪz/', hint: 'Kết hợp nhiều dữ liệu thành thể thống nhất' },
  { id: 'a04', en: 'Paradigm', vi: 'Mô hình mẫu tư duy', cat: 'academic', ipa: '/ˈpærədaɪm/', hint: 'Khung nhận thức tiêu chuẩn' },
  { id: 'a05', en: 'Methodology', vi: 'Phương pháp luận', cat: 'academic', ipa: '/ˌmeθəˈdɒlədʒi/', hint: 'Hệ thống phương pháp nghiên cứu' },
  { id: 'a06', en: 'Coherent', vi: 'Mạch lạc chặt chẽ', cat: 'academic', ipa: '/kəʊˈhɪərənt/', hint: 'Logic, liên kết rõ ràng' },
  { id: 'a07', en: 'Discrepancy', vi: 'Sự khác biệt sai lệch', cat: 'academic', ipa: '/dɪˈskrepənsi/', hint: 'Bất đồng giữa các số liệu' },
  { id: 'a08', en: 'Correlation', vi: 'Mối tương quan', cat: 'academic', ipa: '/ˌkɒrəˈleɪʃn/', hint: 'Mối quan hệ biến thiên qua lại' },
  { id: 'a09', en: 'Phenomenon', vi: 'Hiện tượng quan sát', cat: 'academic', ipa: '/fəˈnɒmɪnən/', hint: 'Sự việc thực tế diễn ra' },
  { id: 'a10', en: 'Abstract', vi: 'Trừu tượng khái quát', cat: 'academic', ipa: '/ˈæbstrækt/', hint: 'Tóm lược lý thuyết không hữu hình' },
  { id: 'a11', en: 'Comprehensive', vi: 'Toàn diện bao quát', cat: 'academic', ipa: '/ˌkɒmprɪˈhensɪv/', hint: 'Đầy đủ mọi khía cạnh' },
  { id: 'a12', en: 'Qualitative', vi: 'Định tính phân tích', cat: 'academic', ipa: '/ˈkwɒlɪtətɪv/', hint: 'Đánh giá qua tính chất đặc điểm' },
  { id: 'a13', en: 'Quantitative', vi: 'Định lượng số liệu', cat: 'academic', ipa: '/ˈkwɒntɪtətɪv/', hint: 'Đo lường bằng con số cụ thể' },
  { id: 'a14', en: 'Pragmatic', vi: 'Thực dụng thực tế', cat: 'academic', ipa: '/præɡˈmætɪk/', hint: 'Chú trọng vào hiệu quả ứng dụng' },
  { id: 'a15', en: 'Implicit', vi: 'Ngấm ngầm ẩn ý', cat: 'academic', ipa: '/ɪmˈplɪsɪt/', hint: 'Hàm ý, không nói toạc ra' },
  { id: 'a16', en: 'Explicit', vi: 'Rõ ràng minh bạch', cat: 'academic', ipa: '/ɪkˈsplɪsɪt/', hint: 'Nêu thẳng thắn không úp mở' },
  { id: 'a17', en: 'Inherent', vi: 'Vốn có bẩm sinh', cat: 'academic', ipa: '/ɪnˈhɪərənt/', hint: 'Thuộc tính bản chất sẵn có' },
  { id: 'a18', en: 'Ambiguous', vi: 'Mơ hồ đa nghĩa', cat: 'academic', ipa: '/æmˈbɪɡjuəs/', hint: 'Có thể hiểu theo nhiều cách' },
  { id: 'a19', en: 'Concurrence', vi: 'Sự đồng thuận tán thành', cat: 'academic', ipa: '/kənˈkʌrəns/', hint: 'Các bên cùng nhất trí' },
  { id: 'a20', en: 'Cognitive', vi: 'Thuộc về nhận thức', cat: 'academic', ipa: '/ˈkɒɡnətɪv/', hint: 'Liên quan đến hoạt động não bộ' },
  { id: 'a21', en: 'Bias', vi: 'Định kiến thiên vị', cat: 'academic', ipa: '/ˈbaɪəs/', hint: 'Xu hướng thiên lệch một chiều' },
  { id: 'a22', en: 'Viable', vi: 'Khả thi có thể làm', cat: 'academic', ipa: '/ˈvaɪəbl/', hint: 'Có khả năng thành công trong thực tế' },
  { id: 'a23', en: 'Validate', vi: 'Xác thực kiểm chứng', cat: 'academic', ipa: '/ˈvælɪdeɪt/', hint: 'Chứng minh tính đúng đắn' },
  { id: 'a24', en: 'Extrapolate', vi: 'Ngoại suy dữ liệu', cat: 'academic', ipa: '/ɪkˈstræpəleɪt/', hint: 'Dự đoán tương lai từ xu hướng cũ' },
  { id: 'a25', en: 'Arbitrary', vi: 'Tùy tiện ngẫu hứng', cat: 'academic', ipa: '/ˈɑːbɪtrəri/', hint: 'Không dựa trên nguyên tắc nào' },
  { id: 'a26', en: 'Premise', vi: 'Tiền đề lập luận', cat: 'academic', ipa: '/ˈpremɪs/', hint: 'Cơ sở nền tảng để suy luận' },

  // --- TECH & ENGINEERING (26 items) ---
  { id: 'k01', en: 'Algorithm', vi: 'Thuật toán xử lý', cat: 'tech', ipa: '/ˈælɡərɪðəm/', hint: 'Quy trình từng bước giải quyết vấn đề' },
  { id: 'k02', en: 'Architecture', vi: 'Kiến trúc hệ thống', cat: 'tech', ipa: '/ˈɑːkɪtektʃər/', hint: 'Cấu trúc tổng thể phần mềm phần cứng' },
  { id: 'k03', en: 'Bandwidth', vi: 'Băng thông truyền dẫn', cat: 'tech', ipa: '/ˈbændwɪdθ/', hint: 'Lượng dữ liệu truyền trên giây' },
  { id: 'k04', en: 'Compiler', vi: 'Trình biên dịch mã', cat: 'tech', ipa: '/kəmˈpaɪlər/', hint: 'Dịch mã nguồn sang mã máy' },
  { id: 'k05', en: 'Cryptography', vi: 'Mật mã học bảo mật', cat: 'tech', ipa: '/krɪpˈtɒɡrəfi/', hint: 'Khoa học bảo vệ dữ liệu bí mật' },
  { id: 'k06', en: 'Database', vi: 'Cơ sở dữ liệu tập trung', cat: 'tech', ipa: '/ˈdeɪtəbeɪs/', hint: 'Nơi lưu trữ và truy vấn dữ liệu' },
  { id: 'k07', en: 'Encryption', vi: 'Mã hóa thông tin', cat: 'tech', ipa: '/ɪnˈkrɪpʃn/', hint: 'Biến đổi dữ liệu tránh đọc trộm' },
  { id: 'k08', en: 'Framework', vi: 'Khung lập trình dựng sẵn', cat: 'tech', ipa: '/ˈfreɪmwɜːk/', hint: 'Nền tảng phát triển ứng dụng' },
  { id: 'k09', en: 'Hardware', vi: 'Phần cứng máy tính', cat: 'tech', ipa: '/ˈhɑːdweər/', hint: 'Linh kiện vật lý mạch điện' },
  { id: 'k10', en: 'Interface', vi: 'Giao diện tương tác', cat: 'tech', ipa: '/ˈɪntəfeɪs/', hint: 'Điểm kết nối giữa các thành phần' },
  { id: 'k11', en: 'Latency', vi: 'Độ trễ tín hiệu', cat: 'tech', ipa: '/ˈleɪtənsi/', hint: 'Khoảng thời gian phản hồi dữ liệu' },
  { id: 'k12', en: 'Middleware', vi: 'Phần mềm trung gian', cat: 'tech', ipa: '/ˈmɪdlweər/', hint: 'Cầu nối giữa hệ thống và ứng dụng' },
  { id: 'k13', en: 'Network', vi: 'Mạng lưới kết nối', cat: 'tech', ipa: '/ˈnetwɜːk/', hint: 'Hệ thống các thiết bị liên kết' },
  { id: 'k14', en: 'Optimization', vi: 'Tối ưu hóa hiệu năng', cat: 'tech', ipa: '/ˌɒptɪmaɪˈzeɪʃn/', hint: 'Làm cho hệ thống chạy mượt nhất' },
  { id: 'k15', en: 'Protocol', vi: 'Giao thức truyền thông', cat: 'tech', ipa: '/ˈprəʊtəkɒl/', hint: 'Quy chuẩn trao đổi dữ liệu mạng' },
  { id: 'k16', en: 'Quantum', vi: 'Lượng tử điện toán', cat: 'tech', ipa: '/ˈkwɒntəm/', hint: 'Nguyên lý vật lý hạt nano' },
  { id: 'k17', en: 'Redundancy', vi: 'Hệ thống dự phòng', cat: 'tech', ipa: '/rɪˈdʌndənsi/', hint: 'Cơ chế dự phòng khi lỗi xảy ra' },
  { id: 'k18', en: 'Scalability', vi: 'Khả năng mở rộng tải', cat: 'tech', ipa: '/ˌskeɪləˈbɪləti/', hint: 'Chịu tải tăng cao mà không sập' },
  { id: 'k19', en: 'Throughput', vi: 'Lưu lượng thông lượng', cat: 'tech', ipa: '/ˈθruːpʊt/', hint: 'Tổng khối lượng công việc hoàn thành' },
  { id: 'k20', en: 'Virtualization', vi: 'Ảo hóa tài nguyên', cat: 'tech', ipa: '/ˌvɜːtʃuəlaɪˈzeɪʃn/', hint: 'Tạo máy ảo trên phần cứng thật' },
  { id: 'k21', en: 'Vulnerability', vi: 'Lỗ hổng bảo mật', cat: 'tech', ipa: '/ˌvʌlnərəˈbɪləti/', hint: 'Điểm yếu hacker có thể khai thác' },
  { id: 'k22', en: 'Asynchronous', vi: 'Xử lý bất đồng bộ', cat: 'tech', ipa: '/eɪˈsɪŋkrənəs/', hint: 'Chạy nền không khóa luồng chính' },
  { id: 'k23', en: 'Binary', vi: 'Hệ nhị phân 0 và 1', cat: 'tech', ipa: '/ˈbaɪnəri/', hint: 'Hệ đếm dùng cơ số 2' },
  { id: 'k24', en: 'Cache', vi: 'Bộ nhớ đệm siêu tốc', cat: 'tech', ipa: '/kæʃ/', hint: 'Vùng nhớ tạm thời truy cập nhanh' },
  { id: 'k25', en: 'Recursion', vi: 'Thuật toán đệ quy', cat: 'tech', ipa: '/rɪˈkɜːʃn/', hint: 'Hàm tự gọi lại chính mình' },
  { id: 'k26', en: 'Deployment', vi: 'Triển khai phát hành', cat: 'tech', ipa: '/dɪˈplɔɪmənt/', hint: 'Đưa ứng dụng lên môi trường production' }
];

export function getVocabPoolByCategory(category: string): VocabItem[] {
  if (category === 'mixed' || !category) {
    return VOCABULARY_LIST;
  }
  return VOCABULARY_LIST.filter(v => v.cat === category);
}

export function getRandomVocab(pool: VocabItem[], excludeEn?: string): VocabItem {
  const filtered = excludeEn ? pool.filter(p => p.en !== excludeEn) : pool;
  if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
