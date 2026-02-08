import React from 'react';
// FIX: Import AvatarConfig type from `types.ts` and the AVATAR_ITEMS constant from `constants.ts`.
import { AVATAR_ITEMS } from '../constants';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ config, size = 96 }) => {
  const headItem = AVATAR_ITEMS.find(item => item.id === config.head);
  const accessoryItem = AVATAR_ITEMS.find(item => item.id === config.accessory);
  const outfitItem = AVATAR_ITEMS.find(item => item.id === config.outfit);

  const iconSize = size * 0.5;
  const accessorySize = size * 0.4;

  return (
    <div 
      className="relative flex items-center justify-center rounded-2xl" 
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute flex items-center justify-center text-center"
        style={{ fontSize: iconSize, top: size * 0.2 }}
      >
        {outfitItem?.icon}
      </div>
      <div 
        className="absolute flex items-center justify-center"
        style={{ fontSize: iconSize }}
      >
        {headItem?.icon}
      </div>
      {accessoryItem && accessoryItem.id !== 'acc_none' && (
        <div
          className="absolute flex items-center justify-center"
          style={{ fontSize: accessorySize, top: -size * 0.1, zIndex: 1 }}
        >
          {accessoryItem.icon}
        </div>
      )}
    </div>
  );
};
