import { useState } from "react";
import "../../App.css";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const NetMeter = () => {
  const [baseFile, setBaseFile] = useState([]);
  const [refFile, setRefFile] = useState([]);
  const [selectedKeysB, setSelectedKeysB] = useState([]);
  const [selectedKeysR, setSelectedKeysR] = useState([]);
  const [resultData, setResultData] = useState([]);

  const handleChangeBase = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedKeysB(selectedOptions);
  };

  const handleChangeRef = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedKeysR(selectedOptions);
  };

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

  const handleFileUploadR = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setRefFile(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(resultData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result Data");
    XLSX.writeFile(wb, "resultData.xlsx");
    window.location.reload();
  };

  const validateFxn = () => {
    if (selectedKeysB.length === 0 || selectedKeysR.length === 0) {
      Swal.fire("Error", "Please select columns for comparison!", "error");
      return;
    }

    const filteredData = baseFile.filter((rec1) => {
      // Check if rec1 matches any record in refFile based on the selected columns
      return !refFile.some((rec2) =>
        selectedKeysB.every((key, index) => rec1[key] === rec2[selectedKeysR[index]])
      );
    });

    setResultData(filteredData);

    if (filteredData.length === baseFile.length) {
      Swal.fire("No Changes", "No matching records found!", "info");
    } else {
      Swal.fire("Success", "Records removed successfully!", "success");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUploadB}
            className="border px-6 py-2 rounded-md shadow-lg"
          />
          <label>Upload Base File</label>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUploadR}
            className="border px-6 py-2 rounded-md shadow-lg"
          />
          <label>Upload Reference File</label>
        </div>
      </div>

      {baseFile.length > 0 && refFile.length > 0 && (
        <div className="flex flex-col md:flex-row  items-center justify-center gap-40 mt-10 mb-20 md:mb-0">
          <div className="h-[500px] w-[300px]">
            <select
              className="h-full outline-none border shadow-md rounded-md w-full px-4"
              multiple
              onChange={handleChangeBase}
            >
              {baseFile &&
                [...new Set(baseFile.flatMap((rec) => Object.keys(rec)))].map(
                  (key, index) => (
                    <option key={index} value={key}>
                      {key}
                    </option>
                  )
                )}
            </select>
            <p>Selected Keys (Base): {selectedKeysB.join(", ")}</p>
          </div>
          <div className="h-[500px] w-[300px]">
            <select
              className="h-full outline-none border shadow-md rounded-md w-full px-4"
              multiple
              onChange={handleChangeRef}
            >
              {refFile &&
                [...new Set(refFile.flatMap((rec) => Object.keys(rec)))].map(
                  (key, index) => (
                    <option key={index} value={key}>
                      {key}
                    </option>
                  )
                )}
            </select>
            <p>Selected Keys (Reference): {selectedKeysR.join(", ")}</p>
          </div>
        </div>
      )}

      {selectedKeysB.length > 0 && selectedKeysR.length > 0 && (
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
              onClick={validateFxn}
              className="hover:cursor-pointer border rounded-lg flex items-center mb-10 md:mb-0"
            >
              <div className="w-[160px] h-10 rounded-lg shadow-xl text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center text-xl">
                <p>Remove Records</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NetMeter;
