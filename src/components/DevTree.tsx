import { Toaster } from "sonner";
import { SocialNetwork, User } from "../types";
import NavigationTabs from "./NavigationTabs";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import DevtreeLink from "./DevtreeLink";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

type DevTreeProps = {
  data: User;
};

const DevTree = ({ data }: DevTreeProps) => {
  const [enableLinks, setEnableLinks] = useState<SocialNetwork[]>(
    JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
  );

  useEffect(() => {
    setEnableLinks(
      JSON.parse(data.links).filter((item: SocialNetwork) => item.enabled)
    );
  }, [data]);

  const queryClient = useQueryClient();
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && over.id) {
      const prevIdx = enableLinks.findIndex((link) => {
        return link.id === active.id;
      });
      const newIdx = enableLinks.findIndex((link) => {
        return link.id === over.id;
      });

      const order = arrayMove(enableLinks, prevIdx, newIdx);
      setEnableLinks(order);
      const disableLinks: SocialNetwork[] = JSON.parse(data.links).filter(
        (item: SocialNetwork) => !item.enabled
      );
      const links = order.concat(disableLinks);
      queryClient.setQueryData(["user"], (prevData: User) => {
        return {
          ...prevData,
          links: JSON.stringify(links),
        };
      });
    }
  };

  return (
    <>
      <header className="bg-slate-800 py-5">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
          <div className="w-full p-5 lg:p-0 md:w-1/3">
            <img src="/logo.svg" className="w-full block" alt="App Logo" />
          </div>
          <div className="md:w-1/3 md:flex md:justify-end">
            <button
              className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
              onClick={() => {}}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>
      <div className="bg-gray-100 min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visit My Profile: /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-4xl text-center text-white">{data.handle}</p>

              {data.image && (
                <img
                  src={data.image}
                  alt="profile picture"
                  className="mx-auto max-w-[250px]"
                />
              )}
              <p className="text-center text-white text-lg font-black">
                {data.description}
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="mt-20 flex flex-col gap-5">
                  <SortableContext
                    items={enableLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enableLinks.map((link) => (
                      <DevtreeLink key={link.name} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default DevTree;
