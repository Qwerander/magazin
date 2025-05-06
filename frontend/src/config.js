const isDocker = process.env.REACT_APP_DOCKER === 'true';

export const API_URL = isDocker
  ? process.env.REACT_APP_API_URL
  : process.env.REACT_APP_API_URL_PUBLIC || 'http://localhost:5000';