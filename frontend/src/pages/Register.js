import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Register is now unified into the Login page (tab-based).
// This redirect keeps any direct /register links working.
export default function RegisterPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/login?tab=register', { replace: true }); }, [navigate]);
  return null;
}