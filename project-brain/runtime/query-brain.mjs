#!/usr/bin/env node

/**
 * Project Brain CLI Context Retriever
 * Usage: node query-brain.mjs --node <nodeName>
 *        node query-brain.mjs --keyword <keyword>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Help menu
function showHelp() {
  console.log(`
Project Brain v2 CLI Query Tool
Options:
  --node <name>      Retrieve specific node relationships from graph.json
  --keyword <name>   Retrieve memory files mapped to index keywords
  --help             Show this menu
  `);
  process.exit(0);
}

// Parse args
const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  showHelp();
}

const nodeIndex = args.indexOf("--node");
const keywordIndex = args.indexOf("--keyword");

try {
  if (nodeIndex !== -1) {
    const nodeName = args[nodeIndex + 1];
    if (!nodeName) throw new Error("Missing node name parameter");

    // Read graph.json
    const graphPath = path.join(ROOT, "graph", "graph.json");
    const graphData = JSON.parse(fs.readFileSync(graphPath, "utf-8"));

    const matchedNode = graphData.nodes.find(n => n.id.toLowerCase() === nodeName.toLowerCase());
    if (!matchedNode) {
      console.log(`Node "${nodeName}" not found in graph.`);
      process.exit(1);
    }

    const connectedEdges = graphData.edges.filter(
      e => e.source.toLowerCase() === nodeName.toLowerCase() || e.target.toLowerCase() === nodeName.toLowerCase()
    );

    console.log(`\n=== Node Context: ${matchedNode.label} ===`);
    console.log(`Type: ${matchedNode.type}`);
    console.log(`File Path: ${matchedNode.path}`);
    console.log(`\n=== Relations Found ===`);
    connectedEdges.forEach(e => {
      console.log(`  - [${e.source}] --(${e.type})--> [${e.target}]`);
    });
    
    // Also try to load the matching memory page if it exists
    const memPath = path.join(ROOT, "memory", `${nodeName.toLowerCase()}.md`);
    if (fs.existsSync(memPath)) {
      console.log(`\n=== Domain Memory Doc (${nodeName.toLowerCase()}.md) ===`);
      console.log(fs.readFileSync(memPath, "utf-8"));
    }
  } else if (keywordIndex !== -1) {
    const keyword = args[keywordIndex + 1];
    if (!keyword) throw new Error("Missing keyword parameter");

    // Read graph-index.json
    const indexPath = path.join(ROOT, "graph", "graph-index.json");
    const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

    const matchedNodes = indexData.keywords[keyword.toLowerCase()];
    if (!matchedNodes) {
      console.log(`Keyword "${keyword}" not indexed in graph-index.`);
      process.exit(1);
    }

    console.log(`\n=== Keyword Index Match: "${keyword}" ===`);
    console.log(`Mapped Nodes: ${matchedNodes.join(", ")}`);
    
    matchedNodes.forEach(node => {
      const memPath = path.join(ROOT, "memory", `${node.toLowerCase()}.md`);
      if (fs.existsSync(memPath)) {
        console.log(`\n--- Memory doc: ${node.toLowerCase()}.md ---`);
        console.log(fs.readFileSync(memPath, "utf-8").substring(0, 500) + "...\n[Output truncated]");
      }
    });
  } else {
    showHelp();
  }
} catch (error) {
  console.error("Query Error:", error.message);
  process.exit(1);
}
