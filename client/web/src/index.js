import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '@app/App';
import './i18n';
import {UserProvider} from 'providers/UserProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <UserProvider>
            <App />
      </UserProvider>
  </React.StrictMode>
);
