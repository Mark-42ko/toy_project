import styled from 'styled-components';
import TabBar from './tabBar';
import { useState, useContext, useEffect } from 'react';
import MailList from './mailList';
import BlahBar from './blahBar';
import Blah from './blah';
import UserInfo from './userInfo';
import { ChatNew } from '@styled-icons/remix-line/ChatNew';
import { GlobalContext } from 'pages/_app';
import AddBlah from './addBlah';

export default function People () {
    const [ tabHandle, setTabHandle ] = useState<string>("진행중");
    const [ open, setOpen ] = useState<boolean>(false);
    const ctx = useContext(GlobalContext);
    const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
    const [ roomData, setRoomData ] = useState<any>();
    const [ choose, setChoose ] = useState<boolean>(false);

    useEffect(() => {
        !async function () {
            const result = await fetch(`${SERVER_URI}/blah?email=${ctx?.userData?.userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `bearer ${ctx?.accessToken}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000"
                }
            });
            const json = await result.json();
            setRoomData(json.data);
        }()
    },[]);

    const newChatButtonHandle = () => {
        setOpen(!open);
    };

    return(
        <Container>
            <ListContainer>
                <NameContainer>
                    <NameTag>{ctx?.userData?.username}</NameTag>
                    <NewChatButton onClick={newChatButtonHandle}><ChatNew /></NewChatButton>
                    { open ?
                        <ModalBackdrop><AddBlah setOpen={setOpen} open={open}/></ModalBackdrop> : null
                    }
                </NameContainer>
                <TabBar tabHandle={tabHandle} setTabHandle={setTabHandle}/>
                { roomData ?
                    roomData.map((one: any) => <MailList key={one._id} tabHandle={tabHandle} roomData={roomData} choose={choose} setChoose={setChoose}/>)
                    :
                    <ErrMsg>친구를 추가해주세요.</ErrMsg>
                }
                
            </ListContainer>
            { (roomData && choose) &&
                <InfoContainer>
                    <BlahBar roomData={roomData}/>
                    <InnerContainer>
                        <Blah roomData={roomData}/>
                        <UserInfo roomData={roomData}/>
                    </InnerContainer>
                </InfoContainer>
            }
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    min-width: 300px;
`;

const NameContainer = styled.div`
    height: 4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const NameTag = styled.h1`
    font-size: 1.5em;
`;

const InfoContainer = styled.div`
    width: 100%;
    height: 100%
    display: flex;
    flex-direction: column;  
`;

const InnerContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: 20px;
`;

const NewChatButton = styled.button`
    width: 50px;
    height: 50px;
    border: none;
    background: #FFFFFF;
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: row wrep;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ErrMsg = styled.span`
    font-size: 1rem;
    color: #FF0000;
`;