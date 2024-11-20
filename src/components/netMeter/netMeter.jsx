
import { useState } from "react";
import "../../App.css";
import * as XLSX from "xlsx";

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
    console.log(selectedOptions); // Log the selected values
  };

  const handleChangeRef = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedKeysR(selectedOptions);
    console.log(selectedOptions); // Log the selected values
  };

  const downloadBaseTemplate = () => {
    console.log("");
  };

  const downloadStandarTemplate = () => {
    console.log("");
  };

  const handleFileUploadB = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result); // Read the file as an array buffer
        const workbook = XLSX.read(data, { type: "array" }); // Parse the data into a workbook
        const sheetName = workbook.SheetNames[0]; // Get the first sheet's name
        const sheet = workbook.Sheets[sheetName]; // Get the sheet data
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert the sheet to JSON
        setBaseFile(jsonData); // Log the JSON data to the console
      };
      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    }
  };

  const handleFileUploadR = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result); // Read the file as an array buffer
        const workbook = XLSX.read(data, { type: "array" }); // Parse the data into a workbook
        const sheetName = workbook.SheetNames[0]; // Get the first sheet's name
        const sheet = workbook.Sheets[sheetName]; // Get the sheet data
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert the sheet to JSON
        setRefFile(jsonData); // Update state with the parsed data
      };
      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    }
  };

  
    // Function to export the resultData to an Excel file
    const exportToExcel = () => {
      // Convert the resultData array into a worksheet
      const ws = XLSX.utils.json_to_sheet(resultData);
      console.log('rd', resultData)
      // Create a new workbook and append the worksheet to it
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Result Data');
      
      // Write the Excel file to the browser
      XLSX.writeFile(wb, 'resultData.xlsx');
      window.location.reload()
    };

  
    const validateFxn = () => {
      // Filter out consumers in baseFile (excel1) that are present in refFile (excel2)
      const filteredData = baseFile.filter((rec1) => {
        // Check if the consumer in baseFile exists in refFile (based on the selected key)
        const isConsumerInRefFile = refFile.some(
          (rec2) => rec2[selectedKeysR[0]] === rec1[selectedKeysB[0]] // Matching based on selected key
        );
    
        // If the consumer is found in refFile, we exclude it from the baseFile
        return !isConsumerInRefFile;
      });
    
      // Store the filtered data
      setResultData(filteredData);
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
          <label>Upload Base File</label>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUploadR}
            className="border px-6 py-2 rounded-md shadow-lg"
          />
          <label>Upload Meter Change File</label>
        </div>
      </div>

      {baseFile.length > 0 && refFile.length > 0 && (
        <div className="flex items-center justify-center gap-40 mt-10">
          <div className="h-[500px] w-[300px] ">
            <select
              className="h-full outline-none border shadow-md rounded-md w-full px-4"
              multiple
              onChange={handleChangeBase}
            >
              {baseFile ? (
                [...new Set(baseFile.flatMap((rec) => Object.keys(rec)))] // Get unique keys across all rec objects
                  .map((key, index) => (
                    <option key={index} value={key}>
                      {key}
                    </option>
                  ))
              ) : (
                <option>No Data Available</option>
              )}
            </select>

            {/* Display selected keys */}
            <div>
              <p>Selected Keys: {selectedKeysB.join(", ")}</p>
            </div>
          </div>
          <div className="h-[500px] w-[300px] ">
            <select
              className="h-full outline-none border shadow-md rounded-md w-full px-4"
              multiple
              onChange={handleChangeRef}
            >
              {refFile ? (
                [...new Set(refFile.flatMap((rec) => Object.keys(rec)))] // Get unique keys across all rec objects
                  .map((key, index) => (
                    <option key={index} value={key}>
                      {key}
                    </option>
                  ))
              ) : (
                <option>No Data Available</option>
              )}
            </select>

            {/* Display selected keys */}
            <div>
              <p>Selected Keys: {selectedKeysR.join(", ")}</p>
            </div>
          </div>
        </div>
      )}
        
       {selectedKeysB.length > 0 && selectedKeysR.length > 0 && <div className="flex justify-center mt-10">
         {resultData.length > 0 ? <div onClick={exportToExcel} className=" hover:cursor-pointer border rounded-lg ">
          
            <div className="w-[160px] h-10 rounded-lg shadow-xl hover:text-white hover:bg-red-500 text-red-500 flex items-center justify-center text-xl ">
              <p>Download</p>
            </div>
          </div> : <div onClick={validateFxn} className=" hover:cursor-pointer border rounded-lg flex items-center">
            
            <div className="w-[160px] h-10  rounded-lg shadow-xl text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center text-xl ">
              <p>Remove Records</p>
            </div>
          </div> }
        </div> }
    </>
  )
}

export default NetMeter