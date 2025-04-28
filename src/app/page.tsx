"use client";

import Header from "@/components/base/Header";
import GUIEditor from "@/components/GUIEditor";
import Footer from "@/components/base/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <div className="mt-4">
          <GUIEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
}
