import { redirect } from "next/navigation";

export default function Home() {
  // The app entry point is the login screen; send users straight there.
  redirect("/login");
}
