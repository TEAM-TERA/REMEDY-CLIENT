export type Profile = {
    username: string;
    profileImageUrl?: string | null;
    gender?: boolean | null;
    birthDate?: string | null;
};
  
  export type UpdateProfilePayload = Partial<{
    username: string;
    gender: boolean;
    birthDate: string;
}>;
  
  export type UpdateProfileResponse = {
    message: string;
};