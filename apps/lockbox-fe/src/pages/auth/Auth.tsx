import  { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../../components/global/AppBar';


const Auth = () => {

  const [isSignup, setIsSignup] = useState(false);

  return (
    <div>
        <ResponsiveAppBar />
        <h1 className="title">{isSignup ? 'Welcome!' : "Hello again!"}</h1>

        <form>
        <Box
          sx={{
            backgroundColor: "rgb(110 170 240 / 50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "45ch",
            margin: "auto",
            marginTop: "5ch",
            padding: "5ch",
            borderRadius: "2ch",
          }}
        >
          <Typography variant="h4" paddingBottom={3} textAlign="center">
            {isSignup ? "Sign Up" : "Login"}
          </Typography>

          {isSignup && (
            <TextField
            name="username"
            // value={user.username}
            margin="normal"
            type={"text"}
            label="Username"
            variant="outlined"
            // onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          )}

          <TextField
            name="email"
            // value={user.email}
            margin="normal"
            type={"text"}
            label= {isSignup ? "Email" : "Username or Email"}
            variant="outlined"
            // onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <TextField
            name="password"
            // value={user.password}
            margin="normal"
            type={"password"}
            label="Password"
            variant="outlined"
            // onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          {isSignup && (
            <TextField
            name="comfirm_password"
            // value={user.comfirm_password}
            margin="normal"
            type={"comfirm_password"}
            label="Confirm Password"
            variant="outlined"
            // onChange={(e) => setUser({ ...user, comfirm_password: e.target.value })}
          />
          )}

          <Link to="/home" style={{ textDecoration: "none" }}>
            <Button
            //   endIcon={<LoginIcon />}
            //   onClick={handleSubmit}
              type="submit"
              sx={{ borderRadius: 2, margin: 4, width: "50%", height: "3rem" }}
              variant="contained"
              color="warning"
            >
              Login
            </Button>
          </Link>

          <div className="textSpan">
                <span
                  style={{ fontSize: "14px", cursor: "pointer" }}
                  // change of form happens when clicked on this line
                  onClick={() => {
                    setIsSignup((prev) => !prev);
                    // resetForm();
                  }}
                >
                  {isSignup
                    ? "Already have an account? Login!"
                    : "Don't have an account? Sign Up"}
                </span>
              </div>
        </Box>
      </form>
        <br />
    </div>
  )
}

export default Auth;