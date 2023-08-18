import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Container>
        <Box sx={{ marginTop: '3rem', marginBottom: '2rem' }}>
          <Typography variant='h3'>Landing Page</Typography>
        </Box>
        <br />

        <button
          onClick={() => navigate('/auth')}
          style={{ marginBottom: '2rem' }}
        >
          Go to Auth
        </button>

        <br />

        <button onClick={() => navigate('/signup')}>Sign up</button>
      </Container>
    </div>
  );
};

export default Landing;
