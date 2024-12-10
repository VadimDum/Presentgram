import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './components/providers/store';
import ChatwsProvider from './components/providers/chatws/ChatwsProvider';
import { injectStore } from './services/axiosInstance';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ChatwsProvider>
      <App />
    </ChatwsProvider>
  </Provider>,
);

injectStore(store);
