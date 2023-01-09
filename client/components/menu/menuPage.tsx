import styled from "styled-components";
import Mail from "./mail";
import People from "./people";

type Props = {
  navController: string;
};

export default function MenuPage(props: Props) {
  return (
    <>
      <MenuContainer>
        {props.navController === "people" && <People />}
        {props.navController === "mailInBox" && <Mail />}
        {props.navController === "ListUl" && null}
        {props.navController === "Award" && null}
        {props.navController === "Robot" && null}
        {props.navController === "send" && null}
      </MenuContainer>
    </>
  );
}

const MenuContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0em 2em;
`;
