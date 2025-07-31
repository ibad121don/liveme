"use client";

import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import plus from "@/public/plus-icon.svg";
import CreateLiveStreamModal from "./CreateLiveStreamModal";

interface LiveStreamHeaderProps {
  onCreate: (data: { streamTitle: string; date: string; platform: string }) => void;
}

export default function LiveStreamHeader({ onCreate }: LiveStreamHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center w-full bg-[#F9FAFB] py-4 flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B58]">
          Live Streams
        </h1>

        <div className="flex gap-4 items-center">
          <PrimaryButton
            text="Create Live Stream"
            icon={
              <Image
                src={plus}
                alt="Plus Icon"
                width={14}
                height={14}
                className="w-2 md:w-4"
              />
            }
            className="text-xs md:text-auto"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      <CreateLiveStreamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreate}
      />
    </>
  );
}
