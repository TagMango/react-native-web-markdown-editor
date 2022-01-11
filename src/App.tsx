import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
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

const App: React.FC = () => {
  const [aboutYou, setAboutYou] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };
  const onContentStateChange = (contentState: any) => {
    const content = draftToHtml(contentState);
    if (content) {
      setAboutYou(anchorme(content));
    }
  };
  useEffect(() => {
    console.log(aboutYou);
    window.ReactNativeWebView?.postMessage(aboutYou);
  }, [aboutYou]);
  useEffect(() => {
    const styledValue =
      new URLSearchParams(window.location.search).get("styledValue") || "";
    const value =
      new URLSearchParams(window.location.search).get("value") || "";
    setAboutYou(value);
    const blocksFromHtml = htmlToDraft(styledValue || value);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, []);
  return (
    <div className="App">
      <Editor
        editorState={editorState}
        toolbar={toolbarMango}
        toolbarHidden
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
