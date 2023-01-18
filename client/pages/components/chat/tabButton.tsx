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
  width: 69px;
  height: 33px;
  border: none;
  border-radius: 10px;
  align-items: center;
  color: ${(props: ButtonProps) =>
    props.choose === true ? "rgba(255, 255, 255, 1)" : "rgba(153, 151, 172, 1)"};
  background: ${(props: ButtonProps) =>
    props.choose === true ? "rgba(255, 81, 0, 1)" : "rgba(244, 243, 251, 1)"};

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;

  cursor: pointer;
`;
