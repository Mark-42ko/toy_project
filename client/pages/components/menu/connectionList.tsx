import styled from "styled-components";
import { RightArrowAlt } from "@styled-icons/boxicons-regular/RightArrowAlt";
import { DownArrowAlt } from "@styled-icons/boxicons-regular/DownArrowAlt";
import { useState, useEffect } from "react";

type Props = {
  tag: string;
  open: boolean;
};

export default function ConnectionList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [peopleData, setPeopleData] = useState<any>();
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
  useEffect(() => {
    if (userData && accessToken) {
      !(async function () {
        const reponse = await fetch(
          `${SERVER_URI}/people/readPeople?username=${userData.username}`,
          {
            method: "GET",
            headers: {
              Authorization: `bearer ${accessToken}`,
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          },
        );
        const json = await reponse.json();
        setPeopleData(json.data);
      })();
    }
  }, [props.open]);

  return (
    <ListButton onClick={() => setCheck(!check)}>
      {check ? (
        <DownArrowAlt style={{ width: 20, height: 20 }} />
      ) : (
        <RightArrowAlt style={{ width: 20, height: 20 }} />
      )}
      {props.tag === "온라인" && (
        <ListTag>
          {props.tag} (0/{peopleData ? peopleData.friend.length : 0})
        </ListTag>
      )}
      {props.tag === "오프라인" && (
        <ListTag>
          {props.tag} (0/{peopleData ? peopleData.friend.length : 0})
        </ListTag>
      )}
      {props.tag === "보낸요청" && <ListTag>{props.tag} (0/0)</ListTag>}
      {props.tag === "받은요청" && <ListTag>{props.tag} (0/0)</ListTag>}
    </ListButton>
  );
}

const ListButton = styled.button`
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  cursor: pointer;
`;

const ListTag = styled.span`
  font-size: 1rem;
`;
