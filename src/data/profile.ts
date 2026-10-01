import { Profile } from '../types/profile'

/** Used to seed Realtime Database the first time, and as a fallback while Firebase is not configured. */
export const DEFAULT_PROFILE: Profile = {
  name: 'Phutawan Satusean',
  tagline: 'Student · Developer · Problem Solver',
  bio: 'สนใจด้านเทคโนโลยี การพัฒนาโปรแกรม และการสร้างสรรค์สิ่งใหม่ ๆ ชอบเรียนรู้สิ่งที่ท้าทาย และอยากใช้เทคโนโลยีเพื่อแก้ปัญหาจริงในอนาคต',
  location: 'Thailand',
  email: 'phutawan@email.com',
  birthDate: '2007-10-07',
  avatarUrl: '',
  avatarPath: '',
  about:
    "I'm a student based in Thailand, working across web development, AI, and hardware projects.\n\nI enjoy taking an idea from a rough problem statement to something people can actually use.",
}
