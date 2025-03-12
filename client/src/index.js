import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import client from './graphql/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
