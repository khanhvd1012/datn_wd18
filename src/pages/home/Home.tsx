import Banner from '../../components/Banner'
import FeaturedProducts from '../../components/FeaturedProducts'
import Footer from '../../components/Footer'

import { Box, Fab } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'

const Home = () => {
  return (
    <>
      <Banner />
      <FeaturedProducts />
      <Footer />

      {/* Zalo Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,

          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(0, 136, 255, 0.7)',
            },
            '70%': {
              transform: 'scale(1.15)',
              boxShadow: '0 0 0 20px rgba(0, 136, 255, 0)',
            },
            '100%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(0, 136, 255, 0)',
            },
          },
        }}
      >
        <Fab
          component="a"
          href="https://zalo.me/0123456789"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#0088FF', 
            color: '#fff',
            animation: 'pulse 1.8s infinite',
            '&:hover': {
              bgcolor: '#0072d9',
              animation: 'none',
            },
          }}
        >
          <ChatIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Box>
    </>
  )
}

export default Home
