import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCloudUploadAlt, FaArrowLeft, FaTrash, FaFilePdf, FaFileWord, FaFileAlt, FaSpinner, FaCheck, FaRobot, FaMagic, FaFileExport, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { BsCloudUpload, BsFileEarmarkText, BsGear, BsEye } from 'react-icons/bs';
import axiosInstance from '../../api/axios';
import { uploadDocument } from '../../api/cvParser';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1rem 2rem;

  @media (min-width: 640px) {
    padding: 5rem 1.5rem 2rem;
  }
`;

const Header = styled.div`
  margin: 1rem 0 2rem;
  text-align: left;
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.isDark 
      ? 'linear-gradient(to right, rgba(250, 204, 21, 0.2), transparent)'
      : 'linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent)'
    };
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.8)' : '#3b82f6'};
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  
  &:hover {
    color: ${props => props.isDark ? '#fbbf24' : '#1d4ed8'};
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  margin-bottom: 2rem;
`;

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 3rem auto;
`;

const UploadArea = styled.div`
  background: ${props => props.isDark ? 'rgba(30, 41, 59, 0.5)' : 'white'};
  border: 2px dashed ${props => {
    // Using a ternary that doesn't pass custom props to DOM
    return props.isDark 
      ? (props.$isDragging ? '#fbbf24' : 'rgba(250, 204, 21, 0.4)') 
      : (props.$isDragging ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)')
  }};
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
  }
`;

const UploadIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
`;

const UploadText = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  }
`;

const SupportedFormats = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.8)' : '#4b5563'};
  }
  
  span {
    font-size: 0.8rem;
    color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const SelectedFileContainer = styled.div`
  margin-top: 2rem;
  text-align: left;
  background: ${props => props.isDark ? 'rgba(30, 41, 59, 0.7)' : '#f8fafc'};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const SelectedFileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
  }
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .file-icon {
    font-size: 1.5rem;
    color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
  }
  
  .file-info {
    .file-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.9)' : 'var(--text-color)'};
      margin-bottom: 0.25rem;
    }
    
    .file-size {
      font-size: 0.8rem;
      color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
    }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin-top: 2rem;
  background: ${props => props.isDark 
    ? 'linear-gradient(to right, #fbbf24, #f59e0b)' 
    : 'linear-gradient(to right, #3b82f6, #1d4ed8)'
  };
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: opacity 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    opacity: ${props => props.disabled ? 0.7 : 0.9};
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorText = styled.p`
  color: ${props => props.isDark ? '#f87171' : '#ef4444'};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

const LoadingModal = styled.div`
  background-color: ${props => props.isDark ? '#1e293b' : 'white'};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  @media (max-width: 640px) {
    width: 95%;
    padding: 1.5rem;
  }
`;

const LoadingHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280'};
    font-size: 0.9rem;
  }
`;

const StageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const Stage = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  opacity: ${props => (props.active || props.completed) ? 1 : 0.6};
  transition: opacity 0.3s ease;
`;

const StageIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: ${props => 
    props.completed ? '#10b981' : 
    props.active ? (props.isDark ? '#3b82f6' : '#2563eb') : 
    (props.isDark ? '#374151' : '#e5e7eb')
  };
  color: ${props => 
    props.completed ? '#ffffff' : 
    props.active ? '#ffffff' : 
    (props.isDark ? '#9ca3af' : '#6b7280')
  };
  font-size: 1rem;
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.active ? 'scale(1.2)' : 'scale(1)'};
  }
`;

const StageContent = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${props => 
      props.completed ? '#10b981' : 
      props.active ? (props.isDark ? '#3b82f6' : '#2563eb') : 
      (props.isDark ? '#d1d5db' : '#4b5563')
    };
    transition: color 0.3s ease;
  }
  
  p {
    margin: 0.2rem 0 0 0;
    font-size: 0.85rem;
    color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  }
`;

const ProgressContainer = styled.div`
  background-color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};
  height: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  border-radius: 9999px;
  background: ${props => props.isDark 
    ? 'linear-gradient(to right, #fbbf24, #f59e0b)' 
    : 'linear-gradient(to right, #3b82f6, #1d4ed8)'
  };
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background: ${props => props.isDark 
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)' 
      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)'
    };
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressPercentage = styled.div`
  position: absolute;
  top: -1.5rem;
  right: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
`;

const LoadingAnimation = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  
  .dot {
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border-radius: 50%;
    background-color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
    display: inline-block;
    animation: bounce 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(1) { animation-delay: 0s; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  .dot:nth-child(4) { animation-delay: 0.6s; }
  .dot:nth-child(5) { animation-delay: 0.8s; }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const AnimatedIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
  margin: 0 auto 1rem;
  animation: ${props => props.animation} 3s infinite ease-in-out;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
  
  @keyframes slide {
    0% { transform: translateX(-50px); opacity: 0; }
    20%, 80% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(50px); opacity: 0; }
  }
`;

const LoadingFooter = styled.div`
  text-align: center;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.5)' : '#6b7280'};
  font-size: 0.8rem;
`;

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationDialog = styled.div`
  background-color: ${props => props.isDark ? '#1f2937' : '#ffffff'};
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  color: ${props => props.isDark ? '#f3f4f6' : '#1f2937'};
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 1.25rem;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    padding: 1rem;
    border-radius: 10px;
  }
`;

const ConfirmationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  .icon {
    font-size: 2rem;
    color: ${props => props.isDark ? '#f59e0b' : '#f59e0b'};
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  
  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
`;

const ConfirmationMessage = styled.p`
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 1rem;
  color: ${props => props.isDark ? '#d1d5db' : '#4b5563'};
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0.75rem 0;
  }
`;

const ExistingCVInfo = styled.div`
  background-color: ${props => props.isDark ? '#111827' : '#f3f4f6'};
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  
  .file-name {
    font-weight: 600;
    margin-bottom: 0.5rem;
    word-break: break-word;
  }
  
  .file-date {
    color: ${props => props.isDark ? '#9ca3af' : '#6b7280'};
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`;

const ConfirmationActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 600px) {
    justify-content: center;
    gap: 0.5rem;
  }
`;

const ViewExistingButton = styled.button`
  background-color: ${props => props.isDark ? '#2c3e50' : '#e9ecef'};
  color: ${props => props.isDark ? '#e1e1e1' : '#333'};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 44px; /* Minimum touch target size */
  
  &:hover {
    background-color: ${props => props.isDark ? '#34495e' : '#dee2e6'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  @media (max-width: 600px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.isDark ? '#374151' : '#e5e7eb'};
  color: ${props => props.isDark ? '#d1d5db' : '#4b5563'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* Minimum touch target size */
  
  &:hover {
    background-color: ${props => props.isDark ? '#4b5563' : '#d1d5db'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  @media (max-width: 600px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  background-color: #ef4444;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 44px; /* Minimum touch target size */
  
  &:hover {
    background-color: #dc2626;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  }
  
  @media (max-width: 600px) {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
`;

const RecentCVs = styled.div`
  width: 100%;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const RecentCVsTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #555;
`;

const CVItem = styled.div`
  padding: 0.8rem;
  background-color: ${props => props.theme === 'dark' ? '#2a2b31' : '#f8f9fa'};
  border-radius: 8px;
  margin-bottom: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#36373d' : '#e9ecef'};
  }
`;

const CVInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CVName = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme === 'dark' ? '#e1e1e1' : '#333'};
`;

const CVDate = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6c757d'};
`;

const ViewButton = styled.button`
  background-color: ${props => props.theme === 'dark' ? '#4b5563' : '#e2e8f0'};
  color: ${props => props.theme === 'dark' ? '#e1e1e1' : '#333'};
  border: none;
  border-radius: 5px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? '#6b7280' : '#cbd5e1'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const NoCVsMessage = styled.p`
  color: ${props => props.theme === 'dark' ? '#9ca3af' : '#6c757d'};
  text-align: center;
  font-style: italic;
  margin: 1rem 0;
`;

function CVUpload() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [existingCVInfo, setExistingCVInfo] = useState(null);
  
  const [stages, setStages] = useState([
    { id: 1, name: 'File Upload', description: 'Uploading your CV to our secure servers', icon: BsCloudUpload, completed: false, active: false },
    { id: 2, name: 'Document Processing', description: 'Converting your document for analysis', icon: BsFileEarmarkText, completed: false, active: false },
    { id: 3, name: 'AI Analysis', description: 'Extracting and structuring your CV data', icon: FaRobot, completed: false, active: false },
    { id: 4, name: 'Final Processing', description: 'Preparing your CV for preview', icon: BsGear, completed: false, active: false }
  ]);

  const [recentCVs, setRecentCVs] = useState([]);
  const [loadingRecentCVs, setLoadingRecentCVs] = useState(false);

  // Function to update the current stage
  const updateStage = (stageId, isCompleted = false) => {
    setCurrentStage(stageId);
    setStages(prevStages => 
      prevStages.map(stage => ({
        ...stage,
        active: stage.id === stageId && !isCompleted,
        completed: stage.id < stageId || (stage.id === stageId && isCompleted)
      }))
    );
  };

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      // Display error toast and redirect after a short delay
      toast.error('You must be logged in to upload a CV');
      setTimeout(() => {
        navigate('/login', { state: { returnUrl: '/cv-writer/upload' } });
      }, 1500);
    }
  }, [isAuthenticated, navigate]);

  // Allowed file types
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  const handleFileDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleFileDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    setError('');

    const files = e.dataTransfer.files;
    handleFileSelection(files);
  };

  const handleFileInputChange = (e) => {
    setError('');
    const files = e.target.files;
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    if (files.length > 0) {
      const file = files[0];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, Word, or text file.');
        return;
      }

      // Check file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 10MB limit');
        return;
      }

      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FaFilePdf className="file-icon" />;
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FaFileWord className="file-icon" />;
    } else {
      return <FaFileAlt className="file-icon" />;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    // Start the first stage - File Upload
    updateStage(1);

    try {
      // Use the uploadDocument API function
      const response = await uploadDocument(selectedFile, false);
      
      // Handle successful upload
      // Mark Stage 1 as completed
      updateStage(1, true);
      
      // Stage 2: Document Processing (25-50%)
      updateStage(2);
      
      // Simulate progress for document processing
      const processingTime = 2000; // 2 seconds
      const processingInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 1;
          if (next >= 50) {
            clearInterval(processingInterval);
            // Start Stage 3
            updateStage(2, true);
            updateStage(3);
            return 50;
          }
          return next;
        });
      }, processingTime / 25);
      
      // Stage 3: AI Analysis (50-85%)
      setTimeout(() => {
        const analysisTime = 5000; // 5 seconds
        const analysisInterval = setInterval(() => {
          setUploadProgress(prev => {
            const next = prev + 1;
            if (next >= 85) {
              clearInterval(analysisInterval);
              // Start Stage 4
              updateStage(3, true);
              updateStage(4);
              return 85;
            }
            return next;
          });
        }, analysisTime / 35);
      }, processingTime + 500);
      
      // Stage 4: Final Processing (85-100%)
      setTimeout(() => {
        const finalTime = 2000; // 2 seconds
        const finalInterval = setInterval(() => {
          setUploadProgress(prev => {
            const next = prev + 1;
            if (next >= 100) {
              clearInterval(finalInterval);
              updateStage(4, true);
              
              // Navigate to the CV parser preview page after a brief pause
              setTimeout(() => {
                const cvId = response.id || response.cv_id || response.data?.id || response.data?.cv_id;
                navigate(`/cv-parser-preview/${cvId}`);
                toast.success('CV uploaded and parsed successfully!');
              }, 500);
              
              return 100;
            }
            return next;
          });
        }, finalTime / 15);
      }, processingTime + 5500);
      
    } catch (error) {
      console.error('Error uploading CV:', error);

      // Check if this is a confirmation required error
      if (error.requiresConfirmation && error.existingCVInfo) {
        // Show confirmation dialog
        setExistingCVInfo(error.existingCVInfo);
        setShowConfirmation(true);
        setIsLoading(false);
        setUploadProgress(0);
        setCurrentStage(0);
        setStages(stages => stages.map(stage => ({...stage, active: false, completed: false})));
        return;
      }

      let errorMessage = 'Failed to upload CV. Please try again.';

      if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
        errorMessage = 'The CV parsing is taking longer than expected. The file might be too complex or our servers are busy. Please try again with a smaller file or try later.';
      } else if (error.response) {
        // Server returned an error response
        if (error.response.status === 413) {
          errorMessage = 'File size too large. Please upload a smaller file.';
        } else if (error.response.status === 415) {
          errorMessage = 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server encountered an error processing your CV. Our team has been notified. Please try again later.';
        } else if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }

      toast.error(errorMessage);
      setIsLoading(false);
      setUploadProgress(0);
      setCurrentStage(0);
      setStages(stages => stages.map(stage => ({...stage, active: false, completed: false})));
    }
  };
  
  // Handle overwrite confirmation
  const handleConfirmOverwrite = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setUploadProgress(0);
    
    // Start the first stage - File Upload
    updateStage(1);
    
    try {
      // Call the API with force_overwrite=true
      const response = await uploadDocument(selectedFile, true);
      
      // Mark Stage 1 as completed
      updateStage(1, true);
      
      // Stages 2-4 (same as in handleSubmit)
      // Stage 2: Document Processing (25-50%)
      updateStage(2);
      
      const processingTime = 2000; // 2 seconds
      const processingInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 1;
          if (next >= 50) {
            clearInterval(processingInterval);
            // Start Stage 3
            updateStage(2, true);
            updateStage(3);
            return 50;
          }
          return next;
        });
      }, processingTime / 25);
      
      // Stage 3: AI Analysis (50-85%)
      setTimeout(() => {
        const analysisTime = 5000; // 5 seconds
        const analysisInterval = setInterval(() => {
          setUploadProgress(prev => {
            const next = prev + 1;
            if (next >= 85) {
              clearInterval(analysisInterval);
              // Start Stage 4
              updateStage(3, true);
              updateStage(4);
              return 85;
            }
            return next;
          });
        }, analysisTime / 35);
      }, processingTime + 500);
      
      // Stage 4: Final Processing (85-100%)
      setTimeout(() => {
        const finalTime = 2000; // 2 seconds
        const finalInterval = setInterval(() => {
          setUploadProgress(prev => {
            const next = prev + 1;
            if (next >= 100) {
              clearInterval(finalInterval);
              updateStage(4, true);
              
              // Navigate to the CV parser preview page after a brief pause
              setTimeout(() => {
                const cvId = response.id || response.cv_id || response.data?.id || response.data?.cv_id;
                navigate(`/cv-parser-preview/${cvId}`);
                toast.success('CV replaced and parsed successfully!');
              }, 500);
              
              return 100;
            }
            return next;
          });
        }, finalTime / 15);
      }, processingTime + 5500);
      
    } catch (error) {
      console.error('Error replacing CV:', error);
      toast.error('Failed to replace existing CV. Please try again.');
      setIsLoading(false);
      setUploadProgress(0);
      setCurrentStage(0);
      setStages(stages => stages.map(stage => ({...stage, active: false, completed: false})));
    }
  };
  
  const handleViewExistingCV = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    // Navigate to the existing CV preview page
    if (existingCVInfo && existingCVInfo.id) {
      // Use the same handleViewCV function we defined earlier
      handleViewCV(existingCVInfo.id);
      
      // Optionally close the dialog after navigation
      setShowConfirmation(false);
    }
  };
  
  const handleCancelOverwrite = () => {
    setShowConfirmation(false);
    
    // Option to navigate to existing CV
    if (existingCVInfo && existingCVInfo.id) {
      toast('You can view your existing CV in the dashboard', {
        icon: '📄',
        duration: 5000,
      });
    }
  };

  const handleBack = () => {
    navigate('/cv-writer');
  };

  const handleAreaClick = () => {
    document.getElementById('file-input').click();
  };

  useEffect(() => {
    const fetchRecentCVs = async () => {
      try {
        setLoadingRecentCVs(true);
        
        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        
        if (!token) {
          console.log('User not authenticated, skipping recent CVs fetch');
          return;
        }
        
        const response = await axiosInstance.get('/api/ai_cv_parser/parser/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && Array.isArray(response.data.results)) {
          // Sort by most recent first and limit to 5
          const sortedCVs = response.data.results
            .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
            .slice(0, 5);
          
          setRecentCVs(sortedCVs);
        }
      } catch (error) {
        console.error('Error fetching recent CVs:', error);
        // Don't show an error message to the user, just log it
      } finally {
        setLoadingRecentCVs(false);
      }
    };
    
    fetchRecentCVs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewCV = (cvId) => {
    navigate(`/cv-parser-preview/${cvId}`);
  };

  return (
    <Container>
      <Header isDark={isDark}>
        <BackButton isDark={isDark} onClick={handleBack}>
          <FaArrowLeft /> Back to options
        </BackButton>
        <Title isDark={isDark}>Upload Your CV</Title>
        <Subtitle isDark={isDark}>
          Upload your existing CV to get started. We'll parse it and help you improve it.
        </Subtitle>
      </Header>

      <UploadContainer>
        <UploadArea
          isDark={isDark}
          $isDragging={isDraggingOver}
          onDragEnter={handleFileDragEnter}
          onDragLeave={handleFileDragLeave}
          onDragOver={handleFileDragOver}
          onDrop={handleFileDrop}
          onClick={handleAreaClick}
        >
          <UploadIcon isDark={isDark}>
            <FaCloudUploadAlt />
          </UploadIcon>

          <UploadText isDark={isDark}>
            <h3>Drag & Drop your CV here</h3>
            <p>or click to browse files</p>
          </UploadText>

          <SupportedFormats>
            <FormatItem isDark={isDark}>
              <FaFilePdf className="icon" />
              <span>PDF</span>
            </FormatItem>
            <FormatItem isDark={isDark}>
              <FaFileWord className="icon" />
              <span>Word</span>
            </FormatItem>
            <FormatItem isDark={isDark}>
              <FaFileAlt className="icon" />
              <span>Text</span>
            </FormatItem>
          </SupportedFormats>

          <HiddenInput
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInputChange}
          />
        </UploadArea>

        {error && <ErrorText isDark={isDark}>{error}</ErrorText>}

        {selectedFile && (
          <SelectedFileContainer isDark={isDark}>
            <SelectedFileHeader isDark={isDark}>
              <h4>Selected File</h4>
            </SelectedFileHeader>

            <FileDetails isDark={isDark}>
              {getFileIcon(selectedFile.type)}
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
            </FileDetails>
          </SelectedFileContainer>
        )}

        <Button
          isDark={isDark}
          disabled={!selectedFile || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              Processing...
            </>
          ) : (
            'Continue with this CV'
          )}
        </Button>
      </UploadContainer>
      
      {/* Recent CVs section */}
      {recentCVs.length > 0 && (
        <RecentCVs>
          <RecentCVsTitle isDark={isDark}>Recently Parsed CVs</RecentCVsTitle>
          {loadingRecentCVs ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ marginLeft: '0.5rem' }}>Loading your recent CVs...</span>
            </div>
          ) : (
            <>
              {recentCVs.map(cv => (
                <CVItem key={cv.id} theme={isDark ? 'dark' : 'light'}>
                  <CVInfo>
                    <CVName theme={isDark ? 'dark' : 'light'}>{cv.file_name || `CV #${cv.id}`}</CVName>
                    <CVDate theme={isDark ? 'dark' : 'light'}>Uploaded: {formatDate(cv.uploaded_at)}</CVDate>
                  </CVInfo>
                  <ViewButton theme={isDark ? 'dark' : 'light'} onClick={() => handleViewCV(cv.id)}>
                    View CV
                  </ViewButton>
                </CVItem>
              ))}
            </>
          )}
        </RecentCVs>
      )}
      
      {/* Loading Modal */}
      {isLoading && (
        <LoadingOverlay isDark={isDark}>
          <LoadingModal isDark={isDark}>
            <LoadingHeader isDark={isDark}>
              <h3>Processing Your CV</h3>
              <p>Please wait while we analyze your document</p>
              <AnimatedIcon isDark={isDark} animation={
                currentStage === 1 ? "spin" : 
                currentStage === 2 ? "pulse" : 
                currentStage === 3 ? "slide" : "spin"
              }>
                {currentStage === 1 && <BsCloudUpload />}
                {currentStage === 2 && <BsFileEarmarkText />}
                {currentStage === 3 && <FaRobot />}
                {currentStage === 4 && <BsGear />}
              </AnimatedIcon>
            </LoadingHeader>
            
            <ProgressContainer isDark={isDark}>
              <ProgressBar isDark={isDark} progress={uploadProgress} />
              <ProgressPercentage isDark={isDark}>{uploadProgress}%</ProgressPercentage>
            </ProgressContainer>
            
            <LoadingAnimation isDark={isDark}>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </LoadingAnimation>
            
            <StageContainer>
              {stages.map(stage => (
                <Stage 
                  key={stage.id} 
                  active={stage.active ? 1 : 0} 
                  completed={stage.completed ? 1 : 0}
                  isDark={isDark}
                >
                  <StageIcon
                    active={stage.active ? 1 : 0}
                    completed={stage.completed ? 1 : 0}
                    isDark={isDark}
                  >
                    {stage.completed ? (
                      <FaCheck />
                    ) : (
                      <stage.icon />
                    )}
                  </StageIcon>
                  
                  <StageContent
                    active={stage.active ? 1 : 0}
                    completed={stage.completed ? 1 : 0}
                    isDark={isDark}
                  >
                    <h4>{stage.name}</h4>
                    <p>{stage.description}</p>
                  </StageContent>
                </Stage>
              ))}
            </StageContainer>
            
            <LoadingFooter isDark={isDark}>
              {uploadProgress < 100 ? (
                "This may take a minute depending on the size and complexity of your document"
              ) : (
                "Almost done! Redirecting you to the preview..."
              )}
            </LoadingFooter>
          </LoadingModal>
        </LoadingOverlay>
      )}
      
      {/* Confirmation Dialog for CV Overwrite */}
      {showConfirmation && (
        <ConfirmationOverlay>
          <ConfirmationDialog isDark={isDark}>
            <ConfirmationHeader isDark={isDark}>
              <FaExclamationTriangle className="icon" />
              <h3>Existing CV Found</h3>
            </ConfirmationHeader>
            
            <ConfirmationMessage isDark={isDark}>
              You already have a CV in our system. Uploading a new CV will replace your existing one.
              All analysis, improvements and other data associated with your current CV will be lost.
            </ConfirmationMessage>
            
            {existingCVInfo && (
              <ExistingCVInfo isDark={isDark}>
                <div className="file-name">{existingCVInfo.name}</div>
                <div className="file-date">
                  Uploaded on {new Date(existingCVInfo.date).toLocaleDateString()}
                </div>
              </ExistingCVInfo>
            )}
            
            <ConfirmationActions>
              <CancelButton isDark={isDark} onClick={handleCancelOverwrite}>
                Cancel
              </CancelButton>
              
              {existingCVInfo && existingCVInfo.id && (
                <ViewExistingButton isDark={isDark} onClick={handleViewExistingCV}>
                  <BsEye /> View Existing CV
                </ViewExistingButton>
              )}
              
              <ConfirmButton isDark={isDark} onClick={handleConfirmOverwrite}>
                Replace Existing CV
              </ConfirmButton>
            </ConfirmationActions>
          </ConfirmationDialog>
        </ConfirmationOverlay>
      )}
    </Container>
  );
}

export default CVUpload;
