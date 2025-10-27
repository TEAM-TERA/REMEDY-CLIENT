// 백엔드 AchievementType.java 참고
export type AchievementType =
  | 'DROPPING_COUNT'    // 드로핑 횟수
  | 'WALKING_DISTANCE'  // 걸은 거리(km)
  | 'LISTENING_COUNT';  // 노래 청취 횟수

// 백엔드 AchievementPeriod.java 참고
export type AchievementPeriod =
  | 'DAILY'      // 일일 도전과제 (매일 초기화)
  | 'PERMANENT'; // 상시 도전과제 (누적)

// 백엔드 AchievementResponse.java 참고
export interface Achievement {
  achievementId: number;
  title: string;
  type: AchievementType;
  typeDescription: string;
  period: AchievementPeriod;
  periodDescription: string;
  targetValue: number;
  rewardAmount: number;
  isActive: boolean;
}

// 백엔드 UserAchievementResponse + Achievement 조합
export interface UserAchievement {
  userAchievementId: number;
  userId: number;
  achievement: Achievement;  // Achievement 전체 객체 포함
  currentValue: number;
  isCompleted: boolean;
  isRewardClaimed: boolean;
  completedAt: string | null;
  rewardClaimedAt: string | null;
}

// API 응답 래퍼
export interface UserAchievementListResponse {
  achievements: UserAchievement[];
  totalCount: number;
  completedCount: number;
  unclaimedRewardCount: number;
}

export interface CreateAchievementPayload {
  title: string;
  type: AchievementType;
  period: AchievementPeriod;
  targetValue: number;
  rewardAmount: number;
}

// 새로운 활성 도전과제 응답 (플랫 구조)
export interface ActiveAchievement {
  userAchievementId: number;
  achievementId: number;
  title: string;
  targetValue: number;
  currentProgress: number;
  progressPercentage: number;
  rewardAmount: number;
  isCompleted: boolean;
  isRewardClaimed: boolean;
  completedAt: string | null;
  rewardClaimedAt: string | null;
}

export interface ActiveAchievementsPage {
  achievements: ActiveAchievement[];
  totalCount: number;
  completedCount: number;
  unclaimedRewardCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserCurrency {
  userCurrencyId: number;
  userId: number;
  amount: number;
  updatedAt: string;
}