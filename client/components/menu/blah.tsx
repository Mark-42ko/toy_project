import styled from 'styled-components';
import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useContext, useEffect, useState } from 'react';
import ChatBox from './chatBox';
import { GlobalContext } from 'pages/_app';

type Props = {
    roomData: any;
};

export default function Blah (props: Props) {
    const [ inputData, setInputData ] = useState<string>("");
    const [ chatData, setChatData ] = useState<string>("");
    const [ updateData, setUpdateData ] = useState<any>();
    const [ updateHandle, setUpdateHandle ] = useState<boolean>(false);

    const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
    const ctx = useContext(GlobalContext);

    useEffect(()=>{
    },[updateData]);

    const inputButtonHandle = async () => {
        setChatData(inputData);
        const result = await fetch(`${SERVER_URI}/blah/chatAdd`, {
            method: "Post",
            body: JSON.stringify({
                _id: props.roomData._id,
                blah: {
                    name: ctx?.userData?.username,
                    comments: chatData,
                    date: new Date()
                }
            }),
            headers: {
                "Authorization": `bearer ${ctx?.accessToken}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
            }
        });
        const json = await result.json();
        console.log(json.data);
        setUpdateData(json.data);
        setInputData("");
        setUpdateHandle(!updateHandle);
    };
 
    return (
        <Container>
            <BlahContainer>
                { updateData ? 
                    updateData.blah.map((one: any) => <ChatBox chatData={one} key={one.date} updateHandle={updateHandle}/>)
                    :
                    props.roomData[0].blah[0] ? props.roomData[0].blah.map((one: any) => <ChatBox chatData={one} key={one.date} updateHandle={updateHandle}/>)
                    :
                    <></>
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
    min-width: 450px;
    height: 80vh;
    border: none;
    border-radius: 1rem;
    align-items: start;
    justify-content: flex-end;
    flex-direction: column;
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

