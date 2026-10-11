import React, { createContext, useContext, useState } from 'react';
import { UserRole, User } from '../types';
import { api } from '../api/client';

interface DemoContextType {
  role: UserRole;
  currentUser: User;
  setRole: (role: UserRole) => void;
  resetDemoData: () => Promise<void>;
  refreshKey: number;
  triggerRefresh: () => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  provider: {
    id: 'usr-provider-1',
    name: 'Campus Central Canteen',
    role: 'provider',
    organization: 'Delhi Tech University Canteen',
    contact_email: 'canteen@dtu.ac.in',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString()
  },
  recipient: {
    id: 'usr-recipient-1',
    name: 'Hostel 4 Food Committee',
    role: 'recipient',
    organization: 'Campus Student Union',
    contact_email: 'hostel4@dtu.ac.in',
    phone: '+91 98444 55667',
    created_at: new Date().toISOString()
  },
  coordinator: {
    id: 'usr-coord-1',
    name: 'Regional Dispatch Coordinator',
    role: 'coordinator',
    organization: 'Central Food Rescue Network',
    contact_email: 'coordinator@lastplate.org',
    phone: '+91 98777 88990',
    created_at: new Date().toISOString()
  }
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('recipient');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const resetDemoData = async () => {
    try {
      await api.resetDemoData();
      triggerRefresh();
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        currentUser: DEMO_USERS[role],
        setRole,
        resetDemoData,
        refreshKey,
        triggerRefresh
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
