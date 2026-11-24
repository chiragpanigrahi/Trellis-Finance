import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    set => ({
      token: null,
      user:  null,
      login: data => set({
        token: data.token,
        user: {
          id:             data.userId,
          email:          data.email,
          fullName:       data.fullName,
          role:           data.role,
          organizationId: data.organizationId,
        },
      }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'trellis-auth' }
  )
);

export default useAuthStore;
