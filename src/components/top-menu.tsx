import { ChangeEvent, useEffect, useState } from "react";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import "./top-menu.css";

export const TopMenu = () => {
  const { updateTitle, exportCells } = useActions();
  const initialTitle = useTypedSelector(({ cells: { title } }) => {
    return title;
  });
  const [title, setTitle] = useState<string>(initialTitle);

  const handleExport = () => {
    exportCells();
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      updateTitle(title);
      console.log("updated title");
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [title, updateTitle]);

  const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  return (
    <div className="top-menu">
      <h1>Book Title:</h1>
      <span className="control">
        <input
          className="input is-rounded"
          type="text"
          value={title}
          onChange={handleTitleChange}
          disabled
        />
      </span>
      <button
        className="button is-rounded is-primary is-small"
        onClick={handleExport}
      >
        Save Book
      </button>
    </div>
  );
};
