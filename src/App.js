import './App.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import ChatRoomList from './pages/ChatRoomList.js';
import ChatRoom from './pages/ChatRoom.js';

function App() {
  return (
      <Routes>
        <Route path="/" element={<ChatRoomList />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
      </Routes>
  );
}

export default App;