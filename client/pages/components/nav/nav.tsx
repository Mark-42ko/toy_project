import styled from "styled-components";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

type ButtonIcon = [text: string, text: string];

const buttonIcon: ButtonIcon = ["people", "mail"];

type Props = {
  navController: string;
  setNavController: Function;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export default function Nav(props: Props) {
  const [profileImg, setProfileImg] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
    if (userData && accessToken) {
      const extension = userData.filename.split(".")[userData.filename.split(".").length - 1];
      if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "gif" ||
        extension === "webp"
      ) {
        !(async function () {
          const result = await fetch(`${SERVER_URI}/blah/download?filename=${userData.filename}`, {
            method: "GET",
            headers: {
              Authorization: `bearer ${accessToken}`,
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const file = await result.blob();
          const downloadUrl = window.URL.createObjectURL(file);
          setProfileImg(downloadUrl);
        })();
      }
    }
  }, []);

  const logOutHandle = async () => {
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
    console.log(userData);
    await fetch(`${SERVER_URI}/online/delete`, {
      method: "POST",
      body: JSON.stringify({
        email: userData.userId,
        name: userData.username,
        phoneNumber: userData.userPhoneNumber,
        filename: userData.filename,
      }),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userToken");
    router.push("/account/signIn");
  };

  return (
    <SideMenu>
      <ButtonDiv>
        {profileImg ? (
          <Image
            src={profileImg}
            alt="프로필 이미지"
            width={56}
            height={56}
            style={{ border: "2px solid rgba(153, 151, 172, 1)", borderRadius: "50%" }}
          />
        ) : (
          <ImgDiv />
        )}
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
  gap: 22px;
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  min-width: 56px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
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
