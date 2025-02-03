import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useState } from 'react';
import LoadingSection from '../components/CVForm/LoadingSection';

const CVFormContext = createContext();

const VERSION_HISTORY_LIMIT = 10;

const initialState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  },
  professionalSummary: "",
  experience: [],
  education: [],
  skills: [],
  language: [],
  certification: [],
  interests: [],
  reference: [],
  socialMedia: [],
  lastSaved: null,
  isDirty: false,
  errors: {},
  versionHistory: [],
  currentVersion: 0,
};

const actionTypes = {
  UPDATE_SECTION: 'UPDATE_SECTION',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  MARK_SAVED: 'MARK_SAVED',
  LOAD_SAVED_DATA: 'LOAD_SAVED_DATA',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  UNDO: 'UNDO',
  REDO: 'REDO',
};

const cvFormReducer = (state, action) => {
  console.log('Reducer called with:', { 
    type: action.type, 
    section: action.section,
    currentVersion: state.currentVersion 
  });
  
  switch (action.type) {
    case actionTypes.UPDATE_SECTION: {
      const { section, data } = action;
      
      // Don't update version history for certain sections or if data hasn't changed
      const shouldUpdateHistory = 
        section !== 'errors' && 
        JSON.stringify(state[section]) !== JSON.stringify(data);
      
      const newState = {
        ...state,
        [section]: data,
        isDirty: true,
      };

      // Only update version history if data actually changed
      if (shouldUpdateHistory) {
        newState.versionHistory = [
          state,
          ...state.versionHistory.slice(0, VERSION_HISTORY_LIMIT - 1)
        ];
        newState.currentVersion = 0;
      }
      
      return newState;
    }

    case actionTypes.SET_ERRORS: {
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.section]: action.errors
        }
      };
    }

    case actionTypes.CLEAR_ERRORS: {
      const newErrors = { ...state.errors };
      delete newErrors[action.section];
      return {
        ...state,
        errors: newErrors
      };
    }

    case actionTypes.MARK_SAVED: {
      // Only update if currently dirty
      if (!state.isDirty) {
        return state;
      }
      return {
        ...state,
        isDirty: false,
        lastSaved: new Date().toISOString()
      };
    }

    case actionTypes.LOAD_SAVED_DATA: {
      return {
        ...initialState,
        ...action.data,
        versionHistory: [],
        currentVersion: 0
      };
    }

    case actionTypes.UNDO: {
      if (state.currentVersion >= state.versionHistory.length - 1) {
        return state;
      }
      return {
        ...state.versionHistory[state.currentVersion + 1],
        versionHistory: state.versionHistory,
        currentVersion: state.currentVersion + 1
      };
    }

    case actionTypes.REDO: {
      if (state.currentVersion <= 0) {
        return state;
      }
      return {
        ...state.versionHistory[state.currentVersion - 1],
        versionHistory: state.versionHistory,
        currentVersion: state.currentVersion - 1
      };
    }

    default:
      return state;
  }
};

export const CVFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cvFormReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = localStorage.getItem('cvFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Ensure all required fields exist by merging with initialState
          const mergedData = {
            ...initialState,
            ...parsedData,
            personalInfo: {
              ...initialState.personalInfo,
              ...(parsedData.personalInfo || {}),
            },
          };
          
          dispatch({ 
            type: actionTypes.LOAD_SAVED_DATA, 
            data: mergedData,
          });
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        // If there's an error, use initial state
        dispatch({ 
          type: actionTypes.LOAD_SAVED_DATA, 
          data: initialState,
        });
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // Debounced autosave to localStorage
  useEffect(() => {
    if (!isInitialized || !state.isDirty) return;

    // Track what we're about to save to prevent unnecessary saves
    const stateToSave = JSON.stringify(state);
    const previousSave = localStorage.getItem('cvFormData');

    // Only save if the data has actually changed
    if (stateToSave === previousSave) {
      return;
    }

    const autosaveTimer = setTimeout(() => {
      try {
        localStorage.setItem('cvFormData', stateToSave);
        // Only mark as saved if we successfully saved
        dispatch({ type: actionTypes.MARK_SAVED });
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }, 1000);

    return () => clearTimeout(autosaveTimer);
  }, [state.isDirty, isInitialized]);

  const updateSection = useCallback((section, data) => {
    dispatch({ type: actionTypes.UPDATE_SECTION, section, data });
  }, []);

  const setErrors = useCallback((section, errors) => {
    dispatch({ type: actionTypes.SET_ERRORS, section, errors });
  }, []);

  const clearErrors = useCallback((section) => {
    dispatch({ type: actionTypes.CLEAR_ERRORS, section });
  }, []);

  const markSaved = useCallback(() => {
    dispatch({ type: actionTypes.MARK_SAVED });
  }, []);

  const loadSavedData = useCallback((data) => {
    dispatch({ type: actionTypes.LOAD_SAVED_DATA, data });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: actionTypes.UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: actionTypes.REDO });
  }, []);

  const value = useMemo(() => ({
    state: isInitialized ? state : initialState,
    updateSection,
    setErrors,
    clearErrors,
    markSaved,
    loadSavedData,
    undo,
    redo,
    canUndo: state.versionHistory.length > 0 && state.currentVersion < state.versionHistory.length,
    canRedo: state.currentVersion > 0,
  }), [
    state,
    isInitialized,
    updateSection,
    setErrors,
    clearErrors,
    markSaved,
    loadSavedData,
    undo,
    redo
  ]);

  if (!isInitialized || !state.personalInfo) {
    return <LoadingSection />;
  }

  return (
    <CVFormContext.Provider value={value}>
      {children}
    </CVFormContext.Provider>
  );
};

export function useCVForm() {
  const context = useContext(CVFormContext);
  if (!context) {
    throw new Error('useCVForm must be used within a CVFormProvider');
  }
  return context;
}
