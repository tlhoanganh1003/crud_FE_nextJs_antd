/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ThongTinTaiSan from "./components/thongTinTaiSan";
import Giatri from "./components/GiaTri";
import Dientich from "./components/Dientich";
import HoSo from "./components/HoSo";
import { SaveButton } from "@/components/SaveButton";
import { SaveProvider } from "@/components/SaveContext";

export default function TangMoi() {
  return (
    <SaveProvider>
      <div className="border border-gray-400 p-2 rounded-md">
        <ThongTinTaiSan />
        <Giatri />
        <Dientich />
        <HoSo />
        <SaveButton />
      </div>
    </SaveProvider>
  );
}



