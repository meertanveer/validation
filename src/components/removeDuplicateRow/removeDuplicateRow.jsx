import { useState } from "react";
import "../../App.css";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const RemoveDuplicateRow = () => {
  const [baseFile, setBaseFile] = useState([]);
  const [resultData, setResultData] = useState([]);

  // Handle file upload and convert the Excel data to JSON
  const handleFileUploadB = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setBaseFile(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle removing duplicates by comparing all column values
  const handleRemoveDuplicates = () => {
    if (baseFile.length === 0) {
      Swal.fire("No data available to process!");
      return;
    }

    const uniqueData = Array.from(
      new Map(
        baseFile.map((item) => [
          Object.values(item).join("|"), // Combine all column values as a unique identifier
          item,
        ])
      ).values()
    );

    setResultData(uniqueData);
    Swal.fire({
      title: "Done",
      text: "Duplicates removed based on all column values!",
      icon: "success"
    });
  };

  // Export the resultData to an Excel file
  const exportToExcel = () => {
    if (resultData.length === 0) {
      Swal.fire("No data available to export!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(resultData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result Data");
    XLSX.writeFile(wb, "resultData.xlsx");
    window.location.reload();
  };

  return (
    <>
      <div className="flex items-center justify-center gap-10 mt-10">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUploadB}
            className="border px-6 py-2 rounded-md shadow-lg"
          />
          <label>Upload File</label>
        </div>
      </div>

      {baseFile.length > 0 && (
        <div className="flex justify-center mt-10">
          {resultData.length > 0 ? (
            <div
              onClick={exportToExcel}
              className="hover:cursor-pointer border rounded-lg"
            >
              <div className="w-[160px] h-10 rounded-lg shadow-xl hover:text-white hover:bg-red-500 text-red-500 flex items-center justify-center text-xl">
                <p>Download</p>
              </div>
            </div>
          ) : (
            <div
              onClick={handleRemoveDuplicates}
              className="hover:cursor-pointer border rounded-lg flex items-center mb-10 md:mb-10"
            >
              <div className="w-[260px] h-10 rounded-lg shadow-xl text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center text-xl">
                <p>Remove Duplicates</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RemoveDuplicateRow;
