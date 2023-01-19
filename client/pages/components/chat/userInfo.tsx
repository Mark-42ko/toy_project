import styled from "styled-components";
import UserCard from "./userCard";
import { useEffect, useState } from "react";

type Props = {
  roomData: any;
  rerendering: number;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export default function UserInfo(props: Props) {
  const [userDatas, setUserDatas] = useState<any>([]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
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
      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i]._id === props.roomData._id) {
          return setUserDatas(json.data[i].user);
        }
      }
    })();
  }, [props.roomData, props.rerendering]);

  return (
    <Container>
      <TitleText>참여자({userDatas.length})</TitleText>
      <Line />
      <InnerContainer>
        {userDatas &&
          userDatas.map((one: any) => (
            <UserCard userData={one} key={one.name} rerendering={props.rerendering} />
          ))}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 25%;
  min-width: 230px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  margin: 24px 24px 24px 0px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 20px;
`;

const Line = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(233, 232, 240, 1);
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  scrollbar-width: none;
  overflow-y: auto;
  padding: 24px 24px 24px 24px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.48);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const TitleText = styled.span`
  padding: 24px 24px 22px 24px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 26px;
`;
