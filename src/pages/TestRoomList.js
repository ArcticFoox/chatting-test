import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const TestRoomList = () => {

    const [chatRoom, setChatRoom] = new useState([]);

    const [inputValue, setInputValue] = useState("");
    const [hostId, setHostId] = useState("");
    const [guestId, setGuestId] = useState("");
    const [memberId, setMemberId] = useState("");

    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleHostIdChange = (e) => setHostId(e.target.value);
    const handleGuestIdChange = (e) => setGuestId(e.target.value);
    const handleMemberIdChange = (e) => setMemberId(e.target.value);

    const fetchRooms = () => {
        axios.get("http://localhost:8080/v1/api/chatroom/list" )
            .then(response => {setChatRoom(response.data.data)});
        };

    const createRoom = () => {
        if (inputValue && hostId && guestId) {
            const newRoom = {
            name: inputValue,
            hostId: hostId,
            guestId: guestId,
            };
            axios.post("http://localhost:8080/v1/api/chatroom", newRoom)
            .then(response => {
                    if(response.status === 200){
                        setInputValue('');
                        setChatRoom((prev) => [...prev, response.data.data]);
                    } else {
                        alert("경고경고!");
                    }
                }
            )
            setChatRoom([...chatRoom, newRoom]);
            setInputValue("");
            setHostId("");
            setGuestId("");
            setMemberId("")
        } else {
            alert("Please fill in all fields.");
        }
    };

    useEffect( () => {
        fetchRooms();
      }, []);

    return (
    <div>
      <ul>
        <div>
          <form onSubmit={createRoom}>
            <div>
            {/* 채팅방 이름 입력 필드 */}
            <input
              type="text"
              placeholder="Enter Chat Room Name"
              value={inputValue}
              onChange={handleInputChange}
              required
            />

            {/* Host ID Input */}
            <input
              type="text"
              placeholder="Host ID"
              value={hostId}
              onChange={handleHostIdChange}
              required
            />

            {/* Guest ID Input */}
            <input
              type="text"
              placeholder="Guest ID"
              value={guestId}
              onChange={handleGuestIdChange}
              required
            />

            {/* 채팅방 추가 버튼 */}
            <button type="submit">입력</button>
            </div>
          </form>
        </div>
        <div>
          <input
              type="text"
              placeholder="Enter MemberId"
              value={memberId}
              onChange={handleMemberIdChange}
            />
        </div>
        {/* 채팅방 리스트 출력 */}
        {chatRoom.map((item) => (
          <Link 
            to={`/test/${item.id}/${memberId}`}
            style={{ textDecoration: 'none'}}
          > 
            <div className="list-item">{item.name}</div>
          </Link>
        ))}
      </ul>
    </div>
    );
};
export default TestRoomList;