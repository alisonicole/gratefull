import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Toast from "@/components/ui/Toast";

export default function AppShell() {
  return (
    <div className="bg-dream min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <Toast />
    </div>
  );
}