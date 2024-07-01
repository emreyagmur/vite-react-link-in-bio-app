import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/store/apiUrl";
import React from "react";
import { useParams } from "react-router-dom";
import { IUserLink } from "../link/_store/link";
import { ReactSocialMediaIcons } from "react-social-media-icons";
import nouser from "@/assets/nouser.jpg";

const ClientPage = () => {
  const { username } = useParams();

  const [getUserSetting, setGetUserSetting] = React.useState(null);
  const [getUserLink, setGetUserLink] = React.useState<IUserLink[] | null>(
    null
  );
  const [getUserButton, setGetUserButton] = React.useState<IUserLink[] | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${BASE_URL}/user-profile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const { userSetting, userLink } = response;
        setGetUserSetting(userSetting);
        const links = userLink?.filter(
          (l: Partial<IUserLink>) => l.linkType === "link"
        );
        const buttons = userLink?.filter(
          (l: Partial<IUserLink>) => l.linkType === "button"
        );
        setGetUserLink(links);
        setGetUserButton(buttons);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          loading
        </div>
      ) : !getUserSetting ? (
        <div className="flex w-full justify-center">
          <p>User Not Fount</p>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full py-5 items-center">
          <div className="max-w-lg w-full h-min py-3">
            <div className="flex flex-col items-center justify-center gap-2 mb-5">
              <img
                src={getUserSetting?.userAvatar || nouser}
                alt="user-background"
                className="w-20 h-20 rounded-full ring-4 ring-white object-cover"
              />
              <p className="font-medium text-2xl">
                {getUserSetting.displayName}
              </p>
              <p className="font-semibold">{getUserSetting?.description}</p>
              <div>
                {getUserButton &&
                  getUserButton.map((b) =>
                    b?.icon ? (
                      <span
                        key={b._id}
                        className="cursor-pointer"
                        onClick={() => window.open(b.url, "_blank")}
                      >
                        <ReactSocialMediaIcons
                          roundness={50}
                          icon={b?.icon}
                          size="33"
                          url={null}
                        />
                      </span>
                    ) : null
                  )}
              </div>
            </div>

            <div className="w-full gap-3">
              {getUserLink &&
                getUserLink.map((l) => (
                  <Card
                    key={l._id}
                    className="flex flex-row items-center p-3 mb-4 cursor-pointer"
                    onClick={() => window.open(l.url, "_blank")}
                  >
                    <div className="w-[43px] mr-4">
                      {l?.icon ? (
                        <ReactSocialMediaIcons
                          roundness={50}
                          icon={l?.icon}
                          size="43"
                          url={null}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-sm font-semibold">{l?.title}</p>
                      <p className="text-xs">{l?.title}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ClientPage;
