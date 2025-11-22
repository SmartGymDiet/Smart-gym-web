import { API_BASE_URL } from '@/routes/routes';
import { useState, useCallback } from 'react';

export interface Subject {
  isNew: any;
  isDeleted: any;
  isModified: boolean;
  id: number;
  name: string;
}

export interface Priority {
  isNew: any;
  isDeleted: any;
  isModified: boolean;
  id: number;
  name: string;
}

export interface Team {
  isNew: any;
  isDeleted: any;
  isModified: boolean;
  id: number;
  name: string;
}

export interface SLA {
  id: number;
  name: string;
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const useSettings = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [slas, setSlas] = useState<SLA[]>([]);
  const [loading, setLoading] = useState(false);  // Subjects API
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);
  const addSubject = useCallback(async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchSubjects();
        return true;
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
    return false;
  }, [fetchSubjects]);
  const updateSubject = useCallback(async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchSubjects();
        return true;
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
    return false;
  }, [fetchSubjects]);
  const deleteSubject = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchSubjects();
        return true;
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
    return false;
  }, [fetchSubjects]);
  // Priorities API
  const fetchPriorities = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-levels`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setPriorities(data);
      }
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  }, []);

  const addPriority = useCallback(async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}priority-levels`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchPriorities();
        return true;
      }
    } catch (error) {
      console.error('Error adding priority:', error);
    }
    return false;
  }, [fetchPriorities]);

  const updatePriority = useCallback(async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-levels/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchPriorities();
        return true;
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
    return false;
  }, [fetchPriorities]);

  const deletePriority = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/priority-levels/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchPriorities();
        return true;
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
    }
    return false;
  }, [fetchPriorities]);
  // Teams API
  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, []);

  const addTeam = useCallback(async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchTeams();
        return true;
      }
    } catch (error) {
      console.error('Error adding team:', error);
    }
    return false;
  }, [fetchTeams]);

  const updateTeam = useCallback(async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchTeams();
        return true;
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
    return false;
  }, [fetchTeams]);

  const deleteTeam = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchTeams();
        return true;
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
    return false;
  }, [fetchTeams]);
  // SLAs API
  const fetchSlas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/slas`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSlas(data);
      }
    } catch (error) {
      console.error('Error fetching slas:', error);
    }
  }, []);
  const addSla = useCallback(async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchSlas();
        return true;
      }
    } catch (error) {
      console.error('Error adding sla:', error);
    }
    return false;
  }, [fetchSlas]);
  const updateSla = useCallback(async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchSlas();
        return true;
      }
    } catch (error) {
      console.error('Error updating sla:', error);
    }
    return false;
  }, [fetchSlas]);
  const deleteSla = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/slas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchSlas();
        return true;
      }
    } catch (error) {
      console.error('Error deleting sla:', error);
    }
    return false;
  }, [fetchSlas]);

  // Load all data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchSubjects(),
      fetchPriorities(),
      fetchTeams(),
      fetchSlas(),
    ]);
    setLoading(false);
  }, [fetchSubjects, fetchPriorities, fetchTeams, fetchSlas]);

  return {
    // State
    subjects,
    priorities,
    teams,
    slas,
    loading,
    
    // Methods
    loadAllData,
    
    // Subjects
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    
    // Priorities
    fetchPriorities,
    addPriority,
    updatePriority,
    deletePriority,
    
    // Teams
    fetchTeams,
    addTeam,
    updateTeam,
    deleteTeam,
    
    // SLAs
    fetchSlas,
    addSla,
    updateSla,
    deleteSla,
  };
};
