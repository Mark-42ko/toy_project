import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChatLeftFill } from "@styled-icons/bootstrap/ChatLeftFill";
import { PeopleFill } from "@styled-icons/bootstrap/PeopleFill";

type Props = {
  data: string;
  navController: string;
  setNavController: Function;
};

export default function Button(props: Props) {
  const [choose, setChoose] = useState<boolean>(false);

  useEffect(() => {
    props.data === "mail" && setChoose(true);
    props.navController !== props.data && setChoose(false);
  }, [props.navController]);

  const chooseHandler = () => {
    props.setNavController(props.data);
    setChoose(true);
  };

  return (
    <Buttons choose={choose} onClick={chooseHandler}>
      {props.data === "people" ? (
        <PeopleFill width={32} height={32} />
      ) : (
        <ChatLeftFill width={26} height={24} />
      )}
    </Buttons>
  );
}

type ButtonProps = {
  choose: boolean;
};

const Buttons = styled.button`
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props: ButtonProps) =>
    props.choose ? "rgba(41, 40, 51, 1)" : "rgba(52, 51, 67, 1)"};
  cursor: pointer;
  svg {
    fill: ${(props: ButtonProps) =>
      props.choose ? "rgba(255, 81, 0, 1)" : "rgba(153, 151, 172, 1)"};
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
`;
