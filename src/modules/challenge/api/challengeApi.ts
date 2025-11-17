import axiosInstance from "../../auth/api/axiosInstance";
import type { Achievement, CreateAchievementPayload, ActiveAchievementsPage, UserCurrency } from "../types/achievement";

const BASE = '/achievements';

// 전체 도전과제 가져오기
export async function getAllAchievements() {
    const { data } = await axiosInstance.get<Achievement[]>(BASE);
    return data;
}

// 활성 도전과제 조회 (페이지)
export async function getActiveAchievements(params?: { period?: 'DAILY' | 'PERMANENT'; page?: number; size?: number; }) {
    const { data } = await axiosInstance.get<ActiveAchievementsPage>(`${BASE}`, { params });
    return data; // { achievements: [...], paging ... }
}

// 내 통화 정보 조회
export async function getMyCurrency() {
    const { data } = await axiosInstance.get<UserCurrency>(`/currency`);
    return data;
}

// 도전과제 생성 (관리자 전용)
export async function createAchievement(payload: CreateAchievementPayload) {
    const { data } = await axiosInstance.post<Achievement>(BASE, payload);
    return data;
}

// 도전과제 수정 (관리자 전용)
export async function updateAchievement(achievementId: number, payload: Partial<CreateAchievementPayload>) {
    const { data } = await axiosInstance.patch<Achievement>(`${BASE}/${achievementId}`, payload);
    return data;
}

// 도전과제 활성화 (관리자 전용)
export async function activateAchievement(achievementId: number) {
    await axiosInstance.post(`${BASE}/${achievementId}/activate`);
}

// 도전과제 비활성화 (관리자 전용)
export async function deactivateAchievement(achievementId: number) {
    await axiosInstance.post(`${BASE}/${achievementId}/deactivate`);
}

// 보상 수령
export async function claimAchievementReward(achievementId: number) {
    const { data } = await axiosInstance.post(`${BASE}/${achievementId}/claim`);
    return data;
}
