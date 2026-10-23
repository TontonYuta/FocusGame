export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabItem {
  id: string;
  en: string;
  vi: string;
  level: CEFRLevel;
  cat: 'daily' | 'toeic' | 'academic' | 'tech';
  ipa: string;
  hint: string;
}

export const VOCABULARY_DATA: VocabItem[] = [
  // ========================================================
  // LEVEL A1: CĂN BẢN (BEGINNER / BREAKTHROUGH - 40 words)
  // Essential everyday words for beginners (Oxford / Cambridge A1)
  // ========================================================
  { id: 'a1_01', en: 'Family', vi: 'Gia đình', level: 'A1', cat: 'daily', ipa: '/ˈfæməli/', hint: 'Những người ruột thịt thân yêu' },
  { id: 'a1_02', en: 'House', vi: 'Ngôi nhà', level: 'A1', cat: 'daily', ipa: '/haʊs/', hint: 'Nơi chốn tổ ấm để ở' },
  { id: 'a1_03', en: 'School', vi: 'Trường học', level: 'A1', cat: 'daily', ipa: '/skuːl/', hint: 'Nơi thầy cô giảng dạy học sinh' },
  { id: 'a1_04', en: 'Friend', vi: 'Người bạn', level: 'A1', cat: 'daily', ipa: '/frend/', hint: 'Người gắn bó thân thiết' },
  { id: 'a1_05', en: 'Water', vi: 'Nước uống', level: 'A1', cat: 'daily', ipa: '/ˈwɔːtər/', hint: 'Thức uống duy trì sự sống' },
  { id: 'a1_06', en: 'Apple', vi: 'Quả táo', level: 'A1', cat: 'daily', ipa: '/ˈæpl/', hint: 'Loại trái cây đỏ giòn ngọt' },
  { id: 'a1_07', en: 'Doctor', vi: 'Bác sĩ', level: 'A1', cat: 'daily', ipa: '/ˈdɒktər/', hint: 'Người khám và chữa bệnh' },
  { id: 'a1_08', en: 'Teacher', vi: 'Giáo viên', level: 'A1', cat: 'daily', ipa: '/ˈtiːtʃər/', hint: 'Người truyền đạt kiến thức' },
  { id: 'a1_09', en: 'Book', vi: 'Cuốn sách', level: 'A1', cat: 'daily', ipa: '/bʊk/', hint: 'Vật chứa đựng tri thức đọc' },
  { id: 'a1_10', en: 'Music', vi: 'Âm nhạc', level: 'A1', cat: 'daily', ipa: '/ˈmjuːzɪk/', hint: 'Giai điệu thanh âm du dương' },
  { id: 'a1_11', en: 'Happy', vi: 'Vui vẻ', level: 'A1', cat: 'daily', ipa: '/ˈhæpi/', hint: 'Tâm trạng ngập tràn nụ cười' },
  { id: 'a1_12', en: 'Smile', vi: 'Nụ cười', level: 'A1', cat: 'daily', ipa: '/smaɪl/', hint: 'Biểu cảm rạng rỡ trên môi' },
  { id: 'a1_13', en: 'Morning', vi: 'Buổi sáng', level: 'A1', cat: 'daily', ipa: '/ˈmɔːnɪŋ/', hint: 'Thời điểm bình minh bắt đầu ngày' },
  { id: 'a1_14', en: 'Night', vi: 'Ban đêm', level: 'A1', cat: 'daily', ipa: '/naɪt/', hint: 'Lúc trăng sao xuất hiện tối trời' },
  { id: 'a1_15', en: 'Money', vi: 'Tiền bạc', level: 'A1', cat: 'daily', ipa: '/ˈmʌni/', hint: 'Phương tiện trao đổi mua sắm' },
  { id: 'a1_16', en: 'Time', vi: 'Thời gian', level: 'A1', cat: 'daily', ipa: '/taɪm/', hint: 'Giờ phút trôi qua từng giây' },
  { id: 'a1_17', en: 'Dog', vi: 'Con chó', level: 'A1', cat: 'daily', ipa: '/dɒɡ/', hint: 'Vật nuôi trung thành bốn chân' },
  { id: 'a1_18', en: 'Cat', vi: 'Con mèo', level: 'A1', cat: 'daily', ipa: '/kæt/', hint: 'Thú cưng bắt chuột kêu meo meo' },
  { id: 'a1_19', en: 'Bird', vi: 'Con chim', level: 'A1', cat: 'daily', ipa: '/bɜːd/', hint: 'Loài có cánh bay trên trời' },
  { id: 'a1_20', en: 'Fish', vi: 'Con cá', level: 'A1', cat: 'daily', ipa: '/fɪʃ/', hint: 'Loài vật bơi dưới làn nước' },
  { id: 'a1_21', en: 'Tree', vi: 'Cây cối', level: 'A1', cat: 'daily', ipa: '/triː/', hint: 'Thực vật có cành lá xanh tươi' },
  { id: 'a1_22', en: 'Flower', vi: 'Bông hoa', level: 'A1', cat: 'daily', ipa: '/ˈflaʊər/', hint: 'Đóa hoa thơm ngát sắc màu' },
  { id: 'a1_23', en: 'Sun', vi: 'Mặt trời', level: 'A1', cat: 'daily', ipa: '/sʌn/', hint: 'Tỏa ánh sáng ban mai rực rỡ' },
  { id: 'a1_24', en: 'Moon', vi: 'Mặt trăng', level: 'A1', cat: 'daily', ipa: '/muːn/', hint: 'Tỏa sáng vằng vặc đêm rằm' },
  { id: 'a1_25', en: 'Star', vi: 'Ngôi sao', level: 'A1', cat: 'daily', ipa: '/stɑːr/', hint: 'Điểm sáng lấp lánh bầu trời đêm' },
  { id: 'a1_26', en: 'Bread', vi: 'Bánh mì', level: 'A1', cat: 'daily', ipa: '/bred/', hint: 'Món ăn làm từ bột nướng giòn' },
  { id: 'a1_27', en: 'Milk', vi: 'Sữa tươi', level: 'A1', cat: 'daily', ipa: '/mɪlk/', hint: 'Thức uống bổ dưỡng màu trắng' },
  { id: 'a1_28', en: 'Door', vi: 'Cánh cửa', level: 'A1', cat: 'daily', ipa: '/dɔːr/', hint: 'Lối ra vào căn phòng' },
  { id: 'a1_29', en: 'Window', vi: 'Cửa sổ', level: 'A1', cat: 'daily', ipa: '/ˈwɪndəʊ/', hint: 'Khung kính đón ánh sáng gió mát' },
  { id: 'a1_30', en: 'Table', vi: 'Cái bàn', level: 'A1', cat: 'daily', ipa: '/ˈteɪbl/', hint: 'Mặt phẳng để đồ và làm việc' },
  { id: 'a1_31', en: 'Chair', vi: 'Cái ghế', level: 'A1', cat: 'daily', ipa: '/tʃeər/', hint: 'Đồ vật có bốn chân để ngồi' },
  { id: 'a1_32', en: 'Baby', vi: 'Em bé', level: 'A1', cat: 'daily', ipa: '/ˈbeɪbi/', hint: 'Trẻ sơ sinh thơ ngây đáng yêu' },
  { id: 'a1_33', en: 'Car', vi: 'Xe ô tô', level: 'A1', cat: 'daily', ipa: '/kɑːr/', hint: 'Phương tiện đi lại 4 bánh' },
  { id: 'a1_34', en: 'City', vi: 'Thành phố', level: 'A1', cat: 'daily', ipa: '/ˈsɪti/', hint: 'Đô thị đông đúc sầm uất' },
  { id: 'a1_35', en: 'River', vi: 'Dòng sông', level: 'A1', cat: 'daily', ipa: '/ˈrɪvər/', hint: 'Dòng nước tự nhiên chảy dài' },
  { id: 'a1_36', en: 'Rain', vi: 'Cơn mưa', level: 'A1', cat: 'daily', ipa: '/reɪn/', hint: 'Nước từ mây rơi xuống mặt đất' },
  { id: 'a1_37', en: 'Sea', vi: 'Biển cả', level: 'A1', cat: 'daily', ipa: '/siː/', hint: 'Vùng nước mặn bao la' },
  { id: 'a1_38', en: 'Road', vi: 'Con đường', level: 'A1', cat: 'daily', ipa: '/rəʊd/', hint: 'Lối đi cho xe cộ và người' },
  { id: 'a1_39', en: 'Sky', vi: 'Bầu trời', level: 'A1', cat: 'daily', ipa: '/skaɪ/', hint: 'Không gian xanh trên cao' },
  { id: 'a1_40', en: 'Love', vi: 'Tình yêu', level: 'A1', cat: 'daily', ipa: '/lʌv/', hint: 'Tình cảm sâu sắc chân thành' },

  // ========================================================
  // LEVEL A2: SƠ CẤP (ELEMENTARY - 36 words)
  // Daily life situations, travel, shopping, environment
  // ========================================================
  { id: 'a2_01', en: 'Airport', vi: 'Sân bay', level: 'A2', cat: 'daily', ipa: '/ˈeəpɔːt/', hint: 'Nơi máy bay cất hạ cánh' },
  { id: 'a2_02', en: 'Bicycle', vi: 'Xe đạp', level: 'A2', cat: 'daily', ipa: '/ˈbaɪsɪkl/', hint: 'Phương tiện hai bánh tự đạp' },
  { id: 'a2_03', en: 'Camera', vi: 'Máy chụp ảnh', level: 'A2', cat: 'daily', ipa: '/ˈkæmrə/', hint: 'Thiết bị lưu giữ khoảnh khắc' },
  { id: 'a2_04', en: 'Dinner', vi: 'Bữa tối', level: 'A2', cat: 'daily', ipa: '/ˈdɪnər/', hint: 'Bữa ăn chính vào buổi tối' },
  { id: 'a2_05', en: 'Factory', vi: 'Nhà máy', level: 'A2', cat: 'toeic', ipa: '/ˈfæktri/', hint: 'Xưởng sản xuất hàng hóa' },
  { id: 'a2_06', en: 'Garden', vi: 'Khu vườn', level: 'A2', cat: 'daily', ipa: '/ˈɡɑːdn/', hint: 'Mảnh đất trồng hoa và cây' },
  { id: 'a2_07', en: 'Holiday', vi: 'Kỳ nghỉ lễ', level: 'A2', cat: 'daily', ipa: '/ˈhɒlədeɪ/', hint: 'Thời gian nghỉ ngơi du lịch' },
  { id: 'a2_08', en: 'Kitchen', vi: 'Nhà bếp', level: 'A2', cat: 'daily', ipa: '/ˈkɪtʃɪn/', hint: 'Nơi nấu nướng thức ăn' },
  { id: 'a2_09', en: 'Market', vi: 'Chợ mua sắm', level: 'A2', cat: 'daily', ipa: '/ˈmɑːkɪt/', hint: 'Khu vực mua bán trao đổi hàng' },
  { id: 'a2_10', en: 'Passport', vi: 'Hộ chiếu', level: 'A2', cat: 'daily', ipa: '/ˈpɑːspɔːt/', hint: 'Giấy thông hành xuất nhập cảnh' },
  { id: 'a2_11', en: 'Station', vi: 'Nhà ga', level: 'A2', cat: 'daily', ipa: '/ˈsteɪʃn/', hint: 'Nơi tàu xe dừng đón khách' },
  { id: 'a2_12', en: 'Weather', vi: 'Thời tiết', level: 'A2', cat: 'daily', ipa: '/ˈweðər/', hint: 'Khí hậu nắng mưa trong ngày' },
  { id: 'a2_13', en: 'Museum', vi: 'Bảo tàng', level: 'A2', cat: 'academic', ipa: '/mjuˈziːəm/', hint: 'Nơi trưng bày di sản lịch sử' },
  { id: 'a2_14', en: 'Forest', vi: 'Khu rừng', level: 'A2', cat: 'daily', ipa: '/ˈfɒrɪst/', hint: 'Vùng đất nhiều cây cối rậm rạp' },
  { id: 'a2_15', en: 'Mountain', vi: 'Ngọn núi', level: 'A2', cat: 'daily', ipa: '/ˈmaʊntən/', hint: 'Vùng đất cao hùng vĩ' },
  { id: 'a2_16', en: 'Island', vi: 'Hòn đảo', level: 'A2', cat: 'daily', ipa: '/ˈaɪlənd/', hint: 'Mảnh đất bao quanh bởi biển' },
  { id: 'a2_17', en: 'Ticket', vi: 'Vé vào cửa', level: 'A2', cat: 'daily', ipa: '/ˈtɪkɪt/', hint: 'Phiếu giấy để đi tàu xe tham quan' },
  { id: 'a2_18', en: 'Village', vi: 'Ngôi làng', level: 'A2', cat: 'daily', ipa: '/ˈvɪlɪdʒ/', hint: 'Khu dân cư nông thôn yên bình' },
  { id: 'a2_19', en: 'Winter', vi: 'Mùa đông', level: 'A2', cat: 'daily', ipa: '/ˈwɪntər/', hint: 'Mùa lạnh giá nhất trong năm' },
  { id: 'a2_20', en: 'Summer', vi: 'Mùa hè', level: 'A2', cat: 'daily', ipa: '/ˈsʌmər/', hint: 'Mùa nắng ấm rực rỡ' },
  { id: 'a2_21', en: 'Clothes', vi: 'Quần áo', level: 'A2', cat: 'daily', ipa: '/kləʊðz/', hint: 'Trang phục mặc trên người' },
  { id: 'a2_22', en: 'Coffee', vi: 'Cà phê', level: 'A2', cat: 'daily', ipa: '/ˈkɒfi/', hint: 'Thức uống hương thơm giúp tỉnh táo' },
  { id: 'a2_23', en: 'Pocket', vi: 'Túi áo quần', level: 'A2', cat: 'daily', ipa: '/ˈpɒkɪt/', hint: 'Túi nhỏ đựng đồ trên y phục' },
  { id: 'a2_24', en: 'Shadow', vi: 'Bóng râm', level: 'A2', cat: 'daily', ipa: '/ˈʃædəʊ/', hint: 'Vùng tối tạo bởi ánh sáng che khuất' },
  { id: 'a2_25', en: 'Mirror', vi: 'Gương soi', level: 'A2', cat: 'daily', ipa: '/ˈmɪrər/', hint: 'Tấm kính phản chiếu hình ảnh' },
  { id: 'a2_26', en: 'Silver', vi: 'Bạc trắng', level: 'A2', cat: 'daily', ipa: '/ˈsɪlvər/', hint: 'Kim loại quý ánh trắng' },
  { id: 'a2_27', en: 'Golden', vi: 'Bằng vàng', level: 'A2', cat: 'daily', ipa: '/ˈɡəʊldən/', hint: 'Ánh vàng quý giá lộng lẫy' },
  { id: 'a2_28', en: 'Bridge', vi: 'Cây cầu', level: 'A2', cat: 'daily', ipa: '/brɪdʒ/', hint: 'Công trình bắc qua sông hồ' },
  { id: 'a2_29', en: 'Animal', vi: 'Động vật', level: 'A2', cat: 'daily', ipa: '/ˈænɪml/', hint: 'Các loài sinh vật muôn loài' },
  { id: 'a2_30', en: 'Health', vi: 'Sức khỏe', level: 'A2', cat: 'daily', ipa: '/helθ/', hint: 'Thể trạng tốt không bệnh tật' },
  { id: 'a2_31', en: 'Simple', vi: 'Đơn giản', level: 'A2', cat: 'daily', ipa: '/ˈsɪmpl/', hint: 'Dễ hiểu, không phức tạp' },
  { id: 'a2_32', en: 'Useful', vi: 'Hữu ích', level: 'A2', cat: 'daily', ipa: '/ˈjuːsfl/', hint: 'Mang lại lợi ích thiết thực' },
  { id: 'a2_33', en: 'Nature', vi: 'Thiên nhiên', level: 'A2', cat: 'academic', ipa: '/ˈneɪtʃər/', hint: 'Thế giới tự nhiên quanh ta' },
  { id: 'a2_34', en: 'Price', vi: 'Giá cả', level: 'A2', cat: 'toeic', ipa: '/praɪs/', hint: 'Số tiền phải trả để mua đồ' },
  { id: 'a2_35', en: 'Present', vi: 'Món quà', level: 'A2', cat: 'daily', ipa: '/ˈpreznt/', hint: 'Vật tặng nhau ngày sinh nhật' },
  { id: 'a2_36', en: 'Friendship', vi: 'Tình bạn', level: 'A2', cat: 'daily', ipa: '/ˈfrendʃɪp/', hint: 'Tình bạn bè chân thành' },

  // ========================================================
  // LEVEL B1: TRUNG CẤP (INTERMEDIATE - 36 words)
  // Expressing opinions, emotions, planning, society, career
  // ========================================================
  { id: 'b1_01', en: 'Adventure', vi: 'Phiêu lưu', level: 'B1', cat: 'daily', ipa: '/ədˈventʃər/', hint: 'Hành trình khám phá mạo hiểm' },
  { id: 'b1_02', en: 'Accident', vi: 'Tai nạn sự cố', level: 'B1', cat: 'daily', ipa: '/ˈæksɪdənt/', hint: 'Sự việc rủi ro bất ngờ' },
  { id: 'b1_03', en: 'Climate', vi: 'Khí hậu', level: 'B1', cat: 'academic', ipa: '/ˈklaɪmət/', hint: 'Mô hình thời tiết dài hạn' },
  { id: 'b1_04', en: 'Culture', vi: 'Văn hóa', level: 'B1', cat: 'academic', ipa: '/ˈkʌltʃər/', hint: 'Bản sắc phong tục dân tộc' },
  { id: 'b1_05', en: 'Decision', vi: 'Quyết định', level: 'B1', cat: 'toeic', ipa: '/dɪˈsɪʒn/', hint: 'Sự lựa chọn dứt khoát' },
  { id: 'b1_06', en: 'Education', vi: 'Giáo dục', level: 'B1', cat: 'academic', ipa: '/ˌedʒuˈkeɪʃn/', hint: 'Hệ thống học vấn tri thức' },
  { id: 'b1_07', en: 'Fashion', vi: 'Thời trang', level: 'B1', cat: 'daily', ipa: '/ˈfæʃn/', hint: 'Xu hướng trang phục thịnh hành' },
  { id: 'b1_08', en: 'Government', vi: 'Chính phủ', level: 'B1', cat: 'academic', ipa: '/ˈɡʌvənmənt/', hint: 'Cơ quan quản lý đất nước' },
  { id: 'b1_09', en: 'Habit', vi: 'Thói quen', level: 'B1', cat: 'daily', ipa: '/ˈhæbɪt/', hint: 'Hành vi lặp lại thường xuyên' },
  { id: 'b1_10', en: 'Journey', vi: 'Chuyến đi', level: 'B1', cat: 'daily', ipa: '/ˈdʒɜːni/', hint: 'Chặng đường hành trình dài' },
  { id: 'b1_11', en: 'Knowledge', vi: 'Kiến thức', level: 'B1', cat: 'academic', ipa: '/ˈnɒlɪdʒ/', hint: 'Hiểu biết và học vấn tích lũy' },
  { id: 'b1_12', en: 'Memory', vi: 'Ký ức', level: 'B1', cat: 'daily', ipa: '/ˈmeməri/', hint: 'Kỷ niệm lưu trong tâm trí' },
  { id: 'b1_13', en: 'Opinion', vi: 'Ý kiến cá nhân', level: 'B1', cat: 'toeic', ipa: '/əˈpɪnjən/', hint: 'Quan điểm suy nghĩ của một người' },
  { id: 'b1_14', en: 'Quality', vi: 'Chất lượng', level: 'B1', cat: 'toeic', ipa: '/ˈkwɒləti/', hint: 'Độ tốt và chuẩn mực sản phẩm' },
  { id: 'b1_15', en: 'Society', vi: 'Xã hội', level: 'B1', cat: 'academic', ipa: '/səˈsaɪəti/', hint: 'Cộng đồng con người cùng sống' },
  { id: 'b1_16', en: 'Traffic', vi: 'Giao thông', level: 'B1', cat: 'daily', ipa: '/ˈtræfɪk/', hint: 'Xe cộ lưu thông trên đường' },
  { id: 'b1_17', en: 'Emotion', vi: 'Cảm xúc', level: 'B1', cat: 'daily', ipa: '/ɪˈməʊʃn/', hint: 'Rung động trong tâm hồn' },
  { id: 'b1_18', en: 'Energy', vi: 'Năng lượng', level: 'B1', cat: 'tech', ipa: '/ˈenədʒi/', hint: 'Nguồn lực sức mạnh vận hành' },
  { id: 'b1_19', en: 'Future', vi: 'Tương lai', level: 'B1', cat: 'daily', ipa: '/ˈfjuːtʃər/', hint: 'Khoảng thời gian sắp tới' },
  { id: 'b1_20', en: 'Balance', vi: 'Sự cân bằng', level: 'B1', cat: 'daily', ipa: '/ˈbæləns/', hint: 'Trạng thái hài hòa không chao đảo' },
  { id: 'b1_21', en: 'Choice', vi: 'Sự lựa chọn', level: 'B1', cat: 'toeic', ipa: '/tʃɔɪs/', hint: 'Chọn một trong nhiều khả năng' },
  { id: 'b1_22', en: 'Danger', vi: 'Mối nguy hiểm', level: 'B1', cat: 'daily', ipa: '/ˈdeɪndʒər/', hint: 'Mối đe dọa tổn hại' },
  { id: 'b1_23', en: 'Freedom', vi: 'Sự tự do', level: 'B1', cat: 'daily', ipa: '/ˈfriːdəm/', hint: 'Quyền làm chủ cuộc đời mình' },
  { id: 'b1_24', en: 'History', vi: 'Lịch sử', level: 'B1', cat: 'academic', ipa: '/ˈhɪstri/', hint: 'Những sự kiện quá khứ đã qua' },
  { id: 'b1_25', en: 'Justice', vi: 'Công lý', level: 'B1', cat: 'academic', ipa: '/ˈdʒʌstɪs/', hint: 'Lẽ phải và sự công bằng' },
  { id: 'b1_26', en: 'Message', vi: 'Thông điệp', level: 'B1', cat: 'daily', ipa: '/ˈmesɪdʒ/', hint: 'Lời nhắn gửi trao đi' },
  { id: 'b1_27', en: 'Nation', vi: 'Quốc gia', level: 'B1', cat: 'academic', ipa: '/ˈneɪʃn/', hint: 'Đất nước có chủ quyền' },
  { id: 'b1_28', en: 'Planet', vi: 'Hành tinh', level: 'B1', cat: 'academic', ipa: '/ˈplænɪt/', hint: 'Thiên thể quay quanh mặt trời' },
  { id: 'b1_29', en: 'Result', vi: 'Kết quả', level: 'B1', cat: 'toeic', ipa: '/rɪˈzʌlt/', hint: 'Thành quả sau một quá trình' },
  { id: 'b1_30', en: 'Safety', vi: 'Sự an toàn', level: 'B1', cat: 'toeic', ipa: '/ˈseɪfti/', hint: 'Trạng thái yên tâm không rủi ro' },
  { id: 'b1_31', en: 'Talent', vi: 'Tài năng', level: 'B1', cat: 'daily', ipa: '/ˈtælənt/', hint: 'Năng khiếu bẩm sinh xuất sắc' },
  { id: 'b1_32', en: 'Unique', vi: 'Độc đáo', level: 'B1', cat: 'daily', ipa: '/juˈniːk/', hint: 'Duy nhất không trùng lặp' },
  { id: 'b1_33', en: 'Victory', vi: 'Chiến thắng', level: 'B1', cat: 'daily', ipa: '/ˈvɪktəri/', hint: 'Khúc khải hoàn vinh quang' },
  { id: 'b1_34', en: 'Wealth', vi: 'Sự giàu có', level: 'B1', cat: 'toeic', ipa: '/welθ/', hint: 'Của cải và tài sản dồi dào' },
  { id: 'b1_35', en: 'Courage', vi: 'Lòng can đảm', level: 'B1', cat: 'daily', ipa: '/ˈkɜːrɪdʒ/', hint: 'Dũng khí đối mặt gian nan' },
  { id: 'b1_36', en: 'Passion', vi: 'Niềm đam mê', level: 'B1', cat: 'daily', ipa: '/ˈpæʃn/', hint: 'Nhiệt huyết cháy bỏng trong tim' },

  // ========================================================
  // LEVEL B2: TRUNG CAO (UPPER-INTERMEDIATE - 36 words)
  // Business, negotiation, strategy, professional management
  // ========================================================
  { id: 'b2_01', en: 'Strategy', vi: 'Chiến lược', level: 'B2', cat: 'toeic', ipa: '/ˈstrætədʒi/', hint: 'Kế hoạch hành động dài hạn' },
  { id: 'b2_02', en: 'Revenue', vi: 'Doanh thu', level: 'B2', cat: 'toeic', ipa: '/ˈrevənjuː/', hint: 'Tổng tiền thu về từ kinh doanh' },
  { id: 'b2_03', en: 'Contract', vi: 'Hợp đồng', level: 'B2', cat: 'toeic', ipa: '/ˈkɒntrækt/', hint: 'Cam kết pháp lý giữa các bên' },
  { id: 'b2_04', en: 'Agenda', vi: 'Nghị sự', level: 'B2', cat: 'toeic', ipa: '/əˈdʒendə/', hint: 'Danh mục các việc trong cuộc họp' },
  { id: 'b2_05', en: 'Inventory', vi: 'Hàng tồn kho', level: 'B2', cat: 'toeic', ipa: '/ˈɪnvəntri/', hint: 'Danh sách sản phẩm đang lưu kho' },
  { id: 'b2_06', en: 'Candidate', vi: 'Ứng viên', level: 'B2', cat: 'toeic', ipa: '/ˈkændɪdət/', hint: 'Người nộp hồ sơ xin việc' },
  { id: 'b2_07', en: 'Efficiency', vi: 'Hiệu suất', level: 'B2', cat: 'toeic', ipa: '/ɪˈfɪʃnsi/', hint: 'Khả năng làm việc nhanh ít hao phí' },
  { id: 'b2_08', en: 'Benchmark', vi: 'Đối sánh', level: 'B2', cat: 'toeic', ipa: '/ˈbentʃmɑːk/', hint: 'Tiêu chuẩn mẫu để so sánh' },
  { id: 'b2_09', en: 'Expansion', vi: 'Mở rộng', level: 'B2', cat: 'toeic', ipa: '/ɪkˈspænʃn/', hint: 'Gia tăng quy mô và phạm vi' },
  { id: 'b2_10', en: 'Prototype', vi: 'Mẫu thử', level: 'B2', cat: 'tech', ipa: '/ˈprəʊtətaɪp/', hint: 'Bản mẫu sản phẩm ban đầu' },
  { id: 'b2_11', en: 'Budget', vi: 'Ngân sách', level: 'B2', cat: 'toeic', ipa: '/ˈbʌdʒɪt/', hint: 'Kế hoạch tài chính chi tiêu' },
  { id: 'b2_12', en: 'Delegate', vi: 'Ủy quyền', level: 'B2', cat: 'toeic', ipa: '/ˈdelɪɡeɪt/', hint: 'Giao phó công việc cho cấp dưới' },
  { id: 'b2_13', en: 'Voucher', vi: 'Phiếu ưu đãi', level: 'B2', cat: 'toeic', ipa: '/ˈvaʊtʃər/', hint: 'Phiếu giảm giá hoặc đổi hàng' },
  { id: 'b2_14', en: 'Policy', vi: 'Chính sách', level: 'B2', cat: 'toeic', ipa: '/ˈpɒləsi/', hint: 'Quy định hướng dẫn chung' },
  { id: 'b2_15', en: 'Warranty', vi: 'Bảo hành', level: 'B2', cat: 'toeic', ipa: '/ˈwɒrənti/', hint: 'Cam kết sửa chữa miễn phí khi có lỗi' },
  { id: 'b2_16', en: 'Clause', vi: 'Điều khoản', level: 'B2', cat: 'toeic', ipa: '/klɔːz/', hint: 'Mục thỏa thuận trong văn bản luật' },
  { id: 'b2_17', en: 'Negotiate', vi: 'Đàm phán', level: 'B2', cat: 'toeic', ipa: '/nɪˈɡəʊʃieɪt/', hint: 'Thương lượng đi đến thỏa thuận' },
  { id: 'b2_18', en: 'Colleague', vi: 'Đồng nghiệp', level: 'B2', cat: 'toeic', ipa: '/ˈkɒliːɡ/', hint: 'Người cùng làm việc trong cơ quan' },
  { id: 'b2_19', en: 'Diversity', vi: 'Đa dạng', level: 'B2', cat: 'academic', ipa: '/daɪˈvɜːsəti/', hint: 'Nhiều hình thái và sắc thái khác nhau' },
  { id: 'b2_20', en: 'Guarantee', vi: 'Bảo đảm', level: 'B2', cat: 'toeic', ipa: '/ˌɡærənˈtiː/', hint: 'Cam đoan chắc chắn bằng uy tín' },
  { id: 'b2_21', en: 'Motivation', vi: 'Động lực', level: 'B2', cat: 'daily', ipa: '/ˌməʊtɪˈveɪʃn/', hint: 'Ý chí thôi thúc hành động' },
  { id: 'b2_22', en: 'Priority', vi: 'Ưu tiên', level: 'B2', cat: 'toeic', ipa: '/praɪˈɒrəti/', hint: 'Việc cần làm trước việc khác' },
  { id: 'b2_23', en: 'Resource', vi: 'Tài nguyên', level: 'B2', cat: 'toeic', ipa: '/rɪˈsɔːs/', hint: 'Nguồn lực vật chất và con người' },
  { id: 'b2_24', en: 'Solution', vi: 'Giải pháp', level: 'B2', cat: 'toeic', ipa: '/səˈluːʃn/', hint: 'Phương án giải quyết khó khăn' },
  { id: 'b2_25', en: 'Temporary', vi: 'Tạm thời', level: 'B2', cat: 'toeic', ipa: '/ˈtemprəri/', hint: 'Áp dụng trong thời gian ngắn' },
  { id: 'b2_26', en: 'Valuable', vi: 'Quý giá', level: 'B2', cat: 'daily', ipa: '/ˈvæljuəbl/', hint: 'Có giá trị lớn và đáng trân trọng' },
  { id: 'b2_27', en: 'Ambition', vi: 'Tham vọng', level: 'B2', cat: 'daily', ipa: '/æmˈbɪʃn/', hint: 'Khát vọng vươn lên đỉnh cao' },
  { id: 'b2_28', en: 'Courtesy', vi: 'Lịch thiệp', level: 'B2', cat: 'daily', ipa: '/ˈkɜːtəsi/', hint: 'Hành xử nhã nhặn tôn trọng' },
  { id: 'b2_29', en: 'Discipline', vi: 'Kỷ luật', level: 'B2', cat: 'daily', ipa: '/ˈdɪsəplɪn/', hint: 'Tinh thần tự giác chấp hành nội quy' },
  { id: 'b2_30', en: 'Inspiration', vi: 'Cảm hứng', level: 'B2', cat: 'daily', ipa: '/ˌɪnspəˈreɪʃn/', hint: 'Nguồn động viên thúc đẩy sáng tạo' },
  { id: 'b2_31', en: 'Optimism', vi: 'Lạc quan', level: 'B2', cat: 'daily', ipa: '/ˈɒptɪmɪzəm/', hint: 'Luôn tin tưởng vào điều tốt lành' },
  { id: 'b2_32', en: 'Patience', vi: 'Kiên nhẫn', level: 'B2', cat: 'daily', ipa: '/ˈpeɪʃns/', hint: 'Bình tĩnh nhẫn nại đợi chờ' },
  { id: 'b2_33', en: 'Wisdom', vi: 'Thông thái', level: 'B2', cat: 'daily', ipa: '/ˈwɪzdəm/', hint: 'Trí tuệ sâu sắc sáng suốt' },
  { id: 'b2_34', en: 'Sincerity', vi: 'Chân thành', level: 'B2', cat: 'daily', ipa: '/sɪnˈserəti/', hint: 'Thành thật từ đáy lòng' },
  { id: 'b2_35', en: 'Algorithm', vi: 'Thuật toán', level: 'B2', cat: 'tech', ipa: '/ˈælɡərɪðəm/', hint: 'Từng bước giải toán lập trình' },
  { id: 'b2_36', en: 'Architecture', vi: 'Kiến trúc', level: 'B2', cat: 'tech', ipa: '/ˈɑːkɪtektʃər/', hint: 'Mô hình thiết kế cấu trúc hệ thống' },

  // ========================================================
  // LEVEL C1: CAO CẤP (ADVANCED / ACADEMIC - 36 words)
  // Academic research, scientific synthesis, high abstraction
  // ========================================================
  { id: 'c1_01', en: 'Hypothesis', vi: 'Giả thuyết', level: 'C1', cat: 'academic', ipa: '/haɪˈpɒθəsɪs/', hint: 'Định đề khoa học cần chứng minh' },
  { id: 'c1_02', en: 'Empirical', vi: 'Thực nghiệm', level: 'C1', cat: 'academic', ipa: '/ɪmˈpɪrɪkl/', hint: 'Dựa trên quan sát và bằng chứng' },
  { id: 'c1_03', en: 'Synthesize', vi: 'Tổng hợp', level: 'C1', cat: 'academic', ipa: '/ˈsɪnθəsaɪz/', hint: 'Đúc kết nhiều nguồn thành thể thống nhất' },
  { id: 'c1_04', en: 'Paradigm', vi: 'Mô hình mẫu', level: 'C1', cat: 'academic', ipa: '/ˈpærədaɪm/', hint: 'Khung nhận thức tiêu chuẩn mực' },
  { id: 'c1_05', en: 'Methodology', vi: 'Phương pháp luận', level: 'C1', cat: 'academic', ipa: '/ˌmeθəˈdɒlədʒi/', hint: 'Hệ phương pháp tiến hành nghiên cứu' },
  { id: 'c1_06', en: 'Coherent', vi: 'Mạch lạc', level: 'C1', cat: 'academic', ipa: '/kəʊˈhɪərənt/', hint: 'Chặt chẽ và liên kết logic' },
  { id: 'c1_07', en: 'Discrepancy', vi: 'Sai lệch', level: 'C1', cat: 'academic', ipa: '/dɪˈskrepənsi/', hint: 'Bất đồng không ăn khớp giữa số liệu' },
  { id: 'c1_08', en: 'Correlation', vi: 'Tương quan', level: 'C1', cat: 'academic', ipa: '/ˌkɒrəˈleɪʃn/', hint: 'Mối quan hệ biến thiên phụ thuộc nhau' },
  { id: 'c1_09', en: 'Phenomenon', vi: 'Hiện tượng', level: 'C1', cat: 'academic', ipa: '/fəˈnɒmɪnən/', hint: 'Sự việc khách quan diễn ra trong đời sống' },
  { id: 'c1_10', en: 'Abstract', vi: 'Trừu tượng', level: 'C1', cat: 'academic', ipa: '/ˈæbstrækt/', hint: 'Khái niệm phi vật thể mang tính lý thuyết' },
  { id: 'c1_11', en: 'Comprehensive', vi: 'Toàn diện', level: 'C1', cat: 'academic', ipa: '/ˌkɒmprɪˈhensɪv/', hint: 'Bao quát đầy đủ mọi phương diện' },
  { id: 'c1_12', en: 'Qualitative', vi: 'Định tính', level: 'C1', cat: 'academic', ipa: '/ˈkwɒlɪtətɪv/', hint: 'Phân tích bản chất tính chất đặc thù' },
  { id: 'c1_13', en: 'Quantitative', vi: 'Định lượng', level: 'C1', cat: 'academic', ipa: '/ˈkwɒntɪtətɪv/', hint: 'Đo lường bằng dữ liệu số học' },
  { id: 'c1_14', en: 'Pragmatic', vi: 'Thực dụng', level: 'C1', cat: 'academic', ipa: '/præɡˈmætɪk/', hint: 'Thực tế chú trọng vào kết quả ứng dụng' },
  { id: 'c1_15', en: 'Implicit', vi: 'Ngầm ẩn', level: 'C1', cat: 'academic', ipa: '/ɪmˈplɪsɪt/', hint: 'Hàm ý bên trong không nói toạc ra' },
  { id: 'c1_16', en: 'Explicit', vi: 'Minh bạch', level: 'C1', cat: 'academic', ipa: '/ɪkˈsplɪsɪt/', hint: 'Rõ ràng dứt khoát không lập lờ' },
  { id: 'c1_17', en: 'Inherent', vi: 'Cố hữu', level: 'C1', cat: 'academic', ipa: '/ɪnˈhɪərənt/', hint: 'Bản chất gắn liền từ lúc sinh ra' },
  { id: 'c1_18', en: 'Ambiguous', vi: 'Mơ hồ', level: 'C1', cat: 'academic', ipa: '/æmˈbɪɡjuəs/', hint: 'Đa nghĩa có thể suy diễn nhiều chiều' },
  { id: 'c1_19', en: 'Cognitive', vi: 'Nhận thức', level: 'C1', cat: 'academic', ipa: '/ˈkɒɡnətɪv/', hint: 'Thuộc về hoạt động tư duy não bộ' },
  { id: 'c1_20', en: 'Bias', vi: 'Định kiến', level: 'C1', cat: 'academic', ipa: '/ˈbaɪəs/', hint: 'Xu hướng thiên vị một bên thiếu công bằng' },
  { id: 'c1_21', en: 'Viable', vi: 'Khả thi', level: 'C1', cat: 'academic', ipa: '/ˈvaɪəbl/', hint: 'Có thể thực hiện thành công' },
  { id: 'c1_22', en: 'Validate', vi: 'Kiểm chứng', level: 'C1', cat: 'academic', ipa: '/ˈvælɪdeɪt/', hint: 'Xác thực tính hợp lệ đúng đắn' },
  { id: 'c1_23', en: 'Arbitrary', vi: 'Tùy tiện', level: 'C1', cat: 'academic', ipa: '/ˈɑːbɪtrəri/', hint: 'Tùy hứng không căn cứ vào nguyên tắc' },
  { id: 'c1_24', en: 'Premise', vi: 'Tiền đề', level: 'C1', cat: 'academic', ipa: '/ˈpremɪs/', hint: 'Cơ sở nền tảng làm tiền đề suy luận' },
  { id: 'c1_25', en: 'Cryptography', vi: 'Mật mã học', level: 'C1', cat: 'tech', ipa: '/krɪpˈtɒɡrəfi/', hint: 'Khoa học mã hóa dữ liệu an toàn' },
  { id: 'c1_26', en: 'Latency', vi: 'Độ trễ', level: 'C1', cat: 'tech', ipa: '/ˈleɪtənsi/', hint: 'Thời gian trễ trong phản hồi tín hiệu' },
  { id: 'c1_27', en: 'Protocol', vi: 'Giao thức', level: 'C1', cat: 'tech', ipa: '/ˈprəʊtəkɒl/', hint: 'Bộ quy ước kết nối mạng' },
  { id: 'c1_28', en: 'Scalability', vi: 'Khả năng mở rộng', level: 'C1', cat: 'tech', ipa: '/ˌskeɪləˈbɪləti/', hint: 'Năng lực chịu tải tăng cao' },
  { id: 'c1_29', en: 'Resilience', vi: 'Kiên cường', level: 'C1', cat: 'daily', ipa: '/rɪˈzɪliəns/', hint: 'Khả năng hồi phục nhanh sau biến cố' },
  { id: 'c1_30', en: 'Compassion', vi: 'Lòng trắc ẩn', level: 'C1', cat: 'daily', ipa: '/kəmˈpæʃn/', hint: 'Tấm lòng thấu cảm chia sẻ nỗi đau' },
  { id: 'c1_31', en: 'Integrity', vi: 'Chính trực', level: 'C1', cat: 'daily', ipa: '/ɪnˈteɡrəti/', hint: 'Ngay thẳng liêm khiết không vụ lợi' },
  { id: 'c1_32', en: 'Perseverance', vi: 'Kiên trì', level: 'C1', cat: 'daily', ipa: '/ˌpɜːsɪˈvɪərəns/', hint: 'Bền bỉ tiến bước không từ bỏ' },
  { id: 'c1_33', en: 'Humility', vi: 'Khiêm nhường', level: 'C1', cat: 'daily', ipa: '/hjuːˈmɪləti/', hint: 'Thái độ nhún nhường không kiêu căng' },
  { id: 'c1_34', en: 'Diligence', vi: 'Cần cù', level: 'C1', cat: 'daily', ipa: '/ˈdɪlɪdʒəns/', hint: 'Siêng năng tỉ mỉ chu đáo' },
  { id: 'c1_35', en: 'Generosity', vi: 'Hào phóng', level: 'C1', cat: 'daily', ipa: '/ˌdʒenəˈrɒsəti/', hint: 'Rộng lượng sẵn sàng sẻ chia' },
  { id: 'c1_36', en: 'Empathy', vi: 'Thấu cảm', level: 'C1', cat: 'daily', ipa: '/ˈempəθi/', hint: 'Khả năng đặt mình vào vị trí người khác' }
];

export const VOCABULARY_LIST = VOCABULARY_DATA;

/**
 * Filter vocabulary by CEFR Level ('A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'all')
 */
export function getVocabPoolByLevel(level: CEFRLevel | 'all'): VocabItem[] {
  if (level === 'all' || !level) {
    return VOCABULARY_DATA;
  }
  return VOCABULARY_DATA.filter(v => v.level === level);
}

/**
 * Filter vocabulary by Category ('daily' | 'toeic' | 'academic' | 'tech' | 'a1' | 'mixed')
 */
export function getVocabPoolByCategory(category: string): VocabItem[] {
  if (!category || category === 'mixed' || category === 'all') {
    return VOCABULARY_DATA;
  }
  // If user passed a CEFR level directly as category (e.g. 'a1', 'a2', 'b1', 'b2', 'c1')
  const upper = category.toUpperCase();
  if (['A1', 'A2', 'B1', 'B2', 'C1'].includes(upper)) {
    return getVocabPoolByLevel(upper as CEFRLevel);
  }
  return VOCABULARY_DATA.filter(v => v.cat === category);
}

/**
 * Pick a random vocabulary item from a pool, avoiding immediate repetition
 */
export function getRandomVocab(pool: VocabItem[], excludeEn?: string): VocabItem {
  const filtered = excludeEn ? pool.filter(p => p.en !== excludeEn) : pool;
  if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
