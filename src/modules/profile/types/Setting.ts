import React from 'react';

export type SettingItemProps = {
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightText?: string;
  isDestructive?: boolean;
};

export type SettingSectionProps = {
  title: string;
  children: React.ReactNode;
};
