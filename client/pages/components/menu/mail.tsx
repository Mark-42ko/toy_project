import styled from "styled-components";
import TabBar from "./tabBar";
import { useState, useEffect } from "react";
import MailList from "./mailList";
import BlahBar from "./blahBar";
import Blah from "./blah";
import UserInfo from "./userInfo";
import { ChatNew } from "@styled-icons/remix-line/ChatNew";
import AddBlah from "./addBlah";
import { io } from "socket.io-client";

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function People() {
  const [tabHandle, setTabHandle] = useState<string>("진행중");
  const [open, setOpen] = useState<boolean>(false);
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const [roomData, setRoomData] = useState<any>();
  const [chatRoom, setChatRoom] = useState<any>();
  const [userDatas, setUserDatas] = useState<any>();
  const [rerendering, setRerendering] = useState<number>(0);

  useEffect(() => {
    const messageHandler = (chat: any) => setRerendering(Math.random());
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    setUserDatas(userData);
    const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
    if (userData && accessToken) {
      !(async function () {
        const result = await fetch(`${SERVER_URI}/blah?email=${userData.userId}`, {
          method: "GET",
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const json = await result.json();
        setRoomData(json.data);
      })();
    }
  }, [open, rerendering]);

  const newChatButtonHandle = () => {
    setOpen(!open);
  };

  return (
    <Container>
      <ListContainer>
        <NameContainer>
          {userDatas && <NameTag>{userDatas.username}</NameTag>}
          <NewChatButton onClick={newChatButtonHandle}>
            <ChatNew />
          </NewChatButton>
          {open ? (
            <ModalBackdrop>
              <AddBlah setOpen={setOpen} open={open} />
            </ModalBackdrop>
          ) : null}
        </NameContainer>
        <TabBar tabHandle={tabHandle} setTabHandle={setTabHandle} />
        {roomData &&
          roomData.map((one: any) => {
            if (tabHandle === one.status) {
              return (
                <MailList
                  key={one._id}
                  tabHandle={tabHandle}
                  roomData={one}
                  setChatRoom={setChatRoom}
                  chatRoom={chatRoom}
                  userDatas={userDatas}
                  rerendering={rerendering}
                />
              );
            }
          })}
      </ListContainer>
      {chatRoom && (
        <InfoContainer>
          <BlahBar roomData={chatRoom} />
          <InnerContainer>
            <Blah roomData={chatRoom} setRerendering={setRerendering} />
            <UserInfo roomData={chatRoom} />
          </InnerContainer>
        </InfoContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  min-width: 300px;
`;

const NameContainer = styled.div`
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NameTag = styled.h1`
  font-size: 1.5em;
`;

const InfoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  gap: 1rem;
`;

const NewChatButton = styled.button`
  border: none;
  background: #ffffff;
  cursor: pointer;

  svg {
    width: 30px;
    height: 30px;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;
