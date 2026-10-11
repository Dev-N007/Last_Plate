import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { api } from '../api/client';

export interface PersonaCapabilities {
  canListSurplus: boolean;
  canClaimSurplus: boolean;
  canVerifyHandover: boolean;
  canRunCoordinatorAgent: boolean;
  badgeLabel: string;
  description: string;
}

export const PERSONA_PROFILES: Record<UserRole, User & { capabilities: PersonaCapabilities }> = {
  provider: {
    id: 'usr-provider-1',
    name: 'Campus Central Dining',
    role: 'provider',
    organization: 'Delhi Tech University Dining Services',
    contact_email: 'dining@dtu.ac.in',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString(),
    capabilities: {
      canListSurplus: true,
      canClaimSurplus: false,
      canVerifyHandover: true,
      canRunCoordinatorAgent: false,
      badgeLabel: 'Surplus Food Provider',
      description: 'Authorized to publish kitchen surplus, specify deadlines, and verify pickup codes at collection counter.'
    }
  },
  recipient: {
    id: 'usr-recipient-1',
    name: 'Hostel Food Committee',
    role: 'recipient',
    organization: 'Campus Student Council',
    contact_email: 'hostel.food@dtu.ac.in',
    phone: '+91 98444 55667',
    created_at: new Date().toISOString(),
    capabilities: {
      canListSurplus: false,
      canClaimSurplus: true,
      canVerifyHandover: false,
      canRunCoordinatorAgent: false,
      badgeLabel: 'Community Recipient',
      description: 'Authorized to browse marketplace, reserve portions, and receive collection reference codes.'
    }
  },
  coordinator: {
    id: 'usr-coord-1',
    name: 'Regional Dispatch Coordinator',
    role: 'coordinator',
    organization: 'Central Food Rescue Network',
    contact_email: 'coordinator@lastplate.org',
    phone: '+91 98777 88990',
    created_at: new Date().toISOString(),
    capabilities: {
      canListSurplus: false,
      canClaimSurplus: false,
      canVerifyHandover: true,
      canRunCoordinatorAgent: true,
      badgeLabel: 'Regional Coordinator',
      description: 'Full operational access to the autonomous AI priority dispatcher and regional network metrics.'
    }
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  capabilities: PersonaCapabilities;
  loginAsPersona: (role: UserRole) => void;
  loginWithCredentials: (email: string, role?: UserRole) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: (targetRole?: UserRole) => void;
  closeLoginModal: () => void;
  targetRoleForModal: UserRole | null;
  refreshKey: number;
  triggerRefresh: () => void;
  resetDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('lastplate_role');
    return (saved as UserRole) || 'recipient';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('lastplate_auth');
    return saved !== 'false';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetRoleForModal, setTargetRoleForModal] = useState<UserRole | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('lastplate_role', role);
    localStorage.setItem('lastplate_auth', isAuthenticated ? 'true' : 'false');
  }, [role, isAuthenticated]);

  const loginAsPersona = (newRole: UserRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setTargetRoleForModal(null);
  };

  const loginWithCredentials = (email: string, preferredRole: UserRole = 'recipient') => {
    setRole(preferredRole);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setTargetRoleForModal(null);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const openLoginModal = (targetRole?: UserRole) => {
    if (targetRole) setTargetRoleForModal(targetRole);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setTargetRoleForModal(null);
  };

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const resetDemoData = async () => {
    try {
      await api.resetDemoData();
      triggerRefresh();
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
  };

  const currentProfile = PERSONA_PROFILES[role];
  const user = isAuthenticated ? currentProfile : null;
  const capabilities = currentProfile.capabilities;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        capabilities,
        loginAsPersona,
        loginWithCredentials,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        targetRoleForModal,
        refreshKey,
        triggerRefresh,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
