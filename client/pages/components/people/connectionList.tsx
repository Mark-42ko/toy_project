import styled from "styled-components";
import { ChevronRight } from "@styled-icons/fa-solid/ChevronRight";
import { ChevronDown } from "@styled-icons/fa-solid/ChevronDown";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ListCard from "./listCard";

type Props = {
  tag: string;
  open: boolean;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ConnectionList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [onlineCheck, setOnlineCheck] = useState<number>();
  const [peopleData, setPeopleData] = useState<any>();
  const [friend, setFriend] = useState<any>();

  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

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
      const result = await fetch(`${SERVER_URI}/online`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const jsons = await result.json();
      const idx = [];
      const onlineFriend = [];
      for (let a = 0; a < json.data.friend.length; a++) {
        for (let b = 0; b < jsons.data.length; b++) {
          if (json.data.friend[a].name === jsons.data[b].name) {
            onlineFriend.push(jsons.data[b]);
            idx.push(a);
          }
        }
      }
      setPeopleData(onlineFriend);
      setFriend(json.data.friend);
    })();
  }, [props.open]);

  return (
    <ListButton>
      <ListContainer onClick={() => setCheck(!check)}>
        {check ? (
          <ChevronDown style={{ width: 10, height: 10 }} />
        ) : (
          <ChevronRight style={{ width: 10, height: 10 }} />
        )}
        {props.tag === "온라인" && (
          <ListTag>
            {props.tag} ({peopleData ? peopleData.length : 0})
          </ListTag>
        )}
        {props.tag === "오프라인" && (
          <ListTag>
            {props.tag} ({peopleData ? friend.length - peopleData.length - 1 : 0})
          </ListTag>
        )}
      </ListContainer>
      {check &&
        props.tag === "온라인" &&
        peopleData[0] &&
        peopleData.map((one: any) => (
          <ListCard key={one.name} peopleData={one} friend={undefined} />
        ))}
      {check &&
        props.tag === "오프라인" &&
        friend[0] &&
        friend.map((one: any) => <ListCard key={one.name} peopleData={one} friend={peopleData} />)}
    </ListButton>
  );
}

const ListButton = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  border: none;
  background: rgba(255, 255, 255, 1);
`;

const ListContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  border: none;
  gap: 10px;
  cursor: pointer;
`;

const ListTag = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
`;
