import styled from "styled-components";
import { People } from "@styled-icons/fluentui-system-filled/People";
import { MailInbox } from "@styled-icons/fluentui-system-filled/MailInbox";
import { ListUl } from "@styled-icons/bootstrap/ListUl";
import { Award } from "@styled-icons/bootstrap/Award";
import { Robot } from "@styled-icons/fa-solid/Robot";
import { Send } from "@styled-icons/bootstrap/Send";
import Button from "./Button";
import { LogOut } from "@styled-icons/boxicons-regular/LogOut";
import { useRouter } from "next/router";

type ButtonIcon = [
  { text: string; icon: JSX.Element },
  { text: string; icon: JSX.Element },
  { text: string; icon: JSX.Element },
  { text: string; icon: JSX.Element },
  { text: string; icon: JSX.Element },
  { text: string; icon: JSX.Element },
];

const buttonIcon: ButtonIcon = [
  { text: "people", icon: <People /> },
  { text: "mail", icon: <MailInbox /> },
  { text: "ListUl", icon: <ListUl /> },
  { text: "Award", icon: <Award /> },
  { text: "Robot", icon: <Robot /> },
  { text: "send", icon: <Send /> },
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
      <div>
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
      </div>
      <ButtonBox onClick={logOutHandle}>
        <LogOut style={{ width: "40px", height: "40px" }} />
      </ButtonBox>
    </SideMenu>
  );
}

const ButtonBox = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SideMenu = styled.div`
  width: 50px;
  background-color: #f2f2f2;
  padding: 1rem;
  height: calc(100vh - (1rem * 2));
  display: flex;
  flex-direction: column;
  gap: 1rem 0;
  justify-content: space-between;
`;
