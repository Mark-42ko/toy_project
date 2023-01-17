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
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ChatRoomsList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>("");
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
        console.log("여기");
      }
    };
    const messageHandlers = (chat: any) => null;
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandlers);
    };
  }, []);

  useEffect(() => {
    setProfileImg("");
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
  }, []);

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
          if (jsons.data.user[a].name !== jsons.data.username) {
            setNameTag(jsons.data.user[a].name);
          }
        }
      } else {
        setNameTag(jsons.data.user[1].name + " 외" + (jsons.data.user.length - 1) + " 명");
      }
    })();
  }, [rendering, props.roomData]);

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
      {profileImg !== "" ? (
        <ProfileImg profileImg={profileImg}>
          {notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}
        </ProfileImg>
      ) : (
        <ImgDiv>{notReadCounts !== 0 && <NotReadText>{notReadCounts}</NotReadText>}</ImgDiv>
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
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  border: none;
  border-radius: 4px;
  align-items: center;
  border: 2px solid;
  border-color: rgba(112, 200, 255, 1);
  padding: 0.5rem;
  background: ${({ selected }) => (selected ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 1)")};
  cursor: pointer;
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  min-width: 65px;
  width: 65px;
  height: 65px;
  border-radius: 4px;
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

const LastOrder = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
  font-size: 1rem;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
`;

const NotReadText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background-color: rgba(231, 4, 30, 0.87);
  color: rgba(255, 255, 255, 1);
  font-size: 1rem;
`;

type Profile = {
  profileImg: any;
};

const ProfileImg = styled.div`
  background-image: ${(props: Profile) => "url(" + props.profileImg + ")"};
  background-size: cover;
  background-size: 100% 100%;
  min-width: 65px;
  width: 65px;
  height: 65px;
  border-radius: 4px;
`;
