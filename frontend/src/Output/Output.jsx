import BasicTable from "./BasicTable";
import "./Output.css";

function Output({ data, setData, columns, setColumns, fileName, setFileName }) {
  const prettifyHeader = (header) => {
    let cleaned = header
      .replace(/"/g, "")
      .trim()
      .toLowerCase();

    cleaned = cleaned
      .replace("genename", "gene name")
      .replace("degreecentrality", "degree centrality")
      .replace("betweennesscentrality", "betweenness centrality")
      .replace("closenesscentrality", "closeness centrality")
      .replace("ripplecentrality", "ripple centrality");

    cleaned = cleaned
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

    return cleaned
      .split(" ")
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".tsv") && !lowerName.endsWith(".txt")) {
      alert("Please upload a .tsv or .txt file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const { parsedData, parsedColumns } = parseDelimitedFile(text);

      setData(parsedData);
      setColumns(parsedColumns);
      setFileName(file.name);
    };

    reader.readAsText(file);
  };

  const parseDelimitedFile = (text) => {
    const lines = text
      .trim()
      .split("\n")
      .map((line) => line.replace(/\r/g, ""));

    if (lines.length < 2) {
      return { parsedData: [], parsedColumns: [] };
    }

    const headers = lines[0].split("\t").map((header) => header.trim());

    const parsedColumns = headers.map((header) => ({
      accessorKey: header,
      header: prettifyHeader(header),
      cell: (info) => info.getValue(),
    }));

    const parsedData = lines.slice(1).map((line) => {
      const values = line.split("\t").map((value) => value.trim());
      const row = {};

      headers.forEach((header, index) => {
        const rawValue = values[index] ?? "";
        const numericValue = Number(rawValue);

        row[header] =
          rawValue !== "" && !Number.isNaN(numericValue)
            ? numericValue
            : rawValue;
      });

      return row;
    });

    return { parsedData, parsedColumns };
  };

  return (
    <div className="output-container">
      <h1>Output</h1>

      <input type="file" accept=".tsv,.txt" onChange={handleFileUpload} />

      {fileName && <p>Loaded file: {fileName}</p>}

      {data.length > 0 ? (
        <BasicTable data={data} columns={columns} />
      ) : (
        <p>Please upload a file to view results.</p>
      )}
    </div>
  );
}

export default Output;