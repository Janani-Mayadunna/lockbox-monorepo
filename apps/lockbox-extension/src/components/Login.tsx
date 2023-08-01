import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC<{}> = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="title">Login</h1>
      <button onClick={() => navigate('/dashboard')}>Go to dash</button>
    </div>
  );
};

export default Login;