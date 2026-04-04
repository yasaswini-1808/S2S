import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';

export default function PlacementGuard({ children }) {
  const isUploaded = localStorage.getItem('resumeUploaded') === 'true';
  const { addAlert } = useAlert();

  React.useEffect(() => {
    if (!isUploaded) {
      addAlert("You must upload and analyze your resume before accessing the dashboard.", "warning");
    }
  }, [isUploaded, addAlert]);

  if (!isUploaded) {
    return <Navigate to="/placement/upload" replace />;
  }
  
  return children;
}
