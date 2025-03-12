import React from 'react';
import PropTypes from 'prop-types';
import { Box, SvgIcon } from '@mui/material';

const CabinLogo = ({ size = 40, color = 'primary' }) => {
  return (
    <Box sx={{ width: size, height: size }}>
      <SvgIcon
        viewBox="0 0 24 24"
        sx={{ 
          width: '100%', 
          height: '100%', 
          color: color === 'primary' ? 'primary.main' : color 
        }}
      >
        {/* Cabin with trees and lake SVG path */}
        <path d="M12,3L2,12h3v8h14v-8h3L12,3z M12,16c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C14,15.1,13.1,16,12,16z" />
        {/* Tree 1 */}
        <path d="M5,20v-2c0-1.1,0.9-2,2-2s2,0.9,2,2v2H5z" />
        {/* Tree 2 */}
        <path d="M15,20v-2c0-1.1,0.9-2,2-2s2,0.9,2,2v2H15z" />
        {/* Lake */}
        <path d="M4,21h16c0.55,0,1-0.45,1-1s-0.45-1-1-1H4c-0.55,0-1,0.45-1,1S3.45,21,4,21z" />
        {/* Sun */}
        <circle cx="19" cy="5" r="2" />
      </SvgIcon>
    </Box>
  );
};

CabinLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default CabinLogo;
