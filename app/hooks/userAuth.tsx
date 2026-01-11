import { useSelector } from "react-redux";
export default function useAuth() {
  const { user } = useSelector((state: any) => state.auth);
  // Only treat a real user as authenticated (guest/null/empty should be logged out)
  return !!user && typeof user === "object" && !!user._id;
}