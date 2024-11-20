import "./App.css";
import logo from "./assets/logo.png";
function App() {
  const downloadBaseTemplate = () => {
    console.log('')
  }

  const downloadStandarTemplate = () => {
    console.log('')
  }
  return (
    <>
      <div className="bg-green-700 h-20 flex items-center justify-center gap-2">
        <img src={logo} alt="" width={40} height={40} />
        <span className="text-3xl text-white ">Excel Pro</span>
      </div>
      <div className="flex items-center justify-center gap-10 mt-20">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            className="border px-6 py-2 rounded-md shadow-lg"
          />
          <label>Upload Base File</label>
          <button onClick={downloadBaseTemplate} className="text-red-500 border hover:bg-red-500 hover:text-white rounded-md px-2 py-1 bg-red-100">Download Template</button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            className="border px-6 py-2 rounded-md shadow-lg"
            type="file"
          />
          <label>Upload Standard File</label>
          <button onClick={downloadStandarTemplate} className="text-red-500 border hover:bg-red-500 hover:text-white rounded-md px-2 py-1 bg-red-100">Download Template</button>
        </div>
      </div>
    </>
  );
}

export default App;
