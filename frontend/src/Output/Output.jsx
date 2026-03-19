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
      console.log(parsedData);
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

    const normalize = (str) => str.toLowerCase().trim();

    const headerMap = {
      node: "geneName",

      "degree centrality": "degreeCentrality",
      "betweenness centrality": "betweennessCentrality",

      // KEY PART 👇
      "closeness centrality": "rippleCentrality",
      "ripple centrality": "rippleCentrality",

      // fallback formats
      genename: "geneName",
      degreecentrality: "degreeCentrality",
      betweennesscentrality: "betweennessCentrality",
      closenesscentrality: "rippleCentrality",
      ripplecentrality: "rippleCentrality",
    };

    const rawHeaders = lines[0].split("\t").map((h) => h.trim());

    const headers = rawHeaders.map((header) => {
      const normalized = normalize(header);
      return headerMap[normalized] || normalized;
    });

    return lines.slice(1).map((line) => {
      const values = line.split("\t").map((v) => v.trim());
      const row = {};

      headers.forEach((header, i) => {
        if (header === "geneName") {
          row[header] = values[i];
        } else {
          row[header] = parseFloat(values[i]);
        }
      });

      return row;
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