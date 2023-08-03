import ResponsiveAppBar from '../../../src/components/global/AppBar';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReceivedPasswordsVault = () => {
    
  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ width: 1000 }}>
        <div>
          <Typography
            sx={{ mt: 4, mb: 4 }}
            variant="h4"
            component="h2"
            gutterBottom
          >
            Shared Passwords
          </Typography>

          <Box>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ backgroundColor: '#ebeef4' }}
              >
                <Typography variant="subtitle1" component="h5">
                  Shared by : 
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" justifyContent="space-around">
                  <Box>
                    <Typography gutterBottom sx={{ mt: 1, mb: 1 }} variant="h6">
                      <strong>Username: </strong>
                    </Typography>
                    <Typography gutterBottom sx={{ mt: 1, mb: 1 }} variant="h6">
                      <strong>Password:</strong> 
                    </Typography>
                    <Typography gutterBottom sx={{ mt: 1, mb: 1 }} variant="h6">
                      <strong>Sender Name:</strong> 
                    </Typography>
                    <Typography gutterBottom sx={{ mt: 1, mb: 1 }} variant="h6">
                      <strong>Sender Email:</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 4, mb: 4 }}
                    >
                      Add to My Vault
                    </Button>
                    <Button variant="contained" color="secondary">
                      Delete
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </div>
      </Container>
    </>
  );
};

export default ReceivedPasswordsVault;
