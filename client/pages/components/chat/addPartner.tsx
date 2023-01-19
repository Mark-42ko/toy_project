import { useState, useEffect } from "react";
import styled from "styled-components";
import AddChatCard from "./addChatCard";
import NewChatCheck from "./newChatCheck";
import { Back } from "@styled-icons/entypo/Back";
import { io } from "socket.io-client";

type Props = {
  open: boolean;
  setOpen: Function;
  roomData: any;
  setRerendering: Function;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function AddPartner(props: Props) {
  const [friendData, setFriendData] = useState<any>([]);
  const [selectFriend, setSelectFriend] = useState<any>([]);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const [newBlahCheck, setNewBlahCheck] = useState<boolean>(false);
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

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
      const data: any = [];
      if (json.data) {
        await json.data.friend.map((one: any) => {
          if (!JSON.stringify(props.roomData.user).includes(JSON.stringify(one.name))) {
            data.push(one);
          }
        });
        const result = [...Array.from(new Set(data))];
        setFriendData(result);
      }
    })();
  }, []);

  const addHandle = async () => {
    if (selectFriend.length === 0) {
      setErrMsg("선택 된 대화상대가 없습니다.");
    } else {
      let systemComments;
      if (selectFriend.length === 1) {
        systemComments = `${userData.username}님이 ${selectFriend[0].name}을 초대하였습니다.`;
      } else {
        systemComments = `${userData.username}님이 ${selectFriend[0].name} 외 ${
          selectFriend.length - 1
        }명 을 초대하였습니다.`;
      }
      await fetch(`${SERVER_URI}/blah/chatAdd`, {
        method: "Post",
        body: JSON.stringify({
          _id: props.roomData._id,
          blah: {
            name: "알림",
            profile: "",
            comments: systemComments,
            date: new Date(),
            counts: [],
          },
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });

      await fetch(`${SERVER_URI}/blah/addPartner`, {
        method: "POST",
        body: JSON.stringify({
          _id: props.roomData._id,
          user: selectFriend,
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const data = {
        roomName: props.roomData._id,
        message: "초대함",
      };
      socket.emit("message", data, (chat: any) => {
        props.setRerendering(Math.random());
      });
      alert("초대완료");
      props.setOpen(!props.open);
    }
  };

  return (
    <Container>
      <TitleContainer>
        <CloseButton onClick={() => props.setOpen(!props.open)}>
          <Back />
        </CloseButton>
        <Title>초대 할 상대를 선택해주세요.</Title>
        <div style={{ width: "40px" }} />
      </TitleContainer>
      {errMsg && <ErrMsg>{errMsg}</ErrMsg>}
      <InnerContainer>
        {friendData[0] ? (
          friendData.map((one: any) => (
            <AddChatCard
              key={one.email}
              friendData={one}
              setSelectFriend={setSelectFriend}
              selectFriend={selectFriend}
            />
          ))
        ) : (
          <ErrMsg>초대 할 상대가 없습니다.</ErrMsg>
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
        <AddButton onClick={addHandle}>추가하기</AddButton>
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

  padding: 2rem 1rem 2rem 1rem;
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
