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
        {props.navController === "mail" && <Mail />}
        {props.navController === "Robot" && null}
      </MenuContainer>
    </>
  );
}

const MenuContainer = styled.div`
  width: 90vw;
  height: 100%;
  padding: 0em 1em;
`;
