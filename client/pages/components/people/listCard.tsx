import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  peopleData: any;
  friend: any | undefined;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export default function ListCard(props: Props) {
  const [profileImg, setProfileImg] = useState<string>();
  const [render, setRender] = useState<boolean>(true);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

  useEffect(() => {
    if (props.friend !== undefined) {
      for (let a = 0; a < props.friend.length; a++) {
        if (props.friend[a].name === props.peopleData.name || props.peopleData.name === "챗봇") {
          setRender(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    !(async function () {
      const result = await fetch(
        `${SERVER_URI}/blah/download?filename=${props.peopleData.filename}`,
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
    })();
  }, []);

  return (
    <>
      {render && (
        <Container>
          <ProfileContainer>
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
            <NameTag>{props.peopleData.name}</NameTag>
          </ProfileContainer>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding: 12px;
  width: 320px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 1);
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 20px;
  width: 100%;
`;

const ProfileImg = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
`;

const NameTag = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
`;
