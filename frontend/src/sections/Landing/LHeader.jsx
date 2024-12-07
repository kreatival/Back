import NavbarLanding from "../../components/landing/NavbarLanding";
import LBanner from "./LBanner";

export default function LHeader() {
  return (
    <div
      className="sm:h-screen flex flex-col gap-7"
      style={{
        backgroundImage: "linear-gradient(to bottom, #FAFDFF, #DBE5FF)",
      }}
    >
      <NavbarLanding />
      <div className="flex justify-center h-full">
        <LBanner />
      </div>
    </div>
  );
}
