import { Dispatch } from "redux";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
import { RootState } from "../reducers";
import localforge from "localforage";
import * as fs from "streamsaver";

const cellsCache = localforge.createInstance({
  name: "cellcache",
});

export const fetchCells = (bookTitle: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.FETCH_CELLS });
    let item = await cellsCache.getItem<{
      order: string[];
      data: { [key: string]: Cell };
      title: string;
    }>(bookTitle, (err: Error) => {
      if (err) {
        dispatch({
          type: ActionType.FETCH_CELLS_ERROR,
          payload: err.message,
        });
      }
    });
    if (!item) {
      item = {
        data: {},
        order: [],
        title: "default",
      };
    }
    dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: item });
  };
};

export const getCachedBooks = () => {
  return async () => {
    return await cellsCache.keys();
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { cells } = getState();
    await cellsCache.setItem(cells.title, cells, (err: Error) => {
      if (err) {
        dispatch({
          type: ActionType.SAVE_CELLS_ERROR,
          payload: err.message,
        });
      }
    });
  };
};

export const exportCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    console.log("saving");
    const { cells } = getState();
    const stringifiedBook = JSON.stringify(cells, null, 2);
    const fileStream = fs.createWriteStream(`${cells.title}.book`);
    new Response(stringifiedBook).body
      ?.pipeTo(fileStream)
      .then((success) => {
        console.log("saved");
        dispatch({ type: ActionType.EXPORT_BOOK_SUCCESS });
      })
      .catch((err) => {
        dispatch({ type: ActionType.EXPORT_BOOK_ERROR, payload: err });
      });
  };
};
