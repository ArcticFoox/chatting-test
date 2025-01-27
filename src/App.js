import './App.css';
import { Route, Routes } from 'react-router-dom'
import ChatRoomList from './pages/ChatRoomList.js';
import ChatRoom from './pages/ChatRoom.js';
import TestRoom from './pages/testRoom.js';
import TestRoomList from './pages/TestRoomList.js';
import Member from './pages/guestRoom.js';

function App() {
  return (
      <Routes>
        <Route path="/" element={<ChatRoomList />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
        <Route path="/test" element={<TestRoomList />} />
        <Route path="/test/:roomId/:memberId" element={<TestRoom />} />
        <Route path="/guest/:roomId" element={<Member />} />
      </Routes>
  );
}

export default App;
