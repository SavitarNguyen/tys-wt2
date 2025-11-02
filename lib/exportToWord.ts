import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

/**
 * Converts markdown text to a Word document and downloads it
 */
export async function exportMarkdownToWord(
  markdown: string,
  filename: string = "feedback-report.docx"
) {
  try {
    const elements = parseMarkdownToDocxElements(markdown);

    // Ensure we have at least one element
    if (elements.length === 0) {
      elements.push(
        new Paragraph({
          text: "No content to export.",
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          children: elements,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error exporting to Word:", error);
    throw error;
  }
}

/**
 * Parses markdown text into docx elements
 * This is a basic parser that handles the IELTS feedback format
 */
function parseMarkdownToDocxElements(markdown: string): Paragraph[] | (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const lines = markdown.split("\n");

  let currentList: string[] = [];
  let inTable = false;
  let tableRows: any[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle tables
    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }

      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell.length >= 0); // Keep empty cells

      // Skip separator rows (|---|---|)
      if (cells.every((cell) => /^:?-+:?$/.test(cell))) {
        continue;
      }

      // Ensure we have at least one cell (even if empty)
      if (cells.length === 0) {
        cells.push(" ");
      }

      tableRows.push(cells);

      // Check if this is the last line of the table
      if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith("|")) {
        inTable = false;
        if (tableRows.length > 0) {
          elements.push(createTable(tableRows));
        }
        tableRows = [];
      }
      continue;
    }

    // Finish current table if we exit table mode
    if (inTable) {
      inTable = false;
      if (tableRows.length > 0) {
        elements.push(createTable(tableRows));
      }
      tableRows = [];
    }

    // Handle headers
    if (line.startsWith("# ")) {
      elements.push(
        new Paragraph({
          text: line.substring(2).trim(),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        })
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        new Paragraph({
          text: line.substring(3).trim(),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        })
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        new Paragraph({
          text: line.substring(4).trim(),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 150, after: 100 },
        })
      );
    }
    // Handle horizontal rules
    else if (line === "---") {
      elements.push(
        new Paragraph({
          text: "",
          spacing: { before: 100, after: 100 },
        })
      );
    }
    // Handle blockquotes
    else if (line.startsWith("> ")) {
      elements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.substring(2),
              italics: true,
            }),
          ],
          spacing: { before: 100, after: 100 },
        })
      );
    }
    // Handle list items
    else if (/^[-*] /.test(line)) {
      currentList.push(line.substring(2));
      // Check if next line is also a list item
      if (i + 1 >= lines.length || !/^[-*] /.test(lines[i + 1].trim())) {
        // End of list, add all items
        currentList.forEach((item) => {
          elements.push(
            new Paragraph({
              text: item,
              bullet: { level: 0 },
              spacing: { after: 50 },
            })
          );
        });
        currentList = [];
      }
    }
    // Handle numbered lists
    else if (/^\d+\. /.test(line)) {
      const match = line.match(/^\d+\. (.*)/);
      if (match) {
        elements.push(
          new Paragraph({
            text: match[1],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      }
    }
    // Handle emphasis/bold text
    else if (line.includes("**") || line.includes("*")) {
      elements.push(parseFormattedLine(line));
    }
    // Handle regular paragraphs
    else if (line.length > 0) {
      elements.push(
        new Paragraph({
          text: line,
          spacing: { after: 100 },
        })
      );
    }
    // Empty line - skip or add minimal spacing
    else {
      // Only add spacing paragraph if needed and not at the start
      if (elements.length > 0) {
        // Don't add empty paragraphs, just continue
        continue;
      }
    }
  }

  return elements;
}

/**
 * Parses a line with bold/italic formatting
 */
function parseFormattedLine(line: string): Paragraph {
  const children: TextRun[] = [];

  // Simple regex to match **bold**
  const boldRegex = /\*\*(.+?)\*\*/g;

  // Split by bold markers
  const boldMatches = Array.from(line.matchAll(boldRegex));
  
  if (boldMatches.length > 0) {
    let lastIndex = 0;
    boldMatches.forEach((match) => {
      if (match.index !== undefined) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = line.substring(lastIndex, match.index);
          if (beforeText.length > 0) {
            children.push(new TextRun({ text: beforeText }));
          }
        }

        // Add the bold text with yellow highlight
        children.push(
          new TextRun({
            text: match[1] || " ",
            bold: true,
            highlight: "yellow",
          })
        );

        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < line.length) {
      const remainingText = line.substring(lastIndex);
      if (remainingText.length > 0) {
        children.push(new TextRun({ text: remainingText }));
      }
    }

    // Ensure we have at least one child
    if (children.length === 0) {
      children.push(new TextRun({ text: line || " " }));
    }

    return new Paragraph({
      children,
      spacing: { after: 100 },
    });
  }

  // No bold markers, just return as regular text
  return new Paragraph({
    text: line || " ",
    spacing: { after: 100 },
  });
}

/**
 * Creates a Word table from markdown table rows
 */
function createTable(rows: string[][]): Table {
  if (rows.length === 0) {
    return new Table({
      rows: [],
    });
  }

  // Find the maximum number of columns
  const maxColumns = Math.max(...rows.map((row) => row.length));
  
  // Normalize all rows to have the same number of columns
  const normalizedRows = rows.map((row) => {
    const normalized = [...row];
    while (normalized.length < maxColumns) {
      normalized.push(" ");
    }
    return normalized;
  });

  const tableRows = normalizedRows.map((row, index) => {
    const isHeader = index === 0;
    const cells = row.map((cell) => {
      // Clean up cell content - remove markdown formatting if any
      const cleanCell = (cell || " ").trim();
      
      // Parse any bold formatting in the cell
      const cellChildren = parseCellContent(cleanCell, isHeader);
      
      return new TableCell({
        children: [
          new Paragraph({
            children: cellChildren,
          }),
        ],
        shading: isHeader
          ? {
              fill: "F2F2F2",
            }
          : undefined,
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
        },
      });
    });

    return new TableRow({
      children: cells,
      cantSplit: false,
    });
  });

  return new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    alignment: AlignmentType.LEFT,
  });
}

/**
 * Parses cell content and returns TextRun children
 */
function parseCellContent(text: string, isHeader: boolean): TextRun[] {
  const children: TextRun[] = [];
  
  // Check for bold formatting
  const boldRegex = /\*\*(.+?)\*\*/g;
  const matches = Array.from(text.matchAll(boldRegex));
  
  if (matches.length === 0) {
    // No formatting, return plain text
    children.push(
      new TextRun({
        text: text || " ",
        bold: isHeader,
        size: isHeader ? 22 : 20,
      })
    );
  } else {
    // Parse formatted text
    let lastIndex = 0;
    matches.forEach((match) => {
      if (match.index !== undefined) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          if (beforeText.length > 0) {
            children.push(
              new TextRun({
                text: beforeText,
                bold: isHeader,
                size: isHeader ? 22 : 20,
              })
            );
          }
        }

        // Add the bold text
        children.push(
          new TextRun({
            text: match[1],
            bold: true,
            size: isHeader ? 22 : 20,
            highlight: "yellow",
          })
        );

        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText.length > 0) {
        children.push(
          new TextRun({
            text: remainingText,
            bold: isHeader,
            size: isHeader ? 22 : 20,
          })
        );
      }
    }
  }
  
  return children.length > 0 ? children : [new TextRun({ text: " " })];
}
