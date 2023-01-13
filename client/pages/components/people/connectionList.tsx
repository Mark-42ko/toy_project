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
    <ListButton onClick={() => setCheck(!check)} check={check}>
      {check ? (
        <ChevronDown style={{ width: 20, height: 20 }} />
      ) : (
        <ChevronRight style={{ width: 20, height: 20 }} />
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

type Button = {
  check: boolean;
};

const ListButton = styled.button`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  border: 2px solid;
  border-radius: 4px;
  border-color: rgba(112, 200, 255, 1);
  background: ${(props: Button) => (props.check ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 1)")};
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
`;

const ListTag = styled.span`
  font-size: 1.5rem;
`;
