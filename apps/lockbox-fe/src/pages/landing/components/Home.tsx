import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../styles/landing.css';
import Navbar from './NavigationBar';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home-container'>
      <Box sx={{ mr: 10 }}>
        <Navbar />
      </Box>
      <div className='home-banner-container'>
        <div className='home-text-section'>
          <h1 className='primary-heading'>L O C K B O X</h1>
          <p className='primary-text'>Manage All Your Passwords In One Place</p>
          <button
            className='secondary-button'
            onClick={() => navigate('/signup')}
          >
            Sign Up <ArrowForwardIcon />{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
