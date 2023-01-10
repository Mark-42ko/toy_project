import { GlobalContext } from "pages/_app";
import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import AddBlahCard from "./addBlahCard";
import NewBlahCheck from "./newBlahCheck";

type Props = {
  open: boolean;
  setOpen: Function;
};

export default function AddBlah(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const ctx = useContext(GlobalContext);
  const [friendData, setFriendeData] = useState<any>();
  const [selectFriend, setSelectFriend] = useState<any>([]);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const [newBlahCheck, setNewBlahCheck] = useState<boolean>(false);

  useEffect(() => {
    !(async function () {
      const reponse = await fetch(
        `${SERVER_URI}/people/readPeople?username=${ctx?.userData?.username}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${ctx?.accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        },
      );
      const json = await reponse.json();
      setFriendeData(json.data);
      setSelectFriend([
        ...selectFriend,
        {
          email: ctx?.userData?.userId,
          name: ctx?.userData?.username,
          phoneNumber: ctx?.userData?.userPhoneNumber,
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
      }),
      headers: {
        Authorization: `bearer ${ctx?.accessToken}`,
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
        await fetch(`${SERVER_URI}/blah/create`, {
          method: "POST",
          body: JSON.stringify({
            user: selectFriend,
            blah: [],
          }),
          headers: {
            Authorization: `bearer ${ctx?.accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        alert("생성완료");
        props.setOpen(!props.open);
      }
    }
  };

  return (
    <Container>
      <CloseButton onClick={() => props.setOpen(!props.open)}>x</CloseButton>
      <Title>대화상대를 선택해주세요.</Title>
      {errMsg && <ErrMsg>{errMsg}</ErrMsg>}
      <InnerContainer>
        {friendData ? (
          friendData.friend.map((one: any) => (
            <AddBlahCard
              key={one.email}
              friendData={one}
              setSelectFriend={setSelectFriend}
              selectFriend={selectFriend}
            />
          ))
        ) : (
          <ErrMsg>친구가 없습니다. 추가해주세요.</ErrMsg>
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
          <b>대화하기</b>
        </AddButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  gap: 1.5rem;
  width: 30%;
  min-width: 400px;
  padding: 1rem;
  position: sticky;
  height: 55%;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #ffffff;
  min-width: 400px;
  gap: 1rem;
  height: 60%;
  scrollbar-width: none;
  padding: 1rem;
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

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50px;
  width: 2rem;
  height: 2rem;
`;

const Title = styled.span`
  font-size: 1.4rem;
`;

const AddButton = styled.button`
  border: none;
  background: #8181f7;
  width: 50%;
  height: 40px;
  border-radius: 1rem;
  font-size: 1.3rem;
  color: #ffffff;
`;

const ErrMsg = styled.span`
  color: #ff0000;
  font-size: 1.5rem;
`;
