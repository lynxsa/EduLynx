// Shared mock user profile data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  language: string;
  notificationsEnabled: boolean;
}

export const userProfile: UserProfile = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=3',
  bio: 'Aspiring NSC student passionate about science and math.',
  language: 'English',
  notificationsEnabled: true,
};
