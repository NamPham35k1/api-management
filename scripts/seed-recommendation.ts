import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { User } from '../models/user.model';
import { Channel } from '../models/channel.model';
import { Interaction } from '../models/interaction.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-management';

// Hàm parser nội dung M3U cơ bản
function parseM3UContent(content: string) {
  try {
    const lines = content.split('\n');
    const channels = [];
    
    let currentChannel: any = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('#EXTINF:')) {
        currentChannel = {};
        
        // Trích xuất channelId (tvg-id)
        const idMatch = trimmedLine.match(/tvg-id="([^"]+)"/);
        // Trích xuất category (group-title)
        const groupMatch = trimmedLine.match(/group-title="([^"]+)"/);
        // Trích xuất logo (tvg-logo)
        const logoMatch = trimmedLine.match(/tvg-logo="([^"]+)"/);
        // Trích xuất tên (nằm sau dấu phẩy cuối cùng trên dòng #EXTINF)
        const nameMatch = trimmedLine.match(/,(.+)$/);
        
        // Nếu không có tvg-id, tự tạo một ID tạm thời từ tên hoặc random
        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
        currentChannel.name = name;
        currentChannel.channelId = idMatch ? idMatch[1] : name.replace(/\s+/g, '_').toUpperCase() + '_' + Date.now();
        currentChannel.category = groupMatch ? groupMatch[1] : 'Unknown';
        if (logoMatch) currentChannel.logo = logoMatch[1];
        
        currentChannel.isGlobal = true;
      } else if (trimmedLine && !trimmedLine.startsWith('#')) {
        // Đây thường là dòng chứa stream URL
        if (currentChannel) {
          currentChannel.streamUrl = trimmedLine;
          channels.push(currentChannel);
          currentChannel = null;
        }
      }
    }
    return channels;
  } catch (error) {
    console.error(`Lỗi khi parse nội dung M3U:`, error);
    return [];
  }
}

// Danh sách các user "mồi" đại diện cho các nhóm sở thích khác nhau
const seedUsers = [
  { email: 'fan_vtv@example.com', name: 'Fan VTV', password: 'password', keywords: ['vtv'] },
  { email: 'fan_htv_thvl@example.com', name: 'Fan HTV & THVL', password: 'password', keywords: ['htv', 'thvl', 'vĩnh long', 'vinh long'] },
  { email: 'fan_thethao@example.com', name: 'Fan Thể Thao', password: 'password', keywords: ['sport', 'thể thao', 'bóng đá', 'vtv6', 'on football'] },
  { email: 'fan_phim@example.com', name: 'Fan Phim', password: 'password', keywords: ['phim', 'movie', 'hbo', 'cinema', 'drama', 'sctv9'] },
  { email: 'fan_tintuc@example.com', name: 'Fan Tin Tức', password: 'password', keywords: ['news', 'tin tức', 'thời sự', 'vtv1', 'quốc hội', 'vnews'] },
  { email: 'fan_thieunhi@example.com', name: 'Fan Thiếu Nhi', password: 'password', keywords: ['kid', 'cartoon', 'disney', 'thiếu nhi', 'hoạt hình', 'bibi'] }
];

const seedRecommendationData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB để tạo training data...');

    // Lấy đường dẫn file hoặc URL .m3u từ tham số dòng lệnh
    const m3uSource = process.argv[2]; 
    let channelsToSeed: any[] = [];

    if (m3uSource) {
      if (m3uSource.startsWith('http://') || m3uSource.startsWith('https://')) {
        console.log(`Đang tải và parse file M3U từ URL: ${m3uSource}`);
        const response = await fetch(m3uSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const m3uContent = await response.text();
        channelsToSeed = parseM3UContent(m3uContent);
      } else if (fs.existsSync(m3uSource)) {
        console.log(`Đang parse file M3U từ file local: ${m3uSource}`);
        const m3uContent = fs.readFileSync(m3uSource, 'utf8');
        channelsToSeed = parseM3UContent(m3uContent);
      } else {
        console.log(`Nguồn M3U không hợp lệ hoặc file không tồn tại: ${m3uSource}`);
      }
      
      console.log(`Parse thành công ${channelsToSeed.length} kênh từ nguồn cung cấp.`);
    } 

    if (!m3uSource || channelsToSeed.length === 0) {
      console.log('Sử dụng danh sách mặc định vì không có dữ liệu M3U được cung cấp...');
      channelsToSeed = [
        { channelId: 'VTV1', name: 'VTV1 Thời Sự', category: 'News', streamUrl: 'http://vtv1.com', isGlobal: true },
        { channelId: 'VTV3', name: 'VTV3 Giải Trí', category: 'Entertainment', streamUrl: 'http://vtv3.com', isGlobal: true },
        { channelId: 'HBO', name: 'HBO Phim Truyện', category: 'Movies', streamUrl: 'http://hbo.com', isGlobal: true },
        { channelId: 'MTV', name: 'MTV Âm Nhạc', category: 'Music', streamUrl: 'http://mtv.com', isGlobal: true },
        { channelId: 'ESPN', name: 'ESPN Thể Thao', category: 'Sports', streamUrl: 'http://espn.com', isGlobal: true }
      ];
    }

    // 1. Lưu Channels vào DB
    let seedCount = 0;
    for (const chData of channelsToSeed) {
      if (chData.streamUrl && chData.name) {
        await Channel.findOneAndUpdate({ channelId: chData.channelId }, chData, { upsert: true, new: true });
        seedCount++;
      }
    }
    console.log(`Đã seed/cập nhật ${seedCount} channels vào DB.`);

    // 2. Tạo Seed Users và Interactions
    const hashedPassword = await bcrypt.hash('123456', 10);
    const dbChannels = await Channel.find();

    for (const userData of seedUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create({
          email: userData.email,
          password: hashedPassword,
          name: userData.name
        });
      }

      for (const channel of dbChannels) {
        let score = 0;
        let clickCount = 0;
        let watchDuration = 0;

        // Kiểm tra xem channel có thuộc sở thích của user không (dựa trên tên kênh hoặc thể loại)
        const channelName = channel.name ? channel.name.toLowerCase() : '';
        const channelCategory = channel.category ? channel.category.toLowerCase() : '';
        
        const isMatch = userData.keywords.some(kw => 
          channelName.includes(kw) || channelCategory.includes(kw)
        );

        if (isMatch) {
          score = Math.floor(Math.random() * 50) + 50; 
          clickCount = Math.floor(Math.random() * 20) + 5;
          watchDuration = Math.floor(Math.random() * 3600) + 600; 
        } else {
          if (Math.random() > 0.8) {
            score = Math.floor(Math.random() * 20); 
            clickCount = 1;
            watchDuration = Math.floor(Math.random() * 300);
          }
        }

        if (score > 0) {
          await Interaction.findOneAndUpdate(
            { userId: user._id, channelId: channel.channelId },
            { clickCount, watchDuration, interactionScore: score, lastWatchedAt: new Date() },
            { upsert: true }
          );
        }
      }
    }
    
    console.log(`Đã seed tương tác (interactions) cho ${seedUsers.length} users mồi.`);
    await mongoose.connection.close();
    console.log('Hoàn thành seed training data cho Recommendation API.');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedRecommendationData();
