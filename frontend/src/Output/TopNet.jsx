import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import "./TopNet.css";

cytoscape.use(fcose);

const TOP_K_EDGES = 100;

function parseEdgeFile(text) {
  const sample = text.slice(0, 200).toLowerCase();
  if (sample.includes("<!doctype html") || sample.includes("<html")) {
    return {
      edges: [],
      error: "Fetched HTML instead of the network file. Check the URL/path.",
    };
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  if (lines.length === 0) return { edges: [], error: "File is empty." };

  const splitters = [
    { split: (s) => s.split("\t") },
    { split: (s) => s.split(",") },
    { split: (s) => s.split(/\s+/) },
  ];

  const first = lines[0];
  let best = { cols: 1, split: splitters[0].split };

  for (const sp of splitters) {
    const cols = sp.split(first).filter(Boolean).length;
    if (cols > best.cols) best = { cols, split: sp.split };
  }

  const firstTokens = best.split(first).filter(Boolean);
  const thirdIsNumber =
    firstTokens.length >= 3 && Number.isFinite(Number(firstTokens[2]));

  if (thirdIsNumber) {
    const edges = [];
    for (const line of lines) {
      const t = best.split(line).filter(Boolean);
      if (t.length < 2) continue;

      const source = t[0];
      const target = t[1];
      const weight = t.length >= 3 ? Number(t[2]) : 1;

      edges.push({
        source,
        target,
        weight: Number.isFinite(weight) ? weight : 1,
      });
    }
    return { edges, error: "" };
  }

  const headers = firstTokens;
  if (headers.length < 2) {
    return { edges: [], error: "Could not detect columns in file." };
  }

  const lower = headers.map((h) => h.toLowerCase().trim());
  const findIndex = (cands, fallback) => {
    for (const c of cands) {
      const idx = lower.indexOf(c);
      if (idx !== -1) return idx;
    }
    return fallback;
  };

  const sIdx = findIndex(
    ["source", "src", "from", "gene_a", "gene1", "node1", "u"],
    0
  );
  const tIdx = findIndex(
    ["target", "tgt", "to", "gene_b", "gene2", "node2", "v"],
    1
  );
  const wIdx = findIndex(["weight", "w", "score", "edge_weight"], -1);

  const edges = [];
  for (let i = 1; i < lines.length; i++) {
    const t = best.split(lines[i]).filter(Boolean);
    if (t.length < 2) continue;

    const source = (t[sIdx] ?? "").trim();
    const target = (t[tIdx] ?? "").trim();
    if (!source || !target) continue;

    const w = wIdx >= 0 ? Number(t[wIdx]) : 1;
    edges.push({ source, target, weight: Number.isFinite(w) ? w : 1 });
  }

  return { edges, error: "" };
}

export default function TopNet({
  uploadedText,
  setUploadedText,
  uploadedFileName,
  setUploadedFileName,
}) {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAndRender() {
      if (!uploadedText) {
        setStats({ nodes: 0, edges: 0 });
        setErr("");
        return;
      }

      setLoading(true);
      setErr("");

      try {
        const { edges: parsedEdges, error: parseError } = parseEdgeFile(uploadedText);
        if (parseError) throw new Error(parseError);
        if (cancelled) return;

        let edges = [...parsedEdges];
        edges.sort((a, b) => b.weight - a.weight);

        if (TOP_K_EDGES && edges.length > TOP_K_EDGES) {
          edges = edges.slice(0, TOP_K_EDGES);
        }

        const nodeSet = new Set();
        const degree = new Map();

        for (const e of edges) {
          nodeSet.add(e.source);
          nodeSet.add(e.target);
          degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
          degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
        }

        const nodes = Array.from(nodeSet).map((id) => ({
          id,
          label: id,
          degree: degree.get(id) ?? 0,
        }));

        const weights = edges.map((e) => e.weight);
        const minW = weights.length ? Math.min(...weights) : 0;
        const maxW = weights.length ? Math.max(...weights) : 1;

        const elements = [
          ...nodes.map((n) => ({ data: n })),
          ...edges.map((e, idx) => ({
            data: {
              id: `${e.source}__${e.target}__${idx}`,
              source: e.source,
              target: e.target,
              weight: e.weight,
              minW,
              maxW,
            },
          })),
        ];

        if (cyRef.current) {
          cyRef.current.destroy();
          cyRef.current = null;
        }

        const cy = cytoscape({
          container: containerRef.current,
          elements,
          style: [
            {
              selector: "node",
              style: {
                label: "data(label)",
                "font-size": 10,
                "text-valign": "center",
                "text-halign": "center",
                color: "#ffffff",
                "text-outline-width": 2,
                "text-outline-color": "#111827",
                "background-color": "#0077B6",
                "border-width": 2,
                "border-color": "#ffffff",
                width: "mapData(degree, 1, 20, 22, 60)",
                height: "mapData(degree, 1, 20, 22, 60)",
              },
            },
            {
              selector: "node[degree >= 4]",
              style: {
                label: "data(label)",
                "font-size": 11,
              },
            },
            {
              selector: "node[degree < 4]",
              style: {
                label: "",
              },
            },
            {
              selector: "node.show-small-labels[degree < 4]",
              style: {
                label: "data(label)",
                "font-size": 10,
              },
            },
            {
              selector: "edge",
              style: {
                "curve-style": "bezier",
                opacity: 0.75,
                "line-color": "#111827",
                width: "mapData(weight, minW, maxW, 1, 7)",
              },
            },
            { selector: ".faded", style: { opacity: 0.12 } },
            { selector: "edge.faded", style: { opacity: 0.06 } },
          ],
          layout: {
            name: "fcose",
            animate: true,
            randomize: true,
            nodeRepulsion: 8000,
            idealEdgeLength: 120,
          },
        });

        cy.on("tap", "node", (evt) => {
          const node = evt.target;
          cy.elements().addClass("faded");
          node.removeClass("faded");
          node.neighborhood().removeClass("faded");
        });

        cy.on("tap", (evt) => {
          if (evt.target === cy) cy.elements().removeClass("faded");
        });

        const wrapEl = containerRef.current;

        function showTooltip(evt, html) {
          if (!wrapEl) return;
          const rect = wrapEl.getBoundingClientRect();
          const clientX = evt.originalEvent?.clientX ?? 0;
          const clientY = evt.originalEvent?.clientY ?? 0;

          let x = clientX - rect.left + 12;
          let y = clientY - rect.top + 12;

          const maxX = rect.width - 220;
          const maxY = rect.height - 80;
          x = Math.max(8, Math.min(x, maxX));
          y = Math.max(8, Math.min(y, maxY));

          setTooltip({ visible: true, x, y, text: html });
        }

        function hideTooltip() {
          setTooltip((t) => ({ ...t, visible: false }));
        }

        cy.on("mouseover", "node", (evt) => {
          const n = evt.target;
          const id = n.data("id");
          const degreeValue = n.data("degree") ?? 0;
          showTooltip(evt, `<b>${id}</b><br/>Degree: ${degreeValue}`);
        });

        cy.on("mouseout", "node", hideTooltip);

        cy.on("mouseover", "edge", (evt) => {
          const e = evt.target;
          const s = e.data("source");
          const t = e.data("target");
          const w = e.data("weight");
          showTooltip(
            evt,
            `<b>${s}</b> → <b>${t}</b><br/>Weight: ${Number(w).toFixed(4)}`
          );
        });

        cy.on("mouseout", "edge", hideTooltip);

        cy.fit();

        const ZOOM_LABEL_THRESHOLD = 1.2;

        function updateLabelVisibility() {
          const zoom = cy.zoom();
          const show = zoom >= ZOOM_LABEL_THRESHOLD;

          if (show) {
            cy.nodes("[degree < 4]").addClass("show-small-labels");
          } else {
            cy.nodes("[degree < 4]").removeClass("show-small-labels");
          }
        }

        updateLabelVisibility();
        cy.on("zoom", updateLabelVisibility);

        cyRef.current = cy;
        setStats({ nodes: nodes.length, edges: edges.length });
      } catch (e) {
        setErr(e?.message ?? "Unknown error");
        setStats({ nodes: 0, edges: 0 });
      } finally {
        setLoading(false);
      }
    }

    loadAndRender();

    return () => {
      cancelled = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [uploadedText]);

  return (
    <div className="output-page">
      <div className="output-header">
        <div>
          <div className="output-title">TopNet Network</div>
          <div className="output-subtitle">
            {loading
              ? "Loading…"
              : uploadedFileName
              ? `File: ${uploadedFileName} • Nodes: ${stats.nodes} • Edges: ${stats.edges}`
              : "Upload a network file to begin"}
            {err ? ` • ${err}` : ""}
          </div>
          <div className="topnet-note">
  <strong>Troubleshooting note:</strong> Upload the node weights file, not the
  centralities file. The TopNet visualization uses node-to-node weights to show
  which paths are most active.
</div>
        </div>

        <div className="output-actions">
          <label className="btn">
            Upload File
            <input
              type="file"
              accept=".tsv,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  setUploadedText(event.target.result);
                  setUploadedFileName(file.name);
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button className="btn" onClick={() => cyRef.current?.fit()} disabled={!cyRef.current}>
            Fit
          </button>

          <button
            className="btn"
            onClick={() => cyRef.current?.elements().removeClass("faded")}
            disabled={!cyRef.current}
          >
            Clear
          </button>

          <button
            className="btn"
            onClick={() =>
              cyRef.current
                ?.layout({
                  name: "fcose",
                  animate: true,
                  randomize: true,
                  nodeRepulsion: 8000,
                  idealEdgeLength: 120,
                })
                .run()
            }
            disabled={!cyRef.current}
          >
            Re-layout
          </button>
        </div>
      </div>

      <div className="graph-wrap">
        <div className="graph-container" ref={containerRef} />
        {tooltip.visible && (
          <div
            className="tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            dangerouslySetInnerHTML={{ __html: tooltip.text }}
          />
        )}
      </div>
    </div>
  );
}