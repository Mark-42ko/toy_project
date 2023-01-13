import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  friendData: {
    email: string;
    name: string;
    phoneNumber: string;
    filename: string | undefined;
  };
  setSelectFriend: Function;
  selectFriend: any;
};

export default function AddChatCard(props: Props) {
  const [select, setSelect] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>();
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);

  useEffect(() => {
    !(async function () {
      if (props.friendData.filename) {
        const extension =
          props.friendData.filename.split(".")[props.friendData.filename.split(".").length - 1];
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif"
        ) {
          const result = await fetch(
            `${SERVER_URI}/blah/download?filename=${props.friendData.filename}`,
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

  const clickHandle = () => {
    setSelect(!select);
    if (select === false) {
      props.setSelectFriend([...props.selectFriend, props.friendData]);
    } else {
      const data = [...props.selectFriend].filter((one) => one !== props.friendData);
      props.setSelectFriend(data);
    }
  };

  return (
    <Container choose={select} onClick={clickHandle}>
      <ProfileContainer>
        {profileImg ? (
          <Image
            src={profileImg}
            alt="프로필 이미지"
            width={65}
            height={65}
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <ProfileImg />
        )}
        <NameTag>
          <b>{props.friendData.name}</b>
        </NameTag>
      </ProfileContainer>
    </Container>
  );
}

type ButtonProps = {
  choose: boolean;
};

const Container = styled.button`
  padding: 1rem;
  width: 100%;
  border: 2px solid;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.3);
  background: ${(props: ButtonProps) =>
    props.choose === true ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 1)"};
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1.5rem;
  width: 100%;
`;

const ProfileImg = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 4px;
`;

const NameTag = styled.div`
  font-size: 1.4rem;
`;
