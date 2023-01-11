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
    props.title === "진행중" && setChoose(true);
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
  padding: 1em 1em;
  border: none;
  border-radius: 10px;
  width: 32%;
  align-items: center;
  cursor: pointer;
  background: ${(props: ButtonProps) => (props.choose === true ? "#FFFFFF" : "#F2F2F2")};
`;
