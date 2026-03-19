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
      accessorKey: "closenessCentrality",
      header: "Closeness Centrality",
      cell: (info) => Number(info.getValue()).toFixed(4),
    },
    {
      accessorKey: "betweennessCentrality",
      header: "Betweenness Centrality",
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
      "closeness centrality": "closenessCentrality",
      "betweenness centrality": "betweennessCentrality",

      genename: "geneName",
      degreecentrality: "degreeCentrality",
      closenesscentrality: "closenessCentrality",
      betweennesscentrality: "betweennessCentrality",
    };

    const rawHeaders = lines[0].split("\t").map((header) => header.trim());

    const headers = rawHeaders.map((header) => {
      const normalized = normalize(header);
      return headerMap[normalized] || normalized;
    });

    return lines.slice(1).map((line) => {
      const values = line.split("\t").map((value) => value.trim());
      const row = {};

      headers.forEach((header, index) => {
        if (header === "geneName") {
          row[header] = values[index];
        } else {
          row[header] = parseFloat(values[index]);
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