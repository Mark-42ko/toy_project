import styled from "styled-components";
import { useState, useEffect } from "react";

type Props = {
  data: { text: string; icon: JSX.Element };
  navController: string;
  setNavController: Function;
};

export default function Button(props: Props) {
  const [choose, setChoose] = useState<boolean>(false);

  useEffect(() => {
    props.data.text === "mail" && setChoose(true);
    props.navController !== props.data.text && setChoose(false);
  }, [props.navController]);

  const chooseHandler = () => {
    props.setNavController(props.data.text);
    setChoose(true);
  };

  return (
    <Buttons choose={choose} onClick={chooseHandler}>
      {props.data.icon}
    </Buttons>
  );
}

type ButtonProps = {
  choose: boolean;
};

const Buttons = styled.button`
  border: 2px solid;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(112, 200, 255, 1);
  border-color: ${(props: ButtonProps) =>
    props.choose ? "rgba(255, 255, 255, 1)" : "rgba(112, 200, 255, 1)"};

  svg {
    width: 50px;
    height: 50px;
    color: rgba(255, 255, 255, 1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;
