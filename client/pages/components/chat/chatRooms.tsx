import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";

type Props = {
  tabHandle: string;
  roomData: any;
  setChatRoom: Function;
  chatRoom: any;
  userDatas: any;
  rerendering: number;
  chatRoomsRender: number;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ChatRoomsList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string[]>([]);
  const [notReadCounts, setNotReadCounts] = useState<number>(0);
  const [lastOder, setLastOder] = useState<string>();
  const [nameTag, setNameTag] = useState<string>();
  const [rendering, setRendering] = useState<number>(0);
  const [connection, setConnection] = useState<any>();

  useEffect(() => {
    socket.emit("join-room", props.roomData._id, () => {});
    const messageHandler = (chat: any) => {
      if (chat.roomName) {
        setRendering(Math.random());
      }
    };
    const messageHandlers = (chat: any) => null;
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandlers);
    };
  }, []);

  useEffect(() => {
    setProfileImg([]);
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
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
              setProfileImg([downloadUrl]);
            }
          }
        }
      } else {
        const data = [];
        for (let a = 0; a < props.roomData.user.length; a++) {
          const result = await fetch(
            `${SERVER_URI}/blah/download?filename=${props.roomData.user[a].filename}`,
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
          data.push(downloadUrl);
        }
        setProfileImg(data);
      }
    })();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
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
      const response = await fetch(`${SERVER_URI}/blah/room?id=${props.roomData._id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const jsons = await response.json();
      setConnection(jsons.data);
      if (jsons.data.blah[0]) {
        if (jsons.data.blah[jsons.data.blah.length - 1].comments) {
          setLastOder(jsons.data.blah[jsons.data.blah.length - 1].comments);
        } else {
          setLastOder("");
        }
      }
      if (jsons.data.user.length === 2) {
        for (let a = 0; a < 2; a++) {
          if (jsons.data.user[a].name !== userData.username) {
            setNameTag(jsons.data.user[a].name);
          }
        }
      } else {
        setNameTag(jsons.data.user[0].name + " 외" + (jsons.data.user.length - 1) + " 명");
      }
    })();
  }, [rendering, props.roomData, props.chatRoomsRender]);

  useEffect(() => {
    if (props.chatRoom) {
      props.roomData._id === props.chatRoom._id ? setCheck(true) : setCheck(false);
    }
  }, [props.chatRoom]);

  const clickHandle = () => {
    props.setChatRoom(connection);
  };

  return (
    <ButtonContainer selected={check} onClick={clickHandle}>
      {profileImg[0] ? (
        profileImg.length === 1 ? (
          <ProfileImg profileImg={profileImg}>
            {notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}
          </ProfileImg>
        ) : (
          <ProfilesImg profileImg={profileImg}>
            {notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}
          </ProfilesImg>
        )
      ) : (
        <ImgDiv>{notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}</ImgDiv>
      )}
      <SmallContainer>
        <NameTag>{nameTag}</NameTag>
        <LastOrder>{lastOder}</LastOrder>
      </SmallContainer>
    </ButtonContainer>
  );
}

type ButtonProps = {
  selected: boolean;
};

const ButtonContainer = styled.button<ButtonProps>`
  width: 365px;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  border: ${({ selected }) => (selected ? "1px solid rgba(223, 222, 236, 1)" : "none")};
  border-radius: 10px;
  align-items: center;
  padding: 0.5rem;
  background: ${({ selected }) => (selected ? "rgba(244, 243, 251, 1)" : "rgba(255, 255, 255, 1)")};
  cursor: pointer;
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  min-width: 56px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const SmallContainer = styled.div`
  width: 80%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  padding-left: 15px;
`;

const NameTag = styled.a`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
`;

const LastOrder = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
`;

const NotReadText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 61, 0, 1);
  color: rgba(255, 255, 255, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
`;

type Profile = {
  profileImg: any;
};

const ProfileImg = styled.div`
  background-image: ${(props: Profile) => "url(" + props.profileImg[0] + ")"};
  background-size: cover;
  background-size: 100% 100%;
  min-width: 56px;
  width: 56px;
  height: 56px;
  border-radius: 28px;

  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const ProfilesImg = styled.div`
  background-image: ${(props: Profile) => {
    if (props.profileImg.length === 3) {
      return (
        "url(" +
        props.profileImg[0] +
        "), url(" +
        props.profileImg[1] +
        "), url(" +
        props.profileImg[2] +
        ")"
      );
    } else {
      return (
        "url(" +
        props.profileImg[0] +
        "), url(" +
        props.profileImg[1] +
        "), url(" +
        props.profileImg[2] +
        "), url(" +
        props.profileImg[3] +
        ")"
      );
    }
  }};
  background-size: ${(props: Profile) => {
    if (props.profileImg.length === 3) {
      return "28px 28px, 28px 28px, 56px 28px";
    } else {
      return "28px 28px, 28px 28px, 28px 28px, 28px 28px";
    }
  }};
  background-position: ${(props: Profile) => {
    if (props.profileImg.length === 3) {
      return "0px 0px, 28px 0px, 0px 28px";
    } else {
      return "0px 0px, 28px 0px, 0px 28px, 28px 28px";
    }
  }};
  background-repeat: no-repeat;
  min-width: 57px;
  width: 56px;
  height: 56px;
  border-radius: 50%;

  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
