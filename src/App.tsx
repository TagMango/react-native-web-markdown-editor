import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
// @ts-ignore
import draftToMarkdown from "draftjs-to-markdown";
import anchorme from "anchorme";
import "./App.css";

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

const toolbarMango = {
  options: ["inline", "blockType"],
  inline: {
    inDropdown: false,
    className: "inlineTool",
    component: undefined,
    dropdownClassName: "toolbarDropdown",
    options: ["bold", "italic", "underline"],
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3"],
    className: "blockTool",
    component: undefined,
    dropdownClassName: "toolbarDropdown",
  },
};
const hashConfig = {
  trigger: "#",
  separator: " ",
};
const config = {
  blockTypesMapping: {
    "unordered-list-item": "* ",
  },
  emptyLineBeforeBlock: true,
};

const App: React.FC = () => {
  const [aboutYou, setAboutYou] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };
  const onContentStateChange = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToMarkdown(rawContentState, hashConfig, config);
    if (markup) {
      setAboutYou(anchorme(markup));
    }
  };
  useEffect(() => {
    window.ReactNativeWebView?.postMessage(aboutYou);
  }, [aboutYou]);
  return (
    <div className="App">
      <Editor
        editorState={editorState}
        toolbar={toolbarMango}
        placeholder="Add description"
        toolbarClassName="toolbarClassName"
        wrapperClassName="emailBodyEditorWrapper"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        onContentStateChange={onContentStateChange}
      />
    </div>
  );
};

export default App;
