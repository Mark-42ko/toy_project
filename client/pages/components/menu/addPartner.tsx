import { useState, useEffect } from "react";
import styled from "styled-components";
import AddBlahCard from "./addBlahCard";
import NewBlahCheck from "./newBlahCheck";
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

export default function addPartner(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const [friendData, setFriendData] = useState<any>([]);
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
      const data: any = [];
      if (json.data) {
        await json.data.friend.map((one: any) => {
          // console.log(one);
          if (!JSON.stringify(props.roomData.user).includes(JSON.stringify(one.name))) {
            data.push(one);
          }
        });
        const result = [...new Set(data)];
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
      alert("초대완료");
      props.setOpen(!props.open);
      socket.emit("message", "aaaa", (chat: any) => {
        props.setRerendering(Math.random());
      });
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
            <AddBlahCard
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
        <NewBlahCheck
          setNewBlahCheck={setNewBlahCheck}
          newBlahCheck={newBlahCheck}
          selectFriend={selectFriend}
          setOpen={props.setOpen}
          open={props.open}
        />
      ) : (
        <AddButton onClick={addHandle}>
          <b>추가하기</b>
        </AddButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex: 0.3;

  background-color: #ffffff;

  box-sizing: border-box;
  border: none;
  border-radius: 8px;

  padding: 1rem;
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
  background-color: #ffffff;

  width: 100%;
  max-height: 300px;
  padding: 1rem;

  overflow-y: scroll;
  scrollbar-width: none;
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

const CloseButton = styled.button`
  border: none;
  background: #ffffff;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;

const Title = styled.span`
  font-size: 1.4rem;
`;

const AddButton = styled.button`
  border: none;
  background: #8181f7;
  width: 50%;
  height: 40px;
  border-radius: 8px;
  font-size: 1.3rem;
  color: #ffffff;
  cursor: pointer;
`;

const ErrMsg = styled.span`
  color: #ff0000;
  font-size: 1.5rem;
`;
