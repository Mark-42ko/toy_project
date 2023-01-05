import styled from 'styled-components';
import { Send } from '@styled-icons/ionicons-sharp/Send';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import ChatBox from './chatBox';

type Props = {
    blahData: any;
};

export default function Blah (props: Props) {
    const [ inputData, setInputData ] = useState<string>("");
    const [ chatData, setChatData ] = useState<string>("");

    const inputButtonHandle = () => {
        console.log(inputData);
        setChatData(inputData);
        setInputData("");
    };

    return (
        <Container>
            <BlahContainer>
                <ChatBox chatData={chatData}/>
            </BlahContainer>
            <InputContainer>
                <InputBox onChange={(evt) => setInputData(evt.currentTarget.value)} value={inputData}/>
                <SendButton type='button' onClick={inputButtonHandle}><Send /></SendButton>
            </InputContainer>
        </Container>
    );
}

// export async function getServerSideProps(props: GetServerSidePropsContext){
//     const reponse = await fetch("/", {
//         method: "POST",
//         body: JSON.stringify({
//             user: "userEmail",
//             admin: "adminEmail"
//         }),
//         headers: {
//             "Content-type": "application/json",
//             "Access-Control-Allow-Origin": "http://localhost:3000"
//         }
//     });
//     const json = await reponse.json();

//     return {
//         props : {
//             data: json
//         }
//     }
// }

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
    align-items: end;
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

