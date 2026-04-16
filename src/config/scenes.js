/**
 * 场景配置
 * 定义所有可用的练习场景
 */

export const SCENES = [
  {
    id: 'cafe',
    name: '咖啡厅',
    nameEn: 'Cafe Lounge',
    description: '在咖啡厅点单和聊天',
    descriptionEn: 'Order and chat at a cafe',
    difficulty: 1,
    icon: '☕',
    image: '/assets/scenes/cafe.jpg',
    unlocked: true,
    objectives: [
      '学习点单用语',
      '练习描述口味偏好',
      '掌握询问价格的表达'
    ],
    vocabulary: [
      'coffee', 'tea', 'milk', 'sugar', 'order', 'bill', 'tip'
    ]
  },
  {
    id: 'airport',
    name: '机场',
    nameEn: 'Airport',
    description: '办理登机手续和过海关',
    descriptionEn: 'Check-in and go through customs',
    difficulty: 3,
    icon: '✈️',
    image: '/assets/scenes/airport.jpg',
    unlocked: false,
    objectives: [
      '学习办理登机手续',
      '练习回答海关问题',
      '掌握询问航班信息的表达'
    ],
    vocabulary: [
      'flight', 'boarding pass', 'luggage', 'customs', 'passport', 'gate'
    ]
  },
  {
    id: 'restaurant',
    name: '餐厅',
    nameEn: 'Restaurant',
    description: '在餐厅用餐',
    descriptionEn: 'Dine at a restaurant',
    difficulty: 2,
    icon: '🍽️',
    image: '/assets/scenes/restaurant.jpg',
    unlocked: false,
    objectives: [
      '学习预订座位',
      '练习点菜',
      '掌握特殊饮食要求的表达'
    ],
    vocabulary: [
      'menu', 'reservation', 'appetizer', 'main course', 'dessert', 'allergy'
    ]
  },
  {
    id: 'hotel',
    name: '酒店',
    nameEn: 'Hotel',
    description: '办理入住和退房',
    descriptionEn: 'Check-in and check-out',
    difficulty: 2,
    icon: '🏨',
    image: '/assets/scenes/hotel.jpg',
    unlocked: false,
    objectives: [
      '学习办理入住手续',
      '练习提出特殊要求',
      '掌握询问酒店设施的表达'
    ],
    vocabulary: [
      'reservation', 'check-in', 'check-out', 'room service', 'amenities', 'booking'
    ]
  },
  {
    id: 'office',
    name: '办公室',
    nameEn: 'Office',
    description: '商务会议和日常交流',
    descriptionEn: 'Business meeting and daily communication',
    difficulty: 3,
    icon: '💼',
    image: '/assets/scenes/office.jpg',
    unlocked: false,
    objectives: [
      '学习商务会议用语',
      '练习自我介绍',
      '掌握工作相关表达'
    ],
    vocabulary: [
      'meeting', 'presentation', 'deadline', 'project', 'colleague', 'schedule'
    ]
  },
  {
    id: 'shopping',
    name: '购物',
    nameEn: 'Shopping',
    description: '在商店购物',
    descriptionEn: 'Shop at a store',
    difficulty: 2,
    icon: '🛒',
    image: '/assets/scenes/shopping.jpg',
    unlocked: false,
    objectives: [
      '学习询问商品信息',
      '练习讨价还价',
      '掌握退换货表达'
    ],
    vocabulary: [
      'price', 'discount', 'size', 'color', 'refund', 'exchange'
    ]
  }
];

// 难度等级配置
export const DIFFICULTY_LEVELS = {
  1: { label: '初级', labelEn: 'Beginner', color: '#4ade80' },
  2: { label: '中级', labelEn: 'Intermediate', color: '#facc15' },
  3: { label: '高级', labelEn: 'Advanced', color: '#f87171' }
};

export default {
  SCENES,
  DIFFICULTY_LEVELS
};