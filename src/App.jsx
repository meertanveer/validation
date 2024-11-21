import "./App.css";
import VlookUp from "./components/vlookup/vlookup";
import logo from "./assets/logo.png";
import NetMeter from "./components/netMeter/netMeter";
import Swal from "sweetalert2";
import { useState } from "react";
import RemoveDuplicate from "./components/removeDuplicate/removeDuplicate";
import RemoveDuplicateRow from "./components/removeDuplicateRow/removeDuplicateRow";
import Footer from "./components/footer/footer";
function App() {
  const toolsList = [
    "Perform VlookUp",
    "Remove Records by VlookUp",
    "Remove Duplicate based on selected Column",
    "Remove Entire Row Duplicates",
  ];
  const [tools, setTools] = useState("Perform VlookUp");
  const [active, setActive] = useState(sessionStorage.getItem("active"));

  if (!active) {
    Swal.fire({
      title: "Tanveer Hussain Mir",
      text: "😊",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Enter",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("active", true);
      }
    });
  }

  return (
    <>
      <div className="bg-green-700 h-20 flex items-center justify-center gap-2">
        <img src={logo} alt="" width={40} height={40} />
        <span className="text-3xl text-white ">Excel Pro</span>
      </div>
     <div className="min-h-screen">
     <div className="flex justify-center items-center gap-6 mt-10 ">
        <label className="text-green-600">Select Tool : </label>
        <select
          onChange={(e) => setTools(e.target.value)}
          className="border outline-none shadow-lg px-4 py-1 bg-green-700 text-white rounded-md w-[400px]"
        >
          {toolsList.map((t, index) => {
            return <option key={index}>{t}</option>;
          })}
        </select>
      </div>
      {tools.length > 0 && tools === "Perform VlookUp" ? (
        <VlookUp />
      ) : tools === "Remove Records by VlookUp" ? (
        <NetMeter />
      ) : tools === "Remove Entire Row Duplicates" ? (
        <RemoveDuplicateRow />
      ) : tools === "Remove Duplicate based on selected Column" ? (
        <RemoveDuplicate />
      ) : (
        <div className="flex items-center justify-center text-red-500 mt-10">
          <p>Oops... Tool Under Development</p>
        </div>
      )}
     </div>
      <Footer />
    </>
  );
}

export default App;
