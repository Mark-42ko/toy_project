import styled from "styled-components";
import { PhoneIphone } from "@styled-icons/material/PhoneIphone";
import { EmailOutline } from "@styled-icons/evaicons-outline/EmailOutline";
import { useEffect, useState } from "react";
import Image from "next/image";
import { io } from "socket.io-client";

type Props = {
  userData: any;
  rerendering: number;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function UserCard(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const [check, setCheck] = useState<boolean>(false);
  const [reRender, setReRender] = useState<number>(0);
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
  const [profileImg, setProfileImg] = useState<string>();

  useEffect(() => {
    const messageHandler = (chat: any) => setReRender(Math.random());
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    !(async function () {
      if (props.userData.filename) {
        const extension =
          props.userData.filename.split(".")[props.userData.filename.split(".").length - 1];
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif" ||
          extension === "webp"
        ) {
          const result = await fetch(
            `${SERVER_URI}/blah/download?filename=${props.userData.filename}`,
            {
              method: "GET",
              headers: {
                Authorization: `bearer ${accessToken}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
              },
            },
          );
          const file = await result.blob();
          const downloadUrl = window.URL.createObjectURL(file);
          setProfileImg(downloadUrl);
        }
      }
    })();
  }, []);

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
      if (json.data) {
        json.data.friend.filter((one: any) => {
          if (one.name === props.userData.name) {
            return setCheck(true);
          }
        });
      }
      props.userData.name === userData.username && setCheck(true);
    })();
  }, [reRender, props.rerendering]);

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
            filename: props.userData.filename ? props.userData.filename : "",
            date: new Date(),
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
      {profileImg ? (
        <Image
          src={profileImg}
          alt="프로필 이미지"
          width={56}
          height={56}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <ProfileImg />
      )}
      <ProfileContainer>
        <NameTag>
          <b>{props.userData.name === userData.username ? "나" : props.userData.name}</b>
        </NameTag>
        {props.userData.name !== "챗봇" && <InfoText>{props.userData.phoneNumber}</InfoText>}
        {props.userData.name !== "챗봇" && <InfoText>{props.userData.email}</InfoText>}
        {!check && <NoticeText>클릭 시 친구추가</NoticeText>}
      </ProfileContainer>
    </Container>
  );
}

const Container = styled.button`
  width: calc(100% - 48px);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border: none;
  gap: 10px;
  background-color: rgba(255, 255, 255, 1);

  cursor: pointer;
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`;

const ProfileImg = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 56px;
  height: 56px;
  min-width: 56px;
  border: none;
  border-radius: 50%;
`;

const NameTag = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
`;

const InfoText = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`;

const NoticeText = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(255, 0, 0, 1);
`;
