import DevTreeInput from "../components/DevTreeInput";
import { social } from "../data/social";
import { useEffect, useState } from "react";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeApi";
import { SocialNetwork, User } from "../types";

const LinkTreeView = () => {
  const [devTreeLinks, setDevTreeLinks] = useState(social);
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(["user"])!;
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Profile updated");
    },
  });

  useEffect(() => {
    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name
      );
      return userLink
        ? { ...item, url: userLink.url, enabled: userLink.enabled }
        : item;
    });

    setDevTreeLinks(updatedData);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updateLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    );
    // queryClient.setQueryData(["user"], (prevData: User) => {
    //   return { ...prevData, links: updateLinks };
    // });
    setDevTreeLinks(updateLinks);
  };

  const links: SocialNetwork[] = JSON.parse(user.links);

  const handleEnableLink = (socialNetwork: string) => {
    const updateLinks = devTreeLinks.map((link) => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("Not valid url");
        }
      }
      return link;
    });

    setDevTreeLinks(updateLinks);
    let updatedItems: SocialNetwork[] = [];
    const selectedSocialNetwork = updateLinks.find(
      (link) => link.name === socialNetwork
    );

    if (selectedSocialNetwork?.enabled) {
      const id = links.filter((link) => link.id).length + 1;
      if (links.some((link) => link.name === socialNetwork)) {
        updatedItems = links.map((link) => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id,
            };
          } else {
            return link;
          }
        });
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id: links.length + 1,
        };
        updatedItems = [...links, newItem];
      }
    } else {
      const socialLinkDisableIdx = links.findIndex(
        (link) => link.name === socialNetwork
      );

      updatedItems = links.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false,
          };
        } else if (
          link.id > socialLinkDisableIdx &&
          socialLinkDisableIdx !== 0 &&
          link.id === 1
        ) {
          return {
            ...link,
            id: link.id - 1,
          };
        } else {
          return link;
        }
      });
    }
    //save in databe, here setQuery do a refetch
    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems),
      };
    });
  };

  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="bg-cyan-400 p-2 uppercase font-bold text-slate-600 w-full text-lg rounded"
          onClick={() => mutate(queryClient.getQueryData(["user"])!)}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default LinkTreeView;
