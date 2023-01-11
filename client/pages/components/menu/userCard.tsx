import styled from "styled-components";
import { PhoneIphone } from "@styled-icons/material/PhoneIphone";
import { EmailOutline } from "@styled-icons/evaicons-outline/EmailOutline";
import { useEffect, useState } from "react";

type Props = {
  userData: any;
};

export default function UserCard(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const [check, setCheck] = useState<boolean>(false);
  const [reRender, setReRender] = useState<number>(0);
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);

  useEffect(() => {
    !(async function () {
      const reponse = await fetch(`${SERVER_URI}/people/readPeople?username=${userData.username}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await reponse.json();
      if (json.data) {
        json.data.friend.filter((one: any) => {
          if (one.name === props.userData.name) {
            return setCheck(true);
          }
        });
      }
      props.userData.name === userData.username && setCheck(true);
    })();
  }, [reRender]);

  const clickHandle = async () => {
    if (!check) {
      const result = await fetch(`${SERVER_URI}/people/add`, {
        method: "POST",
        body: JSON.stringify({
          user: userData.username,
          friend: {
            email: props.userData.email,
            name: props.userData.name,
            phoneNumber: props.userData.phoneNumber,
          },
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const rstJson = await result.json();
      if (rstJson.statusCode === 401) {
        alert("이미 추가된 이메일입니다.");
        setReRender(Math.random());
      } else {
        alert("추가완료.");
        setReRender(Math.random());
      }
    }
  };

  return (
    <Container onClick={clickHandle}>
      <ProfileContainer>
        <ProfileImg />
        <NameTag>
          <b>{props.userData.name === userData.username ? "나" : props.userData.name}</b>
        </NameTag>
      </ProfileContainer>
      <InfoContainer>
        <PhoneIphone style={{ width: "30px", height: "30px" }} />
        <InfoText>{props.userData.phoneNumber}</InfoText>
      </InfoContainer>
      <InfoContainer>
        <EmailOutline style={{ width: "30px", height: "30px" }} />
        <InfoText>{props.userData.email}</InfoText>
      </InfoContainer>
      {!check && (
        <NoticeText>
          <b>친구추가를 하려면 클릭해주세요.</b>
        </NoticeText>
      )}
    </Container>
  );
}

const Container = styled.button`
  width: 90%;
  margin-top: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid;
  border-radius: 8px;
  border-color: #d8d8d8;
  background-color: #ffffff;
  cursor: pointer;

  &:active {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const ProfileImg = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 8px;
`;

const NameTag = styled.div`
  font-size: 1.4rem;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const InfoText = styled.span`
  font-size: 1rem;
`;

const NoticeText = styled.span`
  font-size: 1rem;
  color: #ff0000;
`;
