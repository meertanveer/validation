

import { useState } from "react";
import * as XLSX from "xlsx";
import load from '../../assets/validate.gif'
import stat from '../../assets/staticprocess.png'
import Swal from "sweetalert2";

const MultiSheetsVlookup = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetData, setSheetData] = useState({});
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState({});
  const [vlookupResults, setVlookupResults] = useState(null);
  const [loadingB, setLoadingB] = useState(false);

  const handleFileUpload = (event) => {
    setLoadingB(true)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" }); // Read as arrayBuffer

        // Get sheet names
        const sheetNames = workbook.SheetNames;
        setSheetNames(sheetNames);

        // Create a separate useState for each sheet dynamically
        const newSheetData = {};
        sheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to array of arrays
          newSheetData[sheetName] = sheetData;
        });
        setSheetData(newSheetData); // Store data for all sheets
        setLoadingB(false)
      };
      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    }
  };

  const handleSheetSelection = (sheetName) => {
    if (selectedSheets.length < 2 && !selectedSheets.includes(sheetName)) {
      setSelectedSheets((prev) => [...prev, sheetName]);
    }
  };

  const handleHeaderSelection = (sheetName, selectedHeadersList) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      [sheetName]: selectedHeadersList,
    }));
  };

  const handleRemoveSheet = (sheetName) => {
    setSelectedSheets((prev) => prev.filter((name) => name !== sheetName));
    setSelectedHeaders((prev) => {
      const updatedHeaders = { ...prev };
      delete updatedHeaders[sheetName]; // Remove the selected headers for this sheet
      return updatedHeaders;
    });
  };

  // VLOOKUP function
  const performVlookup = () => {

    if (selectedSheets.length < 2) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please select two sheets first",
            footer: ''
          });
      return;
    }

    const sheet1Name = selectedSheets[0];
    const sheet2Name = selectedSheets[1];
    const sheet1 = sheetData[sheet1Name];
    const sheet2 = sheetData[sheet2Name];

    const sheet1Headers = sheet1[0];
    const sheet2Headers = sheet2[0];

    // Ensure the selected columns are in the first row of headers
    const sheet1SelectedHeaders = selectedHeaders[sheet1Name] || [];
    const sheet2SelectedHeaders = selectedHeaders[sheet2Name] || [];

    // Prepare lookup logic for VLOOKUP (assuming user selects the matching column)
    const result = [];

    // Assuming the first selected column of sheet1 is the lookup key
    const lookupColumnIndex = sheet1Headers.indexOf(sheet1SelectedHeaders[0]);
    const returnColumnIndex = sheet2Headers.indexOf(sheet2SelectedHeaders[0]);

    if (lookupColumnIndex === -1 || returnColumnIndex === -1) {
      alert("Selected columns not found in the sheets.");
      return;
    }

    // Perform VLOOKUP (lookup value from sheet1 and return value from sheet2)
    sheet1.slice(1).forEach((row1) => {
      const lookupValue = row1[lookupColumnIndex];

      // Find matching row in sheet2
      const matchedRow = sheet2.find((row2) => row2[lookupColumnIndex] === lookupValue);
      if (matchedRow) {
        const matchedValue = matchedRow[returnColumnIndex];
        result.push({ ...row1, [sheet2SelectedHeaders[0]]: matchedValue });
      } else {
        result.push({ ...row1, [sheet2SelectedHeaders[0]]: "Not Found" });
      }
    });

    // Set the result to be displayed
    setVlookupResults(result);
  };

  // Generate a new Excel file with the VLOOKUP results
  const generateExcelFile = () => {
    if (!vlookupResults) {
      alert("No VLOOKUP results to export.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(vlookupResults);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VLookup Results");

    // Generate Excel file and prompt the user to download it
    XLSX.writeFile(wb, "vlookup_results.xlsx");
  };


  return (
    <div>
      <div className="flex flex-col items-center justify-center my-10">
        <input
          className="border px-6 py-2 rounded-md shadow-lg"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
         <div className="flex items-center gap-4 mt-10">
            <label>Upload File </label>
            <div>
              {loadingB ? (
                <img src={load} alt="" width={30} height={30} />
              ) : (
                <img src={stat} alt="" width={30} height={30} />
              )}
            </div>
          </div>
      </div>

      <div className="flex justify-center gap-10">
        {/* List all sheets for selection */}
        {sheetNames.map((sheetName) => (
          <div key={sheetName} className="flex flex-col items-center">
            <h4>{sheetName}</h4>
            <button
              className="border px-4 bg-green-500 text-white  py-2 rounded-md mb-2"
              onClick={() => handleSheetSelection(sheetName)}
              disabled={selectedSheets.length >= 2 || selectedSheets.includes(sheetName)}
            >
              {selectedSheets.includes(sheetName) ? "Currently Selected" : "Select this Sheet"}
            </button>
          </div>
        ))}
      </div>

      {/* Display dropdowns only for selected sheets */}
      {selectedSheets.length > 0 && (
        <div className="flex justify-center gap-10 mt-10">
          {selectedSheets.map((sheetName) => {
            const sheet = sheetData[sheetName];
            const headers = sheet && sheet.length > 0 ? sheet[0] : [];

            return (
              <div key={sheetName} className="flex flex-col items-center">
                <h4>{sheetName}</h4>
                <button
                  className="border bg-red-500 text-white  px-4  rounded-md mb-2"
                  onClick={() => handleRemoveSheet(sheetName)}
                >
                  Remove Sheet
                </button>
                <select
                  multiple
                  className="outline-none h-[300px] border shadow-md rounded-md w-[250px] px-4"
                  onChange={(e) =>
                    handleHeaderSelection(
                      sheetName,
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  value={selectedHeaders[sheetName] || []}
                >
                  <option value="">Select Columns</option>
                  {headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-10 mt-10">
         {Object.values(sheetData).length > 0 && <button
          className="px-6 py-2 border bg-blue-500 text-white rounded-md shadow-md"
          onClick={performVlookup}
        >
          Perform VLOOKUP
        </button>}

        {vlookupResults?.length > 0 && (
          <button
            className="px-6 py-2 bg-orange-500 text-white  border rounded-md shadow-md"
            onClick={generateExcelFile}
          >
            Download Results
          </button>
        )}
      </div>

    
    </div>
  );
};

export default MultiSheetsVlookup;

