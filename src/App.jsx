import "./App.css";
import VlookUp from "./components/vlookup/vlookup";
import logo from "./assets/logo.png";
import NetMeter from "./components/netMeter/netMeter";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import RemoveDuplicate from "./components/removeDuplicate/removeDuplicate";
import RemoveDuplicateRow from "./components/removeDuplicateRow/removeDuplicateRow";
import Footer from "./components/footer/footer";
import MultiSheetsVlookup from "./components/multiSheetsVlookup/multiSheetsVlookup";
import MyIpAddress from "./components/ipAddress/ipAddress";
import InternetSpeed from "./components/internetSpeed/internetSpeed";
import VideoLoop from "./components/screenSaver/screenSaver";
function App() {
  const toolsList = [
    "Perform VlookUp",
    "Remove Records by VlookUp",
    "Remove Duplicate based on selected Column",
    "Remove Entire Row Duplicates",
    "Multiple Sheets Vlookup"
  ];
  const [tools, setTools] = useState("Perform VlookUp");
  const [active, setActive] = useState(localStorage.getItem("active"));
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer;

    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), 20000); // 10 seconds of inactivity
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Start idle timer on mount
    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(timer);
    };
  }, []);

  if (!active) {
    Swal.fire({
      title: "A person’s worth is measured by the good; they do for others",
      text: "Imam Ali Ibn-Abi-Talib (as)😊",
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Enter",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("active", true);
      }
    });
  }


  const cookiesObject = {};
document.cookie.split(';').forEach(cookie => {
  const [name, value] = cookie.trim().split('=');
  cookiesObject[name] = value;
});
const length = Object.keys(cookiesObject)?.length;
  
  return (
    <div className="relative">
     {isIdle ? <div className="absolute bg-black/60 w-[100vw] h-full flex items-center justify-center "><VideoLoop /></div> : ''}
      <div className="bg-green-700 h-20 flex items-center justify-center gap-2 ">
     
        <img src={logo} alt="" width={40} height={40} />
        <span className="text-3xl text-white ">Excel Pro</span>
      </div>
     <div className="min-h-screen">
    <div className="flex justify-center items-center gap-4"><InternetSpeed /> <MyIpAddress /> <div className="text-green-500 font-bold"> Cookies: {length ? length-1 : '0'}</div></div>
     
     
     
     <div className="flex justify-center items-center gap-6 mt-10 ">
        <label className="text-green-600">Select Tool : </label>
        <select
          onChange={(e) => setTools(e.target.value)}
          className="border outline-none shadow-lg px-4 py-1 bg-green-700 text-white rounded-md w-[200px] md:w-[400px]"
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
      ) : tools === "Multiple Sheets Vlookup" ? (
        <MultiSheetsVlookup />
      ) : (
        <div className="flex items-center justify-center text-red-500 mt-10">
          <p>Oops... Tool Under Development</p>
        </div>
      )}
     </div>
      <Footer />
    </div>
  );
}

export default App;
