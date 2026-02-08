import React, { useState } from 'react';
import { ArrowLeft, Trophy, X, Lock, Check } from 'lucide-react';
// FIX: Import Avatar types from `types.ts` and the AVATAR_ITEMS constant from `constants.ts`.
import { AVATAR_ITEMS } from '../constants';
import { AvatarConfig, AvatarItem, AvatarPartType } from '../types';
import { Avatar } from '../components/Avatar';

interface EngagementViewProps {
  onBack: () => void;
  xp: number;
  avatarConfig: AvatarConfig;
  unlockedItems: string[];
  onPurchaseItem: (item: AvatarItem) => void;
  onEquipItem: (item: AvatarItem) => void;
}

export const EngagementView: React.FC<EngagementViewProps> = ({ 
  onBack, xp, avatarConfig, unlockedItems, onPurchaseItem, onEquipItem 
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const level = Math.floor(xp / 200);
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700">
        <button onClick={onBack} className="p-1"><ArrowLeft /></button>
        <h2 className="text-xl font-bold">My Engagement</h2>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white/20 rounded-2xl border-4 border-white/20 shadow-inner mb-4">
               <Avatar config={avatarConfig} size={96} />
            </div>
            <h3 className="text-4xl font-black">Level {level}</h3>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full w-fit mt-4">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-lg font-black tracking-tight">{xp} XP</span>
            </div>
             <button 
                onClick={() => setIsEditorOpen(true)}
                className="w-full mt-6 py-3 bg-white text-indigo-600 font-bold rounded-xl active:scale-95 transition-transform"
             >
                Avatar Studio
             </button>
        </div>
      </div>
      
      {isEditorOpen && (
        <AvatarStudio
          onClose={() => setIsEditorOpen(false)}
          xp={xp}
          unlockedItems={unlockedItems}
          avatarConfig={avatarConfig}
          onPurchase={onPurchaseItem}
          onEquip={onEquipItem}
        />
      )}
    </div>
  );
};

const AvatarStudio = ({ onClose, xp, unlockedItems, avatarConfig, onPurchase, onEquip }: any) => {
    const [activeTab, setActiveTab] = useState<AvatarPartType>('head');
    const itemsForTab = AVATAR_ITEMS.filter(i => i.type === activeTab);

    return (
        <div className="absolute inset-0 bg-black/40 z-50 animate-in fade-in duration-300 flex flex-col justify-end">
            <div className="bg-gray-100 dark:bg-gray-900 h-[80%] rounded-t-3xl flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-bold">Avatar Studio</h3>
                    <button onClick={onClose} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><X size={16}/></button>
                </div>
                
                <div className="p-4 flex justify-around bg-white dark:bg-gray-800">
                    {(['head', 'accessory', 'outfit'] as AvatarPartType[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${activeTab === tab ? 'bg-leeds-blue text-white' : 'text-gray-500'}`}>{tab}</button>
                    ))}
                </div>

                <div className="flex-1 p-4 overflow-y-auto grid grid-cols-3 gap-4">
                    {itemsForTab.map(item => {
                        const isUnlocked = unlockedItems.includes(item.id);
                        const isEquipped = (avatarConfig[item.type] === item.id);
                        const canAfford = xp >= item.cost;
                        return (
                            <div key={item.id} className="flex flex-col items-center gap-2">
                                <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-4xl ${isEquipped ? 'bg-leeds-blue/20' : 'bg-white dark:bg-gray-800'}`}>
                                    {item.icon}
                                </div>
                                {!isUnlocked ? (
                                    <button 
                                        disabled={!canAfford}
                                        onClick={() => onPurchase(item)}
                                        className="w-full text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 disabled:bg-gray-200 disabled:text-gray-400 bg-yellow-400 text-black"
                                    >
                                        <Lock size={12} /> {item.cost} XP
                                    </button>
                                ) : (
                                    <button 
                                        disabled={isEquipped}
                                        onClick={() => onEquip(item)}
                                        className="w-full text-xs font-bold py-2 rounded-lg disabled:bg-green-500 disabled:text-white bg-gray-200 dark:bg-gray-700"
                                    >
                                        {isEquipped ? <Check size={12}/> : 'Equip'}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
