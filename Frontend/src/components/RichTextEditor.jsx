import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEditor,
  Transforms,
  Editor,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import { Node } from "slate";

// MUI icons
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import Code from "@mui/icons-material/Code";
import FormatQuote from "@mui/icons-material/FormatQuote";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatAlignLeft from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRight from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustify from "@mui/icons-material/FormatAlignJustify";
import { useTheme } from "./ThemeProvider";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const RichTextEditor = ({ course, setCourse }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  let { theme } = useTheme();

  if (!theme) {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    theme = isDarkMode ? "dark" : "light";
  }

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: course?.description || "" }],
    },
  ]);

  useEffect(() => {
    if (Array.isArray(course?.description)) {
      setValue([
        {
          type: "paragraph",
          children: [{ text: course?.description || "" }],
        },
      ]);
    } else {
      const lines = course?.description?.split(/\r?\n/) || [""];
      const nodes = lines.map((line) => ({
        type: "paragraph",
        children: [{ text: line }],
      }));
      setValue(nodes);
    }
  }, [course?.description]);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        const plainText = newValue.map((n) => Node.string(n)).join("\n");
        setCourse(prev =>({ ...prev, description: plainText }));
      }}
    >
      <div style={styles.toolbar(theme)}>
        <MarkButton format="bold" Icon={FormatBold} theme={theme} />
        <MarkButton format="italic" Icon={FormatItalic} theme={theme} />
        <MarkButton format="underline" Icon={FormatUnderlined} theme={theme} />
        <MarkButton format="code" Icon={Code} theme={theme} />
        <HeadingDropdown theme={theme} />
        <BlockButton format="block-quote" Icon={FormatQuote} theme={theme} />
        <BlockButton format="numbered-list" Icon={FormatListNumbered} theme={theme} />
        <BlockButton format="bulleted-list" Icon={FormatListBulleted} theme={theme} />
        <BlockButton format="left" Icon={FormatAlignLeft} theme={theme} />
        <BlockButton format="center" Icon={FormatAlignCenter} theme={theme} />
        <BlockButton format="right" Icon={FormatAlignRight} theme={theme} />
        <BlockButton format="justify" Icon={FormatAlignJustify} theme={theme} />
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        style={styles.editable}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              toggleMark(editor, HOTKEYS[hotkey]);
            }
          }
        }}
      />
    </Slate>
  );
};

const MarkButton = ({ format, Icon,theme }) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  return (
    <button
      style={styles.iconBtn(active, theme)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const BlockButton = ({ format, Icon,theme }) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  return (
    <button
      style={styles.iconBtn(active,theme)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon />
    </button>
  );
};

const HeadingDropdown = ({theme}) => {
  const editor = useSlate();
  const [selected, setSelected] = useState("paragraph");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    toggleBlock(editor, value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      style={styles.select(theme)}
    >
      <option value="paragraph">Normal</option>
      <option value="heading-one">H1</option>
      <option value="heading-two">H2</option>
      <option value="heading-three">H3</option>
      <option value="heading-four">H4</option>
      <option value="heading-five">H5</option>
      <option value="heading-six">H6</option>
    </select>
  );
};

const Element = ({ attributes, children, element }) => {
  const style = isAlignElement(element) ? { textAlign: element.align } : {};
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "heading-one":
      return (
        <h1 style={{ ...style, fontSize: "2em" }} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={{ ...style, fontSize: "1.75em" }} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={{ ...style, fontSize: "1.5em" }} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={{ ...style, fontSize: "1.25em" }} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={{ ...style, fontSize: "1.1em" }} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 style={{ ...style, fontSize: "1em" }} {...attributes}>
          {children}
        </h6>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !isAlignType(format),
    split: true,
  });

  const newProperties = isAlignType(format)
    ? { align: isActive ? undefined : format }
    : { type: isActive ? "paragraph" : isList ? "list-item" : format };

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === "align" ? n.align === format : n.type === format),
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const isAlignType = (format) => TEXT_ALIGN_TYPES.includes(format);
const isAlignElement = (element) => "align" in element;

const styles = {
  toolbar: (theme) => ({
    display: "flex",
    gap: "0.5rem",
    padding: "0.5rem",
    borderBottom: "1px solid #ddd",
    background: theme === "dark" ? "#333" : "#f9f9f9",
    flexWrap: "wrap",
  }),
  iconBtn: (active, theme) => ({
    cursor: "pointer",
    padding: "6px",
    border: active ? "2px solid #1976d2" : "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: active ? "#e3f2fd" : theme === "dark" ? "#333" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  }),
  select: (theme) => ({
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: theme === "dark" ? "#333" : "#fff",
    fontSize: "14px",
    cursor: "pointer",
  }),
  editable: {
    padding: "1rem",
    minHeight: "200px",
    fontSize: "16px",
  },
};

export default RichTextEditor;
