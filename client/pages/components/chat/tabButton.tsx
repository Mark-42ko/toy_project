import styled from "styled-components";
import { useState, useEffect } from "react";

type Props = {
  title: string;
  tabHandle: string;
  setTabHandle: Function;
};

export default function TabButton(props: Props) {
  const [choose, setChoose] = useState<boolean>(false);

  useEffect(() => {
    props.title === "대화중" && setChoose(true);
    props.tabHandle !== props.title && setChoose(false);
  }, [props.tabHandle]);

  const clickHandle = () => {
    props.setTabHandle(props.title);
    setChoose(true);
  };

  return (
    <Button choose={choose} onClick={clickHandle}>
      <b>{props.title}</b>
    </Button>
  );
}

type ButtonProps = {
  choose: boolean;
};

const Button = styled.button`
  height: 100%;
  border: none;
  border-radius: 4px;
  width: 49%;
  font-size: 1.1rem;
  align-items: center;
  cursor: pointer;
  color: ${(props: ButtonProps) =>
    props.choose === true ? "rgba(112, 200, 255, 1)" : "rgba(255, 255, 255, 1)"};
  background: ${(props: ButtonProps) =>
    props.choose === true ? "rgba(255, 255, 255, 1)" : "rgba(112, 200, 255, 1)"};
`;
