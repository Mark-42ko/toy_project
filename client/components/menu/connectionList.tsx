import styled from "styled-components";
import { RightArrowAlt } from "@styled-icons/boxicons-regular/RightArrowAlt";
import { DownArrowAlt } from "@styled-icons/boxicons-regular/DownArrowAlt";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "pages/_app";

type Props = {
  tag: string;
  open: boolean;
};

export default function ConnectionList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [peopleData, setPeopleData] = useState<any>();
  const ctx = useContext(GlobalContext);
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  useEffect(() => {
    !(async function () {
      const reponse = await fetch(`${SERVER_URI}/people?email=${ctx?.userData?.userId}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${ctx?.accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await reponse.json();
      setPeopleData(json);
    })();
  }, [props.open]);

  return (
    <ListButton onClick={() => setCheck(!check)}>
      {check ? (
        <DownArrowAlt style={{ width: 20, height: 20 }} />
      ) : (
        <RightArrowAlt style={{ width: 20, height: 20 }} />
      )}
      {props.tag === "온라인" && peopleData && (
        <ListTag>
          {props.tag} (0/{peopleData[0] ? peopleData[0].friend.length : 0})
        </ListTag>
      )}
      {props.tag === "오프라인" && peopleData && (
        <ListTag>
          {props.tag} (0/{peopleData[0] ? peopleData[0].friend.length : 0})
        </ListTag>
      )}
      {props.tag === "보낸요청" && peopleData && <ListTag>{props.tag} (0/0)</ListTag>}
      {props.tag === "받은요청" && peopleData && <ListTag>{props.tag} (0/0)</ListTag>}
    </ListButton>
  );
}

const ListButton = styled.button`
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
`;

const ListTag = styled.span`
  font-size: 1rem;
`;
