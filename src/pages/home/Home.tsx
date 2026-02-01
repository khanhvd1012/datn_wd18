import React from 'react'
import { Typography,Button } from '@mui/material'
import Banner from '../../components/Banner'
const Home = () => {
  return (
    <div>
      <Banner />
      <Typography variant="h4" gutterBottom>
        Hello Material UI 🚀
      </Typography>

      <Button variant="contained" color="primary">
        Click me
      </Button>
      <img src="" alt="" />
    </div>
  )
}

export default Home