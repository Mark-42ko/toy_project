import styled from "styled-components";
import { ChevronRight } from "@styled-icons/fa-solid/ChevronRight";
import { ChevronDown } from "@styled-icons/fa-solid/ChevronDown";
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
      setPeopleData(json.data);
    })();
  }, [props.open]);

  return (
    <ListButton onClick={() => setCheck(!check)}>
      {check ? (
        <ChevronDown style={{ width: 10, height: 10 }} />
      ) : (
        <ChevronRight style={{ width: 10, height: 10 }} />
      )}
      {props.tag === "온라인" && <ListTag>{props.tag} (0)</ListTag>}
      {props.tag === "오프라인" && <ListTag>{props.tag} (0)</ListTag>}
      {props.tag === "보낸요청" && <ListTag>{props.tag} (0)</ListTag>}
      {props.tag === "받은요청" && <ListTag>{props.tag} (0)</ListTag>}
    </ListButton>
  );
}

const ListButton = styled.button`
  width: 150px;
  height: 17px;
  display: flex;
  align-items: center;
  border: none;
  background: rgba(255, 255, 255, 1);
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
