import styled from "styled-components";
import { People } from "@styled-icons/fluentui-system-filled/People";
import { MailInbox } from "@styled-icons/fluentui-system-filled/MailInbox";
import { ListUl } from "@styled-icons/bootstrap/ListUl";
import { Award } from "@styled-icons/bootstrap/Award";
import { Robot } from "@styled-icons/fa-solid/Robot";
import { Send } from "@styled-icons/bootstrap/Send";
import Button from "./Button";
import { signOut } from "next-auth/react";
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
  { text: "mailInBox", icon: <MailInbox /> },
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
    signOut({ redirect: false });
    router.push("/");
  };

  return (
    <SideMenu>
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
      <ButtonBox onClick={logOutHandle}>
        <LogOut style={{ width: 35, height: 35 }} />
      </ButtonBox>
    </SideMenu>
  );
}

const ButtonBox = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  padding: 0.25em 0.7em;
`;

const SideMenu = styled.div`
  width: 50px;
  height: 95vh;
  background-color: #f2f2f2;
`;
