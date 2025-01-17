import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const ChatRoomList = () => {

    const [chatRoom, setChatRoom] = new useState([]);

    const [inputValue, setInputValue] = useState('');
    // 입력 필드에 변화가 있을 때마다 inputValue를 업데이트
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const fetchRooms = () => {
        axios.get("http://localhost:8080/v1/api/chatroom/list" )
            .then(response => {setChatRoom(response.data.data)});
        };

    const createRoom = () => {
    if (inputValue) {
      const body = {
      name : inputValue
      };
      axios.post("http://localhost:8080/v1/api/chatroom", body)
          .then(response => {
                  if(response.status === 200){
                      setInputValue('');
                      setChatRoom((prev) => [...prev, response.data.data]);
                  } else {
                      alert("경고경고!");
                  }
              }
          )
      }
    };

    useEffect( () => {
        fetchRooms();
      }, []);

    return (
    <div>
      <ul>
        <div>
          {/* 입력 필드 */}
       <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {/* 채팅방 추가 */}
      <button onClick={createRoom}>입력</button>
        </div>
        {/* 채팅방 리스트 출력 */}
        {chatRoom.map((item) => (
          <Link 
            to={`room/${item.id}`}
            style={{ textDecoration: 'none'}}
          > 
            <div className="list-item">{item.name}</div>
          </Link>
        ))}
      </ul>
    </div>
    );
};
export default ChatRoomList;