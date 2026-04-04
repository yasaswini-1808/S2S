import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Questionnaire from './Questionnaire';
import PathDashboard from './PathDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user?.selected_path) {
    return <Questionnaire />;
  }

  return <PathDashboard />;
}
