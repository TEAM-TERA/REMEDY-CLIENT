import axiosInstance from "../../auth/api/axiosInstance";

interface RunningRecord {
    distanceKm: number;
    durationSec: number;
    songId: string[];
    startedAt: string;
    endedAt: string;
}

export const saveRunningRecord = async (runningRecord: RunningRecord) => {
    const response = await axiosInstance.post('/running/record', runningRecord);
    return response.data;
}