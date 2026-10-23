export interface VocabItem {
  id: string;
  en: string;
  vi: string;
  cat: 'a1' | 'daily' | 'toeic' | 'academic' | 'tech';
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  ipa: string;
  hint: string;
}

export const VOCABULARY_LIST: VocabItem[] = [
  // ==========================================
  // --- CẤP ĐỘ A1: CĂN BẢN (BEGINNER A1 - 32 items) ---
  // ==========================================
  { id: 'a1_01', en: 'Family', vi: 'Gia đình', cat: 'a1', level: 'A1', ipa: '/ˈfæməli/', hint: 'Những người ruột thịt thân yêu' },
  { id: 'a1_02', en: 'House', vi: 'Ngôi nhà', cat: 'a1', level: 'A1', ipa: '/haʊs/', hint: 'Nơi chốn tổ ấm để ở' },
  { id: 'a1_03', en: 'School', vi: 'Trường học', cat: 'a1', level: 'A1', ipa: '/skuːl/', hint: 'Nơi thầy cô giảng dạy học sinh' },
  { id: 'a1_04', en: 'Friend', vi: 'Người bạn', cat: 'a1', level: 'A1', ipa: '/frend/', hint: 'Người gắn bó thân thiết' },
  { id: 'a1_05', en: 'Water', vi: 'Nước uống', cat: 'a1', level: 'A1', ipa: '/ˈwɔːtər/', hint: 'Thức uống duy trì sự sống' },
  { id: 'a1_06', en: 'Apple', vi: 'Quả táo', cat: 'a1', level: 'A1', ipa: '/ˈæpl/', hint: 'Loại trái cây đỏ giòn ngọt' },
  { id: 'a1_07', en: 'Doctor', vi: 'Bác sĩ', cat: 'a1', level: 'A1', ipa: '/ˈdɒktər/', hint: 'Người khám và chữa bệnh' },
  { id: 'a1_08', en: 'Teacher', vi: 'Giáo viên', cat: 'a1', level: 'A1', ipa: '/ˈtiːtʃər/', hint: 'Người truyền đạt kiến thức' },
  { id: 'a1_09', en: 'Book', vi: 'Cuốn sách', cat: 'a1', level: 'A1', ipa: '/bʊk/', hint: 'Vật chứa đựng tri thức đọc' },
  { id: 'a1_10', en: 'Music', vi: 'Âm nhạc', cat: 'a1', level: 'A1', ipa: '/ˈmjuːzɪk/', hint: 'Giai điệu thanh âm du dương' },
  { id: 'a1_11', en: 'Happy', vi: 'Vui vẻ', cat: 'a1', level: 'A1', ipa: '/ˈhæpi/', hint: 'Tâm trạng ngập tràn nụ cười' },
  { id: 'a1_12', en: 'Smile', vi: 'Nụ cười', cat: 'a1', level: 'A1', ipa: '/smaɪl/', hint: 'Biểu cảm rạng rỡ trên môi' },
  { id: 'a1_13', en: 'Morning', vi: 'Buổi sáng', cat: 'a1', level: 'A1', ipa: '/ˈmɔːnɪŋ/', hint: 'Thời điểm bình minh bắt đầu ngày' },
  { id: 'a1_14', en: 'Night', vi: 'Ban đêm', cat: 'a1', level: 'A1', ipa: '/naɪt/', hint: 'Lúc trăng sao xuất hiện tối trời' },
  { id: 'a1_15', en: 'Money', vi: 'Tiền bạc', cat: 'a1', level: 'A1', ipa: '/ˈmʌni/', hint: 'Phương tiện trao đổi mua sắm' },
  { id: 'a1_16', en: 'Time', vi: 'Thời gian', cat: 'a1', level: 'A1', ipa: '/taɪm/', hint: 'Giờ phút trôi qua từng giây' },
  { id: 'a1_17', en: 'Dog', vi: 'Con chó', cat: 'a1', level: 'A1', ipa: '/dɒɡ/', hint: 'Vật nuôi trung thành bốn chân' },
  { id: 'a1_18', en: 'Cat', vi: 'Con mèo', cat: 'a1', level: 'A1', ipa: '/kæt/', hint: 'Thú cưng bắt chuột kêu meo meo' },
  { id: 'a1_19', en: 'Bird', vi: 'Con chim', cat: 'a1', level: 'A1', ipa: '/bɜːd/', hint: 'Loài có cánh bay trên trời' },
  { id: 'a1_20', en: 'Fish', vi: 'Con cá', cat: 'a1', level: 'A1', ipa: '/fɪʃ/', hint: 'Loài vật bơi dưới làn nước' },
  { id: 'a1_21', en: 'Tree', vi: 'Cây cối', cat: 'a1', level: 'A1', ipa: '/triː/', hint: 'Thực vật có cành lá xanh tươi' },
  { id: 'a1_22', en: 'Flower', vi: 'Bông hoa', cat: 'a1', level: 'A1', ipa: '/ˈflaʊər/', hint: 'Đóa hoa thơm ngát sắc màu' },
  { id: 'a1_23', en: 'Sun', vi: 'Mặt trời', cat: 'a1', level: 'A1', ipa: '/sʌn/', hint: 'Tỏa ánh sáng ban mai rực rỡ' },
  { id: 'a1_24', en: 'Moon', vi: 'Mặt trăng', cat: 'a1', level: 'A1', ipa: '/muːn/', hint: 'Tỏa sáng vằng vặc đêm rằm' },
  { id: 'a1_25', en: 'Star', vi: 'Ngôi sao', cat: 'a1', level: 'A1', ipa: '/stɑːr/', hint: 'Điểm sáng lấp lánh bầu trời đêm' },
  { id: 'a1_26', en: 'Bread', vi: 'Bánh mì', cat: 'a1', level: 'A1', ipa: '/bred/', hint: 'Món ăn làm từ bột nướng giòn' },
  { id: 'a1_27', en: 'Milk', vi: 'Sữa tươi', cat: 'a1', level: 'A1', ipa: '/mɪlk/', hint: 'Thức uống bổ dưỡng màu trắng' },
  { id: 'a1_28', en: 'Door', vi: 'Cánh cửa', cat: 'a1', level: 'A1', ipa: '/dɔːr/', hint: 'Lối ra vào căn phòng' },
  { id: 'a1_29', en: 'Window', vi: 'Cửa sổ', cat: 'a1', level: 'A1', ipa: '/ˈwɪndəʊ/', hint: 'Khung kính đón ánh sáng gió mát' },
  { id: 'a1_30', en: 'Table', vi: 'Cái bàn', cat: 'a1', level: 'A1', ipa: '/ˈteɪbl/', hint: 'Mặt phẳng để đồ và làm việc' },
  { id: 'a1_31', en: 'Chair', vi: 'Cái ghế', cat: 'a1', level: 'A1', ipa: '/tʃeər/', hint: 'Đồ vật có bốn chân để ngồi' },
  { id: 'a1_32', en: 'Baby', vi: 'Em bé', cat: 'a1', level: 'A1', ipa: '/ˈbeɪbi/', hint: 'Trẻ sơ sinh thơ ngây đáng yêu' },

  // ==========================================
  // --- GIAO TIẾP HÀNG NGÀY (DAILY LIFE - 26 items) ---
  // ==========================================
  { id: 'd01', en: 'Courage', vi: 'Lòng can đảm', cat: 'daily', level: 'B2', ipa: '/ˈkɜːrɪdʒ/', hint: 'Khả năng đối mặt khó khăn' },
  { id: 'd02', en: 'Gratitude', vi: 'Lòng biết ơn', cat: 'daily', level: 'B2', ipa: '/ˈɡrætɪtjuːd/', hint: 'Cảm kích sự giúp đỡ' },
  { id: 'd03', en: 'Resilience', vi: 'Sự kiên cường', cat: 'daily', level: 'C1', ipa: '/rɪˈzɪliəns/', hint: 'Phục hồi nhanh sau thất bại' },
  { id: 'd04', en: 'Patience', vi: 'Sự kiên nhẫn', cat: 'daily', level: 'B2', ipa: '/ˈpeɪʃns/', hint: 'Khả năng chờ đợi bình tĩnh' },
  { id: 'd05', en: 'Compassion', vi: 'Lòng trắc ẩn', cat: 'daily', level: 'B2', ipa: '/kəmˈpæʃn/', hint: 'Sự đồng cảm và thương yêu' },
  { id: 'd06', en: 'Adventure', vi: 'Cuộc phiêu lưu', cat: 'daily', level: 'B1', ipa: '/ədˈventʃər/', hint: 'Chuyến đi khám phá mạo hiểm' },
  { id: 'd07', en: 'Curiosity', vi: 'Tính tò mò', cat: 'daily', level: 'B2', ipa: '/ˌkjʊəriˈɒsəti/', hint: 'Ham muốn tìm hiểu kiến thức' },
  { id: 'd08', en: 'Harmony', vi: 'Sự hòa hợp', cat: 'daily', level: 'B2', ipa: '/ˈhɑːməni/', hint: 'Yên bình và đồng điệu' },
  { id: 'd09', en: 'Sincerity', vi: 'Sự chân thành', cat: 'daily', level: 'B2', ipa: '/sɪnˈserəti/', hint: 'Thật thà, không giả dối' },
  { id: 'd10', en: 'Wisdom', vi: 'Sự thông thái', cat: 'daily', level: 'B2', ipa: '/ˈwɪzdəm/', hint: 'Hiểu biết sâu rộng' },
  { id: 'd11', en: 'Diligence', vi: 'Sự siêng năng', cat: 'daily', level: 'C1', ipa: '/ˈdɪlɪdʒəns/', hint: 'Làm việc chăm chỉ chu đáo' },
  { id: 'd12', en: 'Generosity', vi: 'Sự hào phóng', cat: 'daily', level: 'B2', ipa: '/ˌdʒenəˈrɒsəti/', hint: 'Rộng lượng cho đi' },
  { id: 'd13', en: 'Inspiration', vi: 'Nguồn cảm hứng', cat: 'daily', level: 'B2', ipa: '/ˌɪnspəˈreɪʃn/', hint: 'Thôi thúc sáng tạo mạnh mẽ' },
  { id: 'd14', en: 'Friendship', vi: 'Tình bạn bè', cat: 'daily', level: 'A2', ipa: '/ˈfrendʃɪp/', hint: 'Gắn kết giữa tri kỷ' },
  { id: 'd15', en: 'Serenity', vi: 'Sự thanh thản', cat: 'daily', level: 'C2', ipa: '/səˈrenəti/', hint: 'Tâm trí tĩnh lặng bình an' },
  { id: 'd16', en: 'Optimism', vi: 'Sự lạc quan', cat: 'daily', level: 'B2', ipa: '/ˈɒptɪmɪzəm/', hint: 'Luôn nhìn về điều tốt đẹp' },
  { id: 'd17', en: 'Empathy', vi: 'Sự thấu cảm', cat: 'daily', level: 'C1', ipa: '/ˈempəθi/', hint: 'Hiểu thấu cảm xúc người khác' },
  { id: 'd18', en: 'Integrity', vi: 'Tính chính trực', cat: 'daily', level: 'C1', ipa: '/ɪnˈteɡrəti/', hint: 'Liêm chính, trung thực' },
  { id: 'd19', en: 'Perseverance', vi: 'Sự kiên trì', cat: 'daily', level: 'C1', ipa: '/ˌpɜːsɪˈvɪərəns/', hint: 'Không bao giờ bỏ cuộc' },
  { id: 'd20', en: 'Courtesy', vi: 'Sự lịch sự', cat: 'daily', level: 'B2', ipa: '/ˈkɜːtəsi/', hint: 'Nhã nhặn và tôn trọng' },
  { id: 'd21', en: 'Creativity', vi: 'Sức sáng tạo', cat: 'daily', level: 'B1', ipa: '/ˌkriːeɪˈtɪvəti/', hint: 'Tạo ra cái mới độc đáo' },
  { id: 'd22', en: 'Discipline', vi: 'Kỷ luật tự giác', cat: 'daily', level: 'B2', ipa: '/ˈdɪsəplɪn/', hint: 'Kiểm soát hành vi bản thân' },
  { id: 'd23', en: 'Loyalty', vi: 'Lòng trung thành', cat: 'daily', level: 'B2', ipa: '/ˈlɔɪəlti/', hint: 'Thủy chung gắn bó' },
  { id: 'd24', en: 'Humility', vi: 'Sự khiêm tốn', cat: 'daily', level: 'C1', ipa: '/hjuːˈmɪləti/', hint: 'Không khoe khoang tự phụ' },
  { id: 'd25', en: 'Passion', vi: 'Niềm đam mê', cat: 'daily', level: 'B1', ipa: '/ˈpæʃn/', hint: 'Nhiệt huyết cháy bỏng' },
  { id: 'd26', en: 'Ambition', vi: 'Tham vọng vươn lên', cat: 'daily', level: 'B2', ipa: '/æmˈbɪʃn/', hint: 'Khát khao đạt thành tựu' },

  // ==========================================
  // --- TOEIC & BUSINESS (26 items) ---
  // ==========================================
  { id: 't01', en: 'Negotiate', vi: 'Đàm phán thương lượng', cat: 'toeic', level: 'B2', ipa: '/nɪˈɡəʊʃieɪt/', hint: 'Thảo luận đi đến hợp đồng' },
  { id: 't02', en: 'Strategy', vi: 'Chiến lược kinh doanh', cat: 'toeic', level: 'B2', ipa: '/ˈstrætədʒi/', hint: 'Kế hoạch hành động dài hạn' },
  { id: 't03', en: 'Revenue', vi: 'Tổng doanh thu', cat: 'toeic', level: 'B2', ipa: '/ˈrevənjuː/', hint: 'Tiền thu về từ bán hàng' },
  { id: 't04', en: 'Contract', vi: 'Hợp đồng kinh tế', cat: 'toeic', level: 'B1', ipa: '/ˈkɒntrækt/', hint: 'Văn bản pháp lý cam kết' },
  { id: 't05', en: 'Agenda', vi: 'Chương trình nghị sự', cat: 'toeic', level: 'B2', ipa: '/əˈdʒendə/', hint: 'Nội dung các mục cuộc họp' },
  { id: 't06', en: 'Inventory', vi: 'Hàng tồn kho', cat: 'toeic', level: 'B2', ipa: '/ˈɪnvəntri/', hint: 'Danh sách hàng hóa lưu kho' },
  { id: 't07', en: 'Deficit', vi: 'Khoản thâm hụt', cat: 'toeic', level: 'C1', ipa: '/ˈdefɪsɪt/', hint: 'Chi vượt quá thu' },
  { id: 't08', en: 'Mergers', vi: 'Sự sáp nhập', cat: 'toeic', level: 'C1', ipa: '/ˈmɜːdʒərz/', hint: 'Hợp nhất hai doanh nghiệp' },
  { id: 't09', en: 'Compliance', vi: 'Sự tuân thủ quy định', cat: 'toeic', level: 'C1', ipa: '/kəmˈplaɪəns/', hint: 'Chấp hành đúng luật lệ' },
  { id: 't10', en: 'Candidate', vi: 'Ứng viên tiềm năng', cat: 'toeic', level: 'B1', ipa: '/ˈkændɪdət/', hint: 'Người nộp đơn phỏng vấn' },
  { id: 't11', en: 'Incentive', vi: 'Chính sách khích lệ', cat: 'toeic', level: 'B2', ipa: '/ɪnˈsentɪv/', hint: 'Phần thưởng khuyến khích làm việc' },
  { id: 't12', en: 'Efficiency', vi: 'Hiệu suất vận hành', cat: 'toeic', level: 'B2', ipa: '/ɪˈfɪʃnsi/', hint: 'Làm việc nhanh và ít hao phí' },
  { id: 't13', en: 'Benchmark', vi: 'Tiêu chuẩn đối sánh', cat: 'toeic', level: 'B2', ipa: '/ˈbentʃmɑːk/', hint: 'Mốc tiêu chuẩn để so sánh' },
  { id: 't14', en: 'Expansion', vi: 'Sự mở rộng quy mô', cat: 'toeic', level: 'B2', ipa: '/ɪkˈspænʃn/', hint: 'Tăng trưởng thị trường chi nhánh' },
  { id: 't15', en: 'Prototype', vi: 'Mẫu thử nghiệm', cat: 'toeic', level: 'B2', ipa: '/ˈprəʊtətaɪp/', hint: 'Bản mẫu sản phẩm sơ khởi' },
  { id: 't16', en: 'Budget', vi: 'Ngân sách tài chính', cat: 'toeic', level: 'B1', ipa: '/ˈbʌdʒɪt/', hint: 'Kế hoạch thu chi tài chính' },
  { id: 't17', en: 'Delegate', vi: 'Ủy quyền nhiệm vụ', cat: 'toeic', level: 'B2', ipa: '/ˈdelɪɡeɪt/', hint: 'Giao phó công việc cho cấp dưới' },
  { id: 't18', en: 'Voucher', vi: 'Phiếu chứng từ ưu đãi', cat: 'toeic', level: 'B1', ipa: '/ˈvaʊtʃər/', hint: 'Phiếu giảm giá hoặc thanh toán' },
  { id: 't19', en: 'Quorum', vi: 'Số đại biểu tối thiểu', cat: 'toeic', level: 'C2', ipa: '/ˈkwɔːrəm/', hint: 'Số người đủ để họp biểu quyết' },
  { id: 't20', en: 'Endorsement', vi: 'Sự bảo chứng công khai', cat: 'toeic', level: 'C1', ipa: '/ɪnˈdɔːsmənt/', hint: 'Người nổi tiếng ủng hộ sản phẩm' },
  { id: 't21', en: 'Audit', vi: 'Kiểm toán tài chính', cat: 'toeic', level: 'B2', ipa: '/ˈɔːdɪt/', hint: 'Kiểm tra sổ sách kế toán' },
  { id: 't22', en: 'Logistics', vi: 'Hậu cần vận tải', cat: 'toeic', level: 'B2', ipa: '/ləˈdʒɪstɪks/', hint: 'Quản lý chuỗi cung ứng giao nhận' },
  { id: 't23', en: 'Dividend', vi: 'Tiền cổ tức chia lãi', cat: 'toeic', level: 'C1', ipa: '/ˈdɪvɪdend/', hint: 'Lợi nhuận chia cho cổ đông' },
  { id: 't24', en: 'Policy', vi: 'Chính sách công ty', cat: 'toeic', level: 'B1', ipa: '/ˈpɒləsi/', hint: 'Quy tắc hướng dẫn hành động' },
  { id: 't25', en: 'Warranty', vi: 'Cam kết bảo hành', cat: 'toeic', level: 'B1', ipa: '/ˈwɒrənti/', hint: 'Bảo đảm sửa chữa khi có lỗi' },
  { id: 't26', en: 'Clause', vi: 'Điều khoản văn bản', cat: 'toeic', level: 'B2', ipa: '/klɔːz/', hint: 'Mục thỏa thuận trong hợp đồng' },

  // ==========================================
  // --- ACADEMIC & IELTS (26 items) ---
  // ==========================================
  { id: 'a01', en: 'Hypothesis', vi: 'Giả thuyết khoa học', cat: 'academic', level: 'B2', ipa: '/haɪˈpɒθəsɪs/', hint: 'Dự đoán ban đầu cần kiểm chứng' },
  { id: 'a02', en: 'Empirical', vi: 'Mang tính thực nghiệm', cat: 'academic', level: 'C1', ipa: '/ɪmˈpɪrɪkl/', hint: 'Dựa trên quan sát và thực nghiệm' },
  { id: 'a03', en: 'Synthesize', vi: 'Tổng hợp phân tích', cat: 'academic', level: 'C1', ipa: '/ˈsɪnθəsaɪz/', hint: 'Kết hợp nhiều dữ liệu thành thể thống nhất' },
  { id: 'a04', en: 'Paradigm', vi: 'Mô hình mẫu tư duy', cat: 'academic', level: 'C2', ipa: '/ˈpærədaɪm/', hint: 'Khung nhận thức tiêu chuẩn' },
  { id: 'a05', en: 'Methodology', vi: 'Phương pháp luận', cat: 'academic', level: 'C1', ipa: '/ˌmeθəˈdɒlədʒi/', hint: 'Hệ thống phương pháp nghiên cứu' },
  { id: 'a06', en: 'Coherent', vi: 'Mạch lạc chặt chẽ', cat: 'academic', level: 'B2', ipa: '/kəʊˈhɪərənt/', hint: 'Logic, liên kết rõ ràng' },
  { id: 'a07', en: 'Discrepancy', vi: 'Sự sai lệch số liệu', cat: 'academic', level: 'C1', ipa: '/dɪˈskrepənsi/', hint: 'Bất đồng giữa các số liệu' },
  { id: 'a08', en: 'Correlation', vi: 'Mối tương quan', cat: 'academic', level: 'B2', ipa: '/ˌkɒrəˈleɪʃn/', hint: 'Mối quan hệ biến thiên qua lại' },
  { id: 'a09', en: 'Phenomenon', vi: 'Hiện tượng quan sát', cat: 'academic', level: 'B2', ipa: '/fəˈnɒmɪnən/', hint: 'Sự việc thực tế diễn ra' },
  { id: 'a10', en: 'Abstract', vi: 'Trừu tượng khái quát', cat: 'academic', level: 'B2', ipa: '/ˈæbstrækt/', hint: 'Tóm lược lý thuyết không hữu hình' },
  { id: 'a11', en: 'Comprehensive', vi: 'Toàn diện bao quát', cat: 'academic', level: 'B2', ipa: '/ˌkɒmprɪˈhensɪv/', hint: 'Đầy đủ mọi khía cạnh' },
  { id: 'a12', en: 'Qualitative', vi: 'Định tính phân tích', cat: 'academic', level: 'C1', ipa: '/ˈkwɒlɪtətɪv/', hint: 'Đánh giá qua tính chất đặc điểm' },
  { id: 'a13', en: 'Quantitative', vi: 'Định lượng số liệu', cat: 'academic', level: 'C1', ipa: '/ˈkwɒntɪtətɪv/', hint: 'Đo lường bằng con số cụ thể' },
  { id: 'a14', en: 'Pragmatic', vi: 'Thực dụng thực tế', cat: 'academic', level: 'C1', ipa: '/præɡˈmætɪk/', hint: 'Chú trọng vào hiệu quả ứng dụng' },
  { id: 'a15', en: 'Implicit', vi: 'Ngấm ngầm ẩn ý', cat: 'academic', level: 'C1', ipa: '/ɪmˈplɪsɪt/', hint: 'Hàm ý, không nói toạc ra' },
  { id: 'a16', en: 'Explicit', vi: 'Rõ ràng minh bạch', cat: 'academic', level: 'B2', ipa: '/ɪkˈsplɪsɪt/', hint: 'Nêu thẳng thắn không úp mở' },
  { id: 'a17', en: 'Inherent', vi: 'Vốn có bẩm sinh', cat: 'academic', level: 'C1', ipa: '/ɪnˈhɪərənt/', hint: 'Thuộc tính bản chất sẵn có' },
  { id: 'a18', en: 'Ambiguous', vi: 'Mơ hồ đa nghĩa', cat: 'academic', level: 'B2', ipa: '/æmˈbɪɡjuəs/', hint: 'Có thể hiểu theo nhiều cách' },
  { id: 'a19', en: 'Concurrence', vi: 'Sự đồng thuận', cat: 'academic', level: 'C2', ipa: '/kənˈkʌrəns/', hint: 'Các bên cùng nhất trí' },
  { id: 'a20', en: 'Cognitive', vi: 'Thuộc về nhận thức', cat: 'academic', level: 'B2', ipa: '/ˈkɒɡnətɪv/', hint: 'Liên quan đến hoạt động não bộ' },
  { id: 'a21', en: 'Bias', vi: 'Định kiến thiên vị', cat: 'academic', level: 'B2', ipa: '/ˈbaɪəs/', hint: 'Xu hướng thiên lệch một chiều' },
  { id: 'a22', en: 'Viable', vi: 'Khả thi có thể làm', cat: 'academic', level: 'B2', ipa: '/ˈvaɪəbl/', hint: 'Có khả năng thành công trong thực tế' },
  { id: 'a23', en: 'Validate', vi: 'Xác thực kiểm chứng', cat: 'academic', level: 'B2', ipa: '/ˈvælɪdeɪt/', hint: 'Chứng minh tính đúng đắn' },
  { id: 'a24', en: 'Extrapolate', vi: 'Ngoại suy dữ liệu', cat: 'academic', level: 'C2', ipa: '/ɪkˈstræpəleɪt/', hint: 'Dự đoán tương lai từ xu hướng cũ' },
  { id: 'a25', en: 'Arbitrary', vi: 'Tùy tiện ngẫu hứng', cat: 'academic', level: 'C1', ipa: '/ˈɑːbɪtrəri/', hint: 'Không dựa trên nguyên tắc nào' },
  { id: 'a26', en: 'Premise', vi: 'Tiền đề lập luận', cat: 'academic', level: 'C1', ipa: '/ˈpremɪs/', hint: 'Cơ sở nền tảng để suy luận' },

  // ==========================================
  // --- TECH & ENGINEERING (26 items) ---
  // ==========================================
  { id: 'k01', en: 'Algorithm', vi: 'Thuật toán xử lý', cat: 'tech', level: 'B2', ipa: '/ˈælɡərɪðəm/', hint: 'Quy trình từng bước giải quyết vấn đề' },
  { id: 'k02', en: 'Architecture', vi: 'Kiến trúc hệ thống', cat: 'tech', level: 'B2', ipa: '/ˈɑːkɪtektʃər/', hint: 'Cấu trúc tổng thể phần mềm phần cứng' },
  { id: 'k03', en: 'Bandwidth', vi: 'Băng thông mạng', cat: 'tech', level: 'B2', ipa: '/ˈbændwɪdθ/', hint: 'Lượng dữ liệu truyền trên giây' },
  { id: 'k04', en: 'Compiler', vi: 'Trình biên dịch mã', cat: 'tech', level: 'C1', ipa: '/kəmˈpaɪlər/', hint: 'Dịch mã nguồn sang mã máy' },
  { id: 'k05', en: 'Cryptography', vi: 'Mật mã học bảo mật', cat: 'tech', level: 'C2', ipa: '/krɪpˈtɒɡrəfi/', hint: 'Khoa học bảo vệ dữ liệu bí mật' },
  { id: 'k06', en: 'Database', vi: 'Cơ sở dữ liệu', cat: 'tech', level: 'B1', ipa: '/ˈdeɪtəbeɪs/', hint: 'Nơi lưu trữ và truy vấn dữ liệu' },
  { id: 'k07', en: 'Encryption', vi: 'Mã hóa thông tin', cat: 'tech', level: 'B2', ipa: '/ɪnˈkrɪpʃn/', hint: 'Biến đổi dữ liệu tránh đọc trộm' },
  { id: 'k08', en: 'Framework', vi: 'Khung lập trình', cat: 'tech', level: 'B2', ipa: '/ˈfreɪmwɜːk/', hint: 'Nền tảng phát triển ứng dụng' },
  { id: 'k09', en: 'Hardware', vi: 'Phần cứng máy tính', cat: 'tech', level: 'A2', ipa: '/ˈhɑːdweər/', hint: 'Linh kiện vật lý mạch điện' },
  { id: 'k10', en: 'Interface', vi: 'Giao diện tương tác', cat: 'tech', level: 'B2', ipa: '/ˈɪntəfeɪs/', hint: 'Điểm kết nối giữa các thành phần' },
  { id: 'k11', en: 'Latency', vi: 'Độ trễ tín hiệu', cat: 'tech', level: 'C1', ipa: '/ˈleɪtənsi/', hint: 'Khoảng thời gian phản hồi dữ liệu' },
  { id: 'k12', en: 'Middleware', vi: 'Phần mềm trung gian', cat: 'tech', level: 'C1', ipa: '/ˈmɪdlweər/', hint: 'Cầu nối giữa hệ thống và ứng dụng' },
  { id: 'k13', en: 'Network', vi: 'Mạng lưới kết nối', cat: 'tech', level: 'A2', ipa: '/ˈnetwɜːk/', hint: 'Hệ thống các thiết bị liên kết' },
  { id: 'k14', en: 'Optimization', vi: 'Tối ưu hóa', cat: 'tech', level: 'B2', ipa: '/ˌɒptɪmaɪˈzeɪʃn/', hint: 'Làm cho hệ thống chạy mượt nhất' },
  { id: 'k15', en: 'Protocol', vi: 'Giao thức truyền thông', cat: 'tech', level: 'B2', ipa: '/ˈprəʊtəkɒl/', hint: 'Quy chuẩn trao đổi dữ liệu mạng' },
  { id: 'k16', en: 'Quantum', vi: 'Lượng tử điện toán', cat: 'tech', level: 'C2', ipa: '/ˈkwɒntəm/', hint: 'Nguyên lý vật lý hạt nano' },
  { id: 'k17', en: 'Redundancy', vi: 'Hệ thống dự phòng', cat: 'tech', level: 'C1', ipa: '/rɪˈdʌndənsi/', hint: 'Cơ chế dự phòng khi lỗi xảy ra' },
  { id: 'k18', en: 'Scalability', vi: 'Khả năng mở rộng', cat: 'tech', level: 'C1', ipa: '/ˌskeɪləˈbɪləti/', hint: 'Chịu tải tăng cao mà không sập' },
  { id: 'k19', en: 'Throughput', vi: 'Lưu lượng thông lượng', cat: 'tech', level: 'C1', ipa: '/ˈθruːpʊt/', hint: 'Tổng khối lượng công việc hoàn thành' },
  { id: 'k20', en: 'Virtualization', vi: 'Ảo hóa tài nguyên', cat: 'tech', level: 'C1', ipa: '/ˌvɜːtʃuəlaɪˈzeɪʃn/', hint: 'Tạo máy ảo trên phần cứng thật' },
  { id: 'k21', en: 'Vulnerability', vi: 'Lỗ hổng bảo mật', cat: 'tech', level: 'C1', ipa: '/ˌvʌlnərəˈbɪləti/', hint: 'Điểm yếu hacker có thể khai thác' },
  { id: 'k22', en: 'Asynchronous', vi: 'Xử lý bất đồng bộ', cat: 'tech', level: 'C1', ipa: '/eɪˈsɪŋkrənəs/', hint: 'Chạy nền không khóa luồng chính' },
  { id: 'k23', en: 'Binary', vi: 'Hệ nhị phân 0-1', cat: 'tech', level: 'B2', ipa: '/ˈbaɪnəri/', hint: 'Hệ đếm dùng cơ số 2' },
  { id: 'k24', en: 'Cache', vi: 'Bộ nhớ đệm', cat: 'tech', level: 'B2', ipa: '/kæʃ/', hint: 'Vùng nhớ tạm thời truy cập nhanh' },
  { id: 'k25', en: 'Recursion', vi: 'Thuật toán đệ quy', cat: 'tech', level: 'C1', ipa: '/rɪˈkɜːʃn/', hint: 'Hàm tự gọi lại chính mình' },
  { id: 'k26', en: 'Deployment', vi: 'Triển khai phát hành', cat: 'tech', level: 'B2', ipa: '/dɪˈplɔɪmənt/', hint: 'Đưa ứng dụng lên môi trường production' }
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
