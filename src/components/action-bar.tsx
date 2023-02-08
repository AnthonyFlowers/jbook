import "./action-bar.css";
import { useActions } from "../hooks/use-actions";
import { ActionButto } from "./action-button";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <ActionButto action={() => moveCell(id, "up")} icon="fa-arrow-up" />
      <ActionButto action={() => moveCell(id, "down")} icon="fa-arrow-down" />
      <ActionButto action={() => deleteCell(id)} icon="fa-times" />
    </div>
  );
};

export default ActionBar;
