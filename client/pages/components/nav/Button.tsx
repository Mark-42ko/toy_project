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
  border: none;
  cursor: pointer;
  width: 100%;
  height: 50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props: ButtonProps) => (props.choose ? "#FFFFFF" : "#F2F2F2")};

  svg {
    width: 40px;
    height: 40px;
  }
`;
