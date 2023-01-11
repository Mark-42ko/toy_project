import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

type Props = {
  tabHandle: string;
  roomData: any;
  setChatRoom: Function;
  chatRoom: any;
  userDatas: any;
  rerendering: number;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export default function MailList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>();
  const [notReadCounts, setNotReadCounts] = useState<number>(0);

  let nameTag;
  let lastOder;

  if (props.roomData.user.length === 2) {
    for (let a = 0; a < 2; a++) {
      if (props.roomData.user[a].name !== props.userDatas.username) {
        nameTag = props.roomData.user[a].name;
      }
    }
  } else {
    nameTag = props.roomData.user[1].name + " 외" + (props.roomData.user.length - 1) + " 명";
  }

  if (props.roomData.blah[0]) {
    if (props.roomData.blah[props.roomData.blah.length - 1].comments) {
      lastOder = props.roomData.blah[props.roomData.blah.length - 1].comments;
    } else {
      lastOder = "";
    }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
    !(async function () {
      if (props.roomData.user.length === 2) {
        for (let i = 0; i < 2; i++) {
          if (props.roomData.user[i].name !== userData.username) {
            const extension =
              props.roomData.user[i].filename.split(".")[
                props.roomData.user[i].filename.split(".").length - 1
              ];
            if (
              extension === "jpg" ||
              extension === "jpeg" ||
              extension === "png" ||
              extension === "gif"
            ) {
              const result = await fetch(
                `${SERVER_URI}/blah/download?filename=${props.roomData.user[i].filename}`,
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
        }
      } else {
        if (props.roomData.blah[0]) {
          if (props.roomData.blah[props.roomData.blah.length - 1].profile) {
            const extension =
              props.roomData.blah[props.roomData.blah.length - 1].profile.split(".")[
                props.roomData.blah[props.roomData.blah.length - 1].profile.split(".").length - 1
              ];
            if (
              extension === "jpg" ||
              extension === "jpeg" ||
              extension === "png" ||
              extension === "gif"
            ) {
              const result = await fetch(
                `${SERVER_URI}/blah/download?filename=${
                  props.roomData.blah[props.roomData.blah.length - 1].profile
                }`,
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
        }
      }
    })();
  }, [props.chatRoom, lastOder, props.rerendering]);

  useEffect(() => {
    props.roomData !== props.chatRoom && setCheck(false);
  }, [props.chatRoom]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
    !(async function () {
      const result = await fetch(`${SERVER_URI}/blah/notRead`, {
        method: "POST",
        body: JSON.stringify({
          _id: props.roomData._id,
          email: userData.userId,
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await result.json();
      setNotReadCounts(json);
    })();
  }, [props.chatRoom, lastOder, props.rerendering, check]);

  const clickHandle = () => {
    setCheck(true);
    props.setChatRoom(props.roomData);
  };

  return (
    <ButtonContainer selected={check} onClick={clickHandle}>
      {notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}
      {profileImg ? (
        <Image
          src={profileImg}
          alt="프로필이미지"
          width={65}
          height={65}
          style={{ borderRadius: "8px" }}
        />
      ) : (
        <ImgDiv />
      )}
      <SmallContainer>
        <div>
          <NameTag>
            <b>{nameTag}</b>
          </NameTag>
        </div>
        <LastOrder>{lastOder}</LastOrder>
      </SmallContainer>
    </ButtonContainer>
  );
}

type ButtonProps = {
  selected: boolean;
};

const ButtonContainer = styled.button<ButtonProps>`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  border: none;
  border-radius: 8px;
  align-items: center;
  background: ${({ selected }) => (selected ? "#F2F2F2" : "#fff")};
  position: sticky;
  cursor: pointer;
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 8px;
`;

const SmallContainer = styled.div`
  width: 80%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  padding-left: 15px;
`;

const NameTag = styled.a`
  font-size: 1rem;
`;

const LastOrder = styled.a`
  font-size: 1rem;
`;

const NotReadText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  border-radius: 50%;
  background-color: #ff0000;
  color: #ffffff;
  font-size: 1rem;
`;
