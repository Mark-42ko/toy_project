import styled from "styled-components";
import { People } from "@styled-icons/fluentui-system-filled/People";
import { ChatbubbleEllipses } from "@styled-icons/ionicons-sharp/ChatbubbleEllipses";
import { Robot } from "@styled-icons/fa-solid/Robot";
import Button from "./Button";
import { LogOut } from "@styled-icons/boxicons-regular/LogOut";
import { useRouter } from "next/router";

type ButtonIcon = [{ text: string; icon: JSX.Element }, { text: string; icon: JSX.Element }];

const buttonIcon: ButtonIcon = [
  { text: "people", icon: <People /> },
  { text: "mail", icon: <ChatbubbleEllipses /> },
];

type Props = {
  navController: string;
  setNavController: Function;
};

export default function Nav(props: Props) {
  const router = useRouter();

  const logOutHandle = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    router.push("/account/signIn");
  };

  return (
    <SideMenu>
      <ButtonDiv>
        {buttonIcon.map((one) => {
          return (
            <Button
              data={one}
              key={one.text}
              navController={props.navController}
              setNavController={props.setNavController}
            />
          );
        })}
      </ButtonDiv>
      <LogoutButtonBox onClick={logOutHandle}>
        <LogOut />
      </LogoutButtonBox>
    </SideMenu>
  );
}

const SideMenu = styled.div`
  width: 60px;
  background-color: rgba(112, 200, 255, 1);
  padding: 1rem;
  height: calc(100vh - (1rem * 2));
  display: flex;
  flex-direction: column;
  gap: 1rem 0;
  justify-content: space-between;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const LogoutButtonBox = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(112, 200, 255, 1);
  cursor: pointer;
  svg {
    width: 60px;
    height: 60px;
    color: rgba(255, 255, 255, 1);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

