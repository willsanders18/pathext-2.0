import BasicTable from "./BasicTable";
import "./Output.css";

function Output() {
  const data = [
    {
      geneName: "TP53",
      degreeCentrality: 0.8421,
      betweennessCentrality: 0.3154,
      rippleCentrality: 0.6728,
    },
    {
      geneName: "BRCA1",
      degreeCentrality: 0.7612,
      betweennessCentrality: 0.4289,
      rippleCentrality: 0.5931,
    },
    {
      geneName: "EGFR",
      degreeCentrality: 0.9147,
      betweennessCentrality: 0.2876,
      rippleCentrality: 0.7015,
    },
    {
      geneName: "MYC",
      degreeCentrality: 0.6893,
      betweennessCentrality: 0.5122,
      rippleCentrality: 0.6489,
    },
    {
      geneName: "AKT1",
      degreeCentrality: 0.8035,
      betweennessCentrality: 0.3468,
      rippleCentrality: 0.6257,
    },
  ];

  const columns = [
  {
    accessorKey: "geneName",
    header: "Gene Name",
  },
  {
    accessorKey: "degreeCentrality",
    header: "Degree Centrality",
    cell: (info) => info.getValue().toFixed(4),
  },
  {
    accessorKey: "betweennessCentrality",
    header: "Betweenness Centrality",
    cell: (info) => info.getValue().toFixed(4),
  },
  {
    accessorKey: "rippleCentrality",
    header: "Ripple Centrality",
    cell: (info) => info.getValue().toFixed(4),
  },
];

  return (
    <div>
      <h1>Output</h1>
      <BasicTable data={data} columns={columns} />
    </div>
  );
}

export default Output;