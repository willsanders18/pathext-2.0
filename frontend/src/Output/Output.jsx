import BasicTable from "./BasicTable";
import "./Output.css";

function Output({ data, setData, columns, setColumns, fileName, setFileName }) {
  const isNumeric = (value) => {
    if (value === null || value === undefined) return false;
    const trimmed = String(value).trim();
    if (trimmed === "") return false;
    return !Number.isNaN(Number(trimmed));
  };

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
      .replace("ripplecentrality", "ripple centrality")
      .replace("nodeweight", "node weight");

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

  const detectDelimiter = (line) => {
    if (line.includes("\t")) return "\t";
    if (line.includes(",")) return ",";
    return /\s+/;
  };

  const hasHeaderRow = (rows) => {
    if (rows.length < 2) return false;

    const firstRow = rows[0];
    const secondRow = rows[1];

    // If the first row contains any numeric data, it is probably not a header.
    if (firstRow.some((cell) => isNumeric(cell))) {
      return false;
    }

    // If first row is all text and second row has at least one number,
    // it is probably a header row.
    if (secondRow.some((cell) => isNumeric(cell))) {
      return true;
    }

    // Fallback: if the first row looks like descriptive labels, treat as header.
    const headerWords = [
      "gene",
      "node",
      "degree",
      "centrality",
      "betweenness",
      "closeness",
      "ripple",
      "weight",
      "score",
      "source",
      "target",
    ];

    return firstRow.some((cell) =>
      headerWords.some((word) => cell.toLowerCase().includes(word))
    );
  };

  const generateHeaders = (rows) => {
    const columnCount = rows[0]?.length ?? 0;
    const stringCounts = Array(columnCount).fill(0);
    const numericCounts = Array(columnCount).fill(0);

    rows.forEach((row) => {
      row.forEach((value, index) => {
        if (isNumeric(value)) {
          numericCounts[index] += 1;
        } else {
          stringCounts[index] += 1;
        }
      });
    });

    let nodeCount = 1;
    let weightCount = 1;

    return Array.from({ length: columnCount }, (_, index) => {
      if (numericCounts[index] > stringCounts[index]) {
        const label =
          weightCount === 1 ? "Node Weight" : `Node Weight ${weightCount}`;
        weightCount += 1;
        return label;
      }

      const label = `Node ${nodeCount}`;
      nodeCount += 1;
      return label;
    });
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
      .map((line) => line.replace(/\r/g, ""))
      .filter((line) => line.trim() !== "");

    if (lines.length === 0) {
      return { parsedData: [], parsedColumns: [] };
    }

    const delimiter = detectDelimiter(lines[0]);

    const rows = lines.map((line) =>
      line
        .split(delimiter)
        .map((value) => value.replace(/"/g, "").trim())
    );

    const fileHasHeaders = hasHeaderRow(rows);

    const headers = fileHasHeaders
      ? rows[0]
      : generateHeaders(rows);

    const dataRows = fileHasHeaders ? rows.slice(1) : rows;

    const parsedColumns = headers.map((header) => ({
      accessorKey: header,
      header: prettifyHeader(header),
      cell: (info) => info.getValue(),
    }));

    const parsedData = dataRows.map((rowValues) => {
      const row = {};

      headers.forEach((header, index) => {
        const rawValue = rowValues[index] ?? "";

        row[header] = isNumeric(rawValue)
          ? Number(rawValue)
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