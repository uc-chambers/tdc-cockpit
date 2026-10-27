import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Employee {
  id: string;
  fullName: string;
  businessUnit: string;
  startDate: string;
  seniority: number;
  role: string;
  age: number;
  phone: string;
}

export interface PhoneContact {
  id: string;
  name: string;
  phone: string;
  extension: string;
  department: string;
  position: string;
  email: string;
}

export interface Forklift {
  id: string;
  brand: string;
  truckId: string;
  serialNumber: string;
  assignedOperator: string;
}

export interface EquipmentItem {
  id: string;
  type: 'radio' | 'computer';
  brand: string;
  assignedOperator: string;
  comments: string;
}

export interface Operation {
  id: string;
  date: string;
  customer: string;
  truckOperations: number;
  palletQty: number;
  deliveryType: 'delivered' | 'received';
  responsible: string;
  forkliftDriver: string;
}

interface DataContextType {
  employees: Employee[];
  setEmployees: (data: Employee[]) => void;
  phoneContacts: PhoneContact[];
  setPhoneContacts: (data: PhoneContact[]) => void;
  forklifts: Forklift[];
  setForklifts: (data: Forklift[]) => void;
  equipment: EquipmentItem[];
  setEquipment: (data: EquipmentItem[]) => void;
  operations: Operation[];
  setOperations: (data: Operation[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployeesState] = useState<Employee[]>(() => loadFromStorage('cockpit-employees', []));
  const [phoneContacts, setPhoneContactsState] = useState<PhoneContact[]>(() => loadFromStorage('cockpit-phones', []));
  const [forklifts, setForkliftsState] = useState<Forklift[]>(() => loadFromStorage('cockpit-forklifts', []));
  const [equipment, setEquipmentState] = useState<EquipmentItem[]>(() => loadFromStorage('cockpit-equipment', []));
  const [operations, setOperationsState] = useState<Operation[]>(() => loadFromStorage('cockpit-operations', []));

  const setEmployees = (data: Employee[]) => {
    setEmployeesState(data);
    localStorage.setItem('cockpit-employees', JSON.stringify(data));
  };

  const setPhoneContacts = (data: PhoneContact[]) => {
    setPhoneContactsState(data);
    localStorage.setItem('cockpit-phones', JSON.stringify(data));
  };

  const setForklifts = (data: Forklift[]) => {
    setForkliftsState(data);
    localStorage.setItem('cockpit-forklifts', JSON.stringify(data));
  };

  const setEquipment = (data: EquipmentItem[]) => {
    setEquipmentState(data);
    localStorage.setItem('cockpit-equipment', JSON.stringify(data));
  };

  const setOperations = (data: Operation[]) => {
    setOperationsState(data);
    localStorage.setItem('cockpit-operations', JSON.stringify(data));
  };

  return (
    <DataContext.Provider value={{
      employees, setEmployees,
      phoneContacts, setPhoneContacts,
      forklifts, setForklifts,
      equipment, setEquipment,
      operations, setOperations,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
