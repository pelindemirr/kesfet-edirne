import { create } from 'zustand';

export const PROFILE_AVATARS = [
  { id: 'man', label: 'Klasik', source: require('../assets/profil/man.png') },
  { id: 'man2', label: 'Sportif', source: require('../assets/profil/man2.png') },
  { id: 'woman', label: 'Modern', source: require('../assets/profil/woman.png') },
  { id: 'woman2', label: 'Zarif', source: require('../assets/profil/woman2.png') },
] as const;
export type ProfileAvatarId = (typeof PROFILE_AVATARS)[number]['id'];

export type ProfileState = {
  displayName: string;
  avatarId: ProfileAvatarId;
  setDisplayName: (displayName: string) => void;
  setAvatarId: (avatarId: ProfileAvatarId) => void;
  setProfile: (payload: { displayName?: string; avatarId?: ProfileAvatarId }) => void;
  resetProfile: () => void;
};

const defaultDisplayName = 'Kullanici';
const defaultAvatarId: ProfileAvatarId = 'woman';

export const useProfileStore = create<ProfileState>()(
  (set) => ({
    displayName: defaultDisplayName,
    avatarId: defaultAvatarId,
    setDisplayName: (displayName: string) =>
      set({ displayName: displayName.trim() || defaultDisplayName }),
    setAvatarId: (avatarId: ProfileAvatarId) => set({ avatarId }),
    setProfile: (payload) =>
      set((state) => ({
        displayName: payload.displayName?.trim() || state.displayName || defaultDisplayName,
        avatarId: payload.avatarId ?? state.avatarId,
      })),
    resetProfile: () => set({ displayName: defaultDisplayName, avatarId: defaultAvatarId }),
  }),
);

export function getProfileAvatar(avatarId: ProfileAvatarId) {
  return PROFILE_AVATARS.find((avatar) => avatar.id === avatarId) ?? PROFILE_AVATARS[0];
}
