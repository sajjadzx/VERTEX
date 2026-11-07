import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERTEX — Moving Beyond Limits | Elevator & Escalator Technologies",
  description:
    "Engineering vertical mobility. Premium high-velocity traction elevators, machine room-less architecture, and heavy-duty urban mobility systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
