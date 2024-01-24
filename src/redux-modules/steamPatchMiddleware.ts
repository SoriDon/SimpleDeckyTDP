import { Dispatch } from "redux";
import {
  getAdvancedOptionsInfoSelector,
  setCurrentGameInfo,
  setSteamPatchDefaultTdp,
} from "./settingsSlice";
import {
  AdvancedOptionsEnum,
  createServerApiHelpers,
  getServerApi,
  setValuesForGameId,
} from "../backend/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { ServerAPI } from "decky-frontend-lib";
import { resumeAction } from "./extraActions";
import { extractCurrentGameId } from "../utils/constants";

export const steamPatchMiddleware =
  (store: any) => (dispatch: Dispatch) => (action: PayloadAction<any>) => {
    const result = dispatch(action);

    const serverApi = getServerApi();

    const { setSetting } = createServerApiHelpers(serverApi as ServerAPI);

    const state = store.getState();

    const { advancedState } = getAdvancedOptionsInfoSelector(state);
    const steamPatchEnabled = Boolean(
      advancedState[AdvancedOptionsEnum.STEAM_PATCH]
    );

    const id = extractCurrentGameId();

    if (steamPatchEnabled) {
      if (action.type === setSteamPatchDefaultTdp.type) {
        setSetting({
          fieldName: "steamPatchDefaultTdp",
          fieldValue: state.settings.steamPatchDefaultTdp,
        });
      }

      if (action.type === resumeAction.type) {
        setValuesForGameId(id);
      }

      if (action.type === setCurrentGameInfo.type) {
        setValuesForGameId(id);
      }
    }

    return result;
  };
