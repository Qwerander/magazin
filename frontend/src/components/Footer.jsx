import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Email, Phone } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        py: 3,
        margin: "auto auto 0",
        maxWidth: 1200,
        width: '100%'
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
            color: 'primary.main'
          }}
        >
          GREENSHOP
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="body1" component="address" fontStyle="normal">
              70 West Buckingham Ave.
              <br />
              Farmingdale, NY 11735
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-end' } }}>
            <Link
              href="mailto:contact@greenshop.com"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
              <Email sx={{ mr: 1 }} />
              contact@greenshop.com
            </Link>

            <Link
              href="tel:+8801911717490"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Phone sx={{ mr: 1 }} />
              +88 01911 717 490
            </Link>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          © {new Date().getFullYear()} GREENSHOP. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;