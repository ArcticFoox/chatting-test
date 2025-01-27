import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import './ChatRoom.css';

const testRoom = () => {

    const [selectedNumber, setSelectedNumber] = useState([]);
    const { roomId } = useParams();
    const { memberId } = useParams();

    const [numbers, setNumber] = useState([]); 

    const fetchNumbers = async () => {
        await axios.get(`http://localhost:8080/v1/api/chatroom/` + roomId)
            .then(response => {setNumber(response.data.data)});
        
    };

    const handleNumberClick = (number) => {
        setSelectedNumber(number);
    };

    const stompClient = useRef(null);
    const subscription = useRef(null);

    // 채팅 내용들을 저장할 변수
    const [messages, setMessages] = new useState([]);
    // 사용자 입력을 저장할 변수
    const [inputValue, setInputValue] = useState('');
    
    // 입력 필드에 변화가 있을 때마다 inputValue를 업데이트
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // 웹소켓 연결 설정
    const connect = () => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            subscription.current = stompClient.current.subscribe(`/sub/chatroom/` + roomId, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }, {
                roomId: roomId,
                memberId: memberId
            });
        });
    };

    // 웹소켓 연결 해제
    const disconnect = () => {

        if(subscription.current){
            subscription.current.unsubscribe( Headers = {
                roomId: roomId,
                memberId: memberId
            });
        }

        if (stompClient.current) {
            stompClient.current.disconnect( Headers = {
                roomId: roomId,
                memberId: memberId
            });
        }
    };
    // 기존 채팅 메시지를 서버로부터 가져오는 함수
    const fetchMessages = async () => {
        axios.get(`http://localhost:8080/chat/list/` + roomId)
            .then(response => {setMessages(response.data.data)});
        
        console.log(messages)
    };
    useEffect(() => {
        fetchNumbers();
        connect();
        fetchMessages();
        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => disconnect();
    }, []);

    //메세지 전송
    const sendMessage = () => {
        if (stompClient.current && inputValue && selectedNumber) {
            const body = {
                roomId : roomId,
                message : inputValue,
                memberId : selectedNumber    
            };
        stompClient.current.send(`/pub/message`, body, JSON.stringify(body));
        setInputValue('');
        }
    };

    return (
        <div>
        <ul>
            <div style={{ display: 'flex' }}>
                {numbers.map((number, index) => (
                    <div 
                    key={index} 
                    className={`num-${number}`}
                    onClick={() => handleNumberClick(number)} 
                    style={{ 
                        marginRight: '5px',
                        padding: '5px',
                        width: '40px',
                        height: '25px',
                        border: '1px solid black',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                    >
                    {number}
                    </div>
                ))}
                <p style={{ marginTop: '7px'}}>회원 번호: {selectedNumber}</p>
            </div>
            <div>
            {/* 입력 필드 */}
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
        />
        {/* 메시지 전송, 메시지 리스트에 추가 */}
        <button onClick={sendMessage}>입력</button>
            </div>
            {/* 메시지 리스트 출력 */}
            {messages.map((item) => (
            <div key={item.id} className={`list-items num-${item.memberId}`}>{item.message}</div>
            ))}
        </ul>
        </div>
    );
}
export default testRoom;