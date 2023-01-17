import styled from "styled-components";
import Button from "./Button";
import { LogOut } from "@styled-icons/boxicons-regular/LogOut";
import { useRouter } from "next/router";
import Image from "next/image";

type ButtonIcon = [text: string, text: string];

const buttonIcon: ButtonIcon = ["people", "mail"];

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
              key={one}
              navController={props.navController}
              setNavController={props.setNavController}
            />
          );
        })}
      </ButtonDiv>
      <LogoutButtonBox onClick={logOutHandle}>
        <Image src={"/images/logOut.svg"} alt="로그아웃" width={24} height={24} />
      </LogoutButtonBox>
    </SideMenu>
  );
}

const SideMenu = styled.div`
  width: 88px;
  background-color: rgba(52, 51, 67, 1);
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  padding: 16px 0px 16px 0px;
  align-items: center;
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
  background: rgba(52, 51, 67, 1);

  cursor: pointer;
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;
