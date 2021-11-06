import { ElTable } from "element-ui/types/table";

export type PTable = ElTable & {
  refresh: () => Promise<void>;
  clearData: () => void;
};
