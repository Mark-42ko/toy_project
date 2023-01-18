import styled from "styled-components";
import TabBar from "./tabBar";
import { useState, useEffect } from "react";
import ChatRooms from "./chatRooms";
import Blah from "./blah";
import UserInfo from "./userInfo";
import AddChat from "./addChat";
import Image from "next/image";
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
  const [chatRoomsRender, setChatRoomsRender] = useState<number>(0);

  useEffect(() => {
    socket.emit("join-room", "대기방", () => {});
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
        for (let a = 0; a < json.data.length; a++) {
          if (json.data[a].status === "진행중") {
            socket.emit("join-room", json.data[a]._id, () => {});
          }
        }
        const messageHandler = (chat: any) => {
          if (chat.roomName && chat.message === "종료됨") {
            setRerendering(Math.random());
          }
          if (chat.selectFriend) {
            if (chat.selectFriend.find((one: any) => one.email === userData.userId)) {
              setRerendering(Math.random());
            }
          }
        };
        socket.on("message", messageHandler);
        return () => {
          socket.off("message", messageHandler);
        };
      })();
    }
  }, [open, tabHandle, rerendering]);

  const newChatButtonHandle = () => {
    setOpen(!open);
  };

  return (
    <Container>
      <ListContainer>
        <TitleContainer>
          <TitleText>채팅</TitleText>
          <AddChatButton onClick={newChatButtonHandle}>
            <Image src={"/images/addChats.svg"} alt={"채팅추가"} width={32} height={32} />
          </AddChatButton>
          {open ? (
            <ModalBackdrop>
              <AddChat setOpen={setOpen} open={open} setRerendering={setRerendering} />
            </ModalBackdrop>
          ) : null}
        </TitleContainer>
        <Line />
        <MiddleContainer>
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
                      chatRoomsRender={chatRoomsRender}
                    />
                  );
                }
              })}
          </MailListContainer>
        </MiddleContainer>
      </ListContainer>
      {chatRoom && (
        <InnerContainer>
          <Blah
            roomData={chatRoom}
            setRerendering={setRerendering}
            rerendering={rerendering}
            setChatRoom={setChatRoom}
            setChatRoomsRender={setChatRoomsRender}
          />
          <UserInfo roomData={chatRoom} rerendering={rerendering} />
        </InnerContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 408px;
  min-width: 408px;
  height: calc(100vh - 48px);
  margin: 24px 24px 24px 24px;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 18px 24px;
`;

const TitleText = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 26px;
`;

const AddChatButton = styled.button`
  width: 40px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 1);
  cursor: pointer;
`;

const Line = styled.div`
  width: 408px;
  height: 4px;
  background-color: rgba(233, 232, 240, 1);
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 16px 16px;
`;

const MailListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 78vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 4px;
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
