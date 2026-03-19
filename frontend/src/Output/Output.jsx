import { useState } from "react";
import BasicTable from "./BasicTable";
import "./Output.css";

function Output() {
  const [data, setData] = useState([]);

  const columns = [
    {
      accessorKey: "geneName",
      header: "Gene Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "degreeCentrality",
      header: "Degree Centrality",
      cell: (info) => Number(info.getValue()).toFixed(4),
    },
    {
      accessorKey: "betweennessCentrality",
      header: "Betweenness Centrality",
      cell: (info) => Number(info.getValue()).toFixed(4),
    },
    {
      accessorKey: "rippleCentrality",
      header: "Ripple Centrality",
      cell: (info) => Number(info.getValue()).toFixed(4),
    },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const parsedData = parseTSV(text);
      setData(parsedData);
    };

    reader.readAsText(file);
  };

  const parseTSV = (text) => {
  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.replace(/\r/g, ""));

  if (lines.length < 2) return [];

  const rawHeaders = lines[0].split("\t").map((h) => h.trim());

  const headerMap = {
    "Gene Name": "geneName",
    "Degree Centrality": "degreeCentrality",
    "Betweenness Centrality": "betweennessCentrality",
    "Ripple Centrality": "rippleCentrality",
    geneName: "geneName",
    degreeCentrality: "degreeCentrality",
    betweennessCentrality: "betweennessCentrality",
    rippleCentrality: "rippleCentrality",
  };

  const headers = rawHeaders.map((header) => headerMap[header] || header);

  return lines.slice(1).map((line) => {
    const values = line.split("\t").map((v) => v.trim());

    return {
      [headers[0]]: values[0],
      [headers[1]]: parseFloat(values[1]),
      [headers[2]]: parseFloat(values[2]),
      [headers[3]]: parseFloat(values[3]),
    };
  });
};

  return (
    <div>
      <h1>Output</h1>

      <input type="file" accept=".tsv" onChange={handleFileUpload} />

      {data.length > 0 ? (
        <BasicTable data={data} columns={columns} />
      ) : (
        <p>Please upload a TSV file to view results.</p>
      )}
    </div>
  );
}

export default Output;