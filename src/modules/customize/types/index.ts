export interface CustomizeOption {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  icon?: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  isSelected: boolean;
}

export interface CustomizeSettings {
  theme: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notifications: boolean;
  darkMode: boolean;
}