import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const HomePage = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems={"center"} sx={{minHeight:"98vh"}}>
      {/* Grid container to layout login and register cards */}
      <Grid item xs={12} sm={3}>
        {/* Card for login */}
        <Card variant="outlined" >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Login
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Already have an account? Click below to login.
            </Typography>
            {/* Button to navigate to login page */}
            <Button component={Link} to="/login" variant="contained" color="primary" style={{ marginTop: '1em' }}>
              Login
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        {/* Card for registration */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Register
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Don't have an account? Click below to register.
            </Typography>
            {/* Button to navigate to registration page */}
            <Button component={Link} to="/register" variant="contained" color="primary" style={{ marginTop: '1em' }}>
              Register
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomePage;
