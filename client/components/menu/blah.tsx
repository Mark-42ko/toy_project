import styled from 'styled-components';
import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext, useEffect, useState } from 'react';
import ChatBox from './chatBox';
import { GlobalContext } from 'pages/_app';
import { io } from 'socket.io-client';

type Props = {
    roomData: any;
};

interface IChat {
    username: string;
    message: string;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function Blah (props: Props) {
    const [ inputData, setInputData ] = useState<string>("");
    const [ updateData, setUpdateData ] = useState<any>();
    const [chats, setChats] = useState<IChat>();

    const ctx = useContext(GlobalContext);

    useEffect(()=>{
        const messageHandler = (chat: IChat) => 
        setChats(chat);
        socket.on('message', messageHandler);
        return () => {
            socket.off('message', messageHandler);
        };
    },[])

    useEffect(()=>{
        !async function () {
            const result = await fetch(`${SERVER_URI}/blah/room?id=${props.roomData[0]._id}`, {
                method: "GET",
                headers: {
                    "Authorization": `bearer ${ctx?.accessToken}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000"
                }
            })
            const json = await result.json();
            setUpdateData([json.data])
        }()
    },[chats]);

    const inputButtonHandle = async () => {
        if( inputData === "" ) {
            alert("메시지를 입력해주세요.");
        } else {
            await fetch(`${SERVER_URI}/blah/chatAdd`, {
                method: "Post",
                body: JSON.stringify({
                    _id: props.roomData._id,
                    blah: {
                        name: ctx?.userData?.username,
                        comments: inputData,
                        date: new Date()
                    }
                }),
                headers: {
                    "Authorization": `bearer ${ctx?.accessToken}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000"
                }
            });
            const data = {
                _id: props.roomData[0]._id,
                username: ctx?.userData?.username
            }
            socket.emit('message', data, (chat: IChat) => {
                setUpdateData([chat]);
                setInputData("");    
            });
        }
    };
 
    return (
        <Container>
            <BlahContainer style={{}}>
                { updateData &&
                    updateData[0].blah.map((one: any) => <ChatBox chatData={one} key={one.date} />)
                }
            </BlahContainer>
            <InputContainer>
                <InputBox onChange={(evt) => setInputData(evt.currentTarget.value)} value={inputData}/>
                <SendButton type='button' onClick={inputButtonHandle}><Send /></SendButton>
            </InputContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    width: 65%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
`;

const BlahContainer = styled.div`
    display: flex;
    background-color: #E6E0F8;
    width: 100%;
    height: 80vh;
    border: none;
    border-radius: 1rem;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    padding-right: 1.5rem;
    flex-direction: column;
    scrollbar-width: none;
    scroll-top: scroll-height;
    overflow: auto;
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
    }
`;

const InputBox = styled.input`
    width: 90%;
    height: 3vh;
    border-radius: 3rem;
    padding: 1rem;
    word-break: break-all;
`;

const SendButton = styled.button`
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 50px;
    padding: 0.6rem;
    background: #0000FF;
    color: #FFFFFF;
`;

const InputContainer = styled.div`
    width: 100%;
    height: 3vh;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
`;

