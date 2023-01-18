import { useState, useEffect } from "react";
import styled from "styled-components";
import AddChatCard from "./addChatCard";
import NewChatCheck from "./newChatCheck";
import { Back } from "@styled-icons/entypo/Back";
import { io } from "socket.io-client";

type Props = {
  open: boolean;
  setOpen: Function;
  setRerendering: Function;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function AddChat(props: Props) {
  const [friendData, setFriendeData] = useState<any>();
  const [selectFriend, setSelectFriend] = useState<any>([]);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const [newBlahCheck, setNewBlahCheck] = useState<boolean>(false);
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);

  useEffect(() => {
    !(async function () {
      const reponse = await fetch(`${SERVER_URI}/people/readPeople?user=${userData.username}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await reponse.json();
      setFriendeData(json.data);
      setSelectFriend([
        ...selectFriend,
        {
          email: userData.userId,
          name: userData.username,
          phoneNumber: userData.userPhoneNumber,
          filename: userData.filename,
        },
      ]);
    })();
  }, []);

  const addHandle = async () => {
    const result = await fetch(`${SERVER_URI}/blah/findOne`, {
      method: "POST",
      body: JSON.stringify({
        user: selectFriend,
        blah: [],
        status: "진행중",
      }),
      headers: {
        Authorization: `bearer ${accessToken}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });

    const jsons = await result.json();
    if (selectFriend.length === 1) {
      setErrMsg("혼자서는 생성할 수 없습니다.");
    } else {
      if (jsons.data === true) {
        setErrMsg(undefined);
        setNewBlahCheck(true);
      } else {
        const result = await fetch(`${SERVER_URI}/blah/create`, {
          method: "POST",
          body: JSON.stringify({
            user: selectFriend,
            blah: [],
            status: "진행중",
          }),
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const json = await result.json();
        props.setOpen(!props.open);
        const data = {
          roomName: "대기방",
          message: "새로운 방",
          selectFriend: selectFriend,
        };
        socket.emit("message", data, (chat: any) => {
          props.setRerendering(Math.random());
        });
        alert("생성완료");
      }
    }
  };

  return (
    <Container>
      <TitleContainer>
        <CloseButton onClick={() => props.setOpen(!props.open)}>
          <Back />
        </CloseButton>
        <Title>대화상대를 선택해주세요</Title>
        <div style={{ width: "40px" }} />
      </TitleContainer>
      {errMsg && <ErrMsg>{errMsg}</ErrMsg>}
      <InnerContainer>
        {friendData ? (
          friendData.friend.map((one: any) => (
            <AddChatCard
              key={one.email}
              friendData={one}
              setSelectFriend={setSelectFriend}
              selectFriend={selectFriend}
            />
          ))
        ) : (
          <ErrMsg>친구가 없습니다. 추가해주세요</ErrMsg>
        )}
      </InnerContainer>
      {newBlahCheck ? (
        <NewChatCheck
          setNewBlahCheck={setNewBlahCheck}
          newBlahCheck={newBlahCheck}
          selectFriend={selectFriend}
          setOpen={props.setOpen}
          open={props.open}
        />
      ) : (
        <AddButton onClick={addHandle}>대화하기</AddButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  width: 480px;
  background-color: rgba(255, 255, 255, 1);

  box-sizing: border-box;
  border: none;
  border-radius: 20px;

  padding: 2rem 1.5rem 2rem 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem 0;
  background-color: rgba(255, 255, 255, 1);

  width: 100%;
  max-height: 320px;
  padding: 1rem;

  overflow-y: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 1);
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;

const Title = styled.span`
  color: rgba(52, 51, 67, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;
`;

const AddButton = styled.button`
  border: none;
  background: rgba(255, 81, 0, 1);
  width: 98%;
  height: 60px;
  border-radius: 10px;
  font-size: 1.5rem;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;
  cursor: pointer;
`;

const ErrMsg = styled.span`
  color: rgba(255, 0, 0, 1);
  font-size: 1.5rem;
`;
