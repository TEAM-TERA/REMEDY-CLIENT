import axiosInstance from "../../auth/api/axiosInstance";
import type { Achievement, CreateAchievementPayload, UserAchievementListResponse } from "../types/achievement";

const BASE = '/achievements';

// 전체 도전과제 가져오기
export async function getAllAchievements() {
    const { data } = await axiosInstance.get<Achievement[]>(BASE);
    return data;
}

// 활성화된 도전과제 가져오기
export async function getActiveAchievements() {
    const { data } = await axiosInstance.get<Achievement[]>(`${BASE}/active`);
    return data;
}

// 내 도전과제 조회
export async function getMyAchievements() {
    const { data } = await axiosInstance.get<UserAchievementListResponse>(`${BASE}/my`);
    return data.achievements;
}

// 도전과제 생성 (관리자 전용)
export async function createAchievement(payload: CreateAchievementPayload) {
    const { data } = await axiosInstance.post<Achievement>(BASE, payload);
    return data;
}

// 도전과제 수정 (관리자 전용)
export async function updateAchievement(achievementId: number, payload: Partial<CreateAchievementPayload>) {
    const { data } = await axiosInstance.put<Achievement>(`${BASE}/${achievementId}`, payload);
    return data;
}

// 도전과제 활성화 (관리자 전용)
export async function activateAchievement(achievementId: number) {
    const { data } = await axiosInstance.post<Achievement>(`${BASE}/${achievementId}/activate`);
    return data;
}

// 도전과제 비활성화 (관리자 전용)
export async function deactivateAchievement(achievementId: number) {
    const { data } = await axiosInstance.post<Achievement>(`${BASE}/${achievementId}/deactivate`);
    return data;
}
