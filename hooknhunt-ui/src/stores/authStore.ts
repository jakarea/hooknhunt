import { create } from 'zustand';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'seller' | 'store_keeper' | 'marketer' | 'retail_customer' | 'wholesale_customer';
    phone_number: string;
    whatsapp_number?: string;
    otp_code?: string;
    otp_expires_at?: string;
    phone_verified_at?: string;
    created_at: string;
    updated_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    hydrated: boolean; // Track if we've loaded from localStorage
    isAuthenticated: () => boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    loadUserFromStorage: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    hydrated: false,
    isAuthenticated: () => get().token !== null,

    login: (token, user) => {
        console.log('🔑 authStore.login() called');
        console.log('🔑 Token to save:', token);
        console.log('🔑 User to save:', user);

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('✅ Saved to localStorage');
        console.log('📦 Verify token in storage:', localStorage.getItem('token'));
        console.log('📦 Verify user in storage:', localStorage.getItem('user'));

        // Set state
        set({ user, token, hydrated: true });
        console.log('✅ State updated');
    },

    logout: () => {
        console.log('🚪 Logging out...');
        // Clear from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear state
        set({ user: null, token: null, hydrated: true });

        // Redirect to login
        window.location.href = '/login';
    },

    loadUserFromStorage: () => {
        console.log('🔄 Loading user from storage...');
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        console.log('📦 Token from storage:', token);
        console.log('📦 User from storage:', userString);

        if (token && userString) {
            try {
                const user = JSON.parse(userString) as User;
                set({ user, token, hydrated: true });
                console.log('✅ User loaded from storage successfully');
                console.log('✅ Store hydrated: true');
            } catch (error) {
                console.error('❌ Failed to parse user from localStorage:', error);
                // Clear corrupted storage
                set({ hydrated: true });
                get().logout();
            }
        } else {
            console.log('⚠️ No token or user found in storage');
            set({ hydrated: true });
            console.log('✅ Store hydrated: true (but no data)');
        }
    },

    setUser: (user) => {
        // Update user in both state and localStorage
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
}));

// Load from storage immediately when the store is created (outside React lifecycle)
console.log('🏪 Initializing authStore...');
useAuthStore.getState().loadUserFromStorage();
