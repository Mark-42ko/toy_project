import styled from "styled-components";
import TabBar from "./tabBar";
import { useState, useEffect } from "react";
import ChatRooms from "./chatRooms";
import ChatBar from "./chatBar";
import Blah from "./blah";
import UserInfo from "./userInfo";
import { ChatNew } from "@styled-icons/remix-line/ChatNew";
import AddChat from "./addChat";

export default function People() {
  const [tabHandle, setTabHandle] = useState<string>("대화중");
  const [open, setOpen] = useState<boolean>(false);
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const [roomData, setRoomData] = useState<any>();
  const [chatRoom, setChatRoom] = useState<any>();
  const [userDatas, setUserDatas] = useState<any>();
  const [rerendering, setRerendering] = useState<number>(0);

  useEffect(() => {
    console.log("rererere");
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
    if (chatRoom) {
      console.log(chatRoom._id);
    }
  }, [open, tabHandle]);

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
              <AddChat setOpen={setOpen} open={open} setRerendering={setRerendering} />
            </ModalBackdrop>
          ) : null}
        </NameContainer>
        <TabBar tabHandle={tabHandle} setTabHandle={setTabHandle} />
        <MailListContainer>
          {roomData &&
            roomData.map((one: any) => {
              if (tabHandle === one.status) {
                return (
                  <ChatRooms
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
        </MailListContainer>
      </ListContainer>
      {chatRoom && (
        <InfoContainer>
          <ChatBar roomData={chatRoom} setRerendering={setRerendering} />
          <InnerContainer>
            <Blah roomData={chatRoom} setRerendering={setRerendering} rerendering={rerendering} />
            <UserInfo roomData={chatRoom} rerendering={rerendering} />
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
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  gap: 1rem;
  padding: 1rem;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 280px;
  height: 50px;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(112, 200, 255, 1);
`;

const MailListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameTag = styled.h1`
  color: rgba(255, 255, 255, 1);
  font-size: 2rem;
`;

const NewChatButton = styled.button`
  border: none;
  background: rgba(112, 200, 255, 1);
  cursor: pointer;

  svg {
    color: rgba(255, 255, 255, 1);
    width: 40px;
    height: 40px;
  }
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
