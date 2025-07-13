"use client";

import { useState, useEffect } from "react";
import UserInfoModal from "./UserInfoModal";

export default function ModalProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("openUserInfoModal", handleOpenModal);

    return () => {
      window.removeEventListener("openUserInfoModal", handleOpenModal);
    };
  }, []);

  return (
    <UserInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  );
}
