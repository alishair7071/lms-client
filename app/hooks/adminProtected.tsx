"use client";
import { redirect } from "next/navigation";
import useAuth from "./userAuth";
import { useSession } from "next-auth/react";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import { useSelector } from "react-redux";

type AdminProtectedProps = {
  children: React.ReactNode;
}

const AdminProtected= ({children}: AdminProtectedProps) => {

    const { user } = useSelector((state: any) => state.auth);
    if (user) {
      const isAdmin = user?.role === "admin";
      return isAdmin ? children : redirect("/");
    }
}

export default AdminProtected;