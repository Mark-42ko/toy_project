import styled from "styled-components";
import Chat from "../chat/chat";
import People from "../people/people";

type Props = {
  navController: string;
};

export default function MenuPage(props: Props) {
  return (
    <>
      <MenuContainer>
        {props.navController === "people" && <People />}
        {props.navController === "mail" && <Chat />}
        {props.navController === "Robot" && null}
      </MenuContainer>
    </>
  );
}

const MenuContainer = styled.div`
  width: calc(100vw - 88px);
  height: 100%;
`;
