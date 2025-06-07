import { Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const Courses = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mt: 7, mx: 3, maxWidth: "900px" }}>
        <Box sx={{ textAlign: "center", pt: 1, pb: 3 }}>
          <Box sx={{ fontSize: 22, fontWeight: "600" }}>
            Материалы по предметам
          </Box>
        </Box>
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
          <SimpleTreeView>
            <TreeItem itemId="grid" label="Искусственный интеллект">
              <TreeItem
                itemId="grid-resource"
                label={
                  <Box
                    component={"a"}
                    href="https://drive.google.com/drive/folders/16w7VWYO3nQ2wi4qutOc2dqRq5eLbXSgd"
                    target="blank"
                  >
                    Ресурс преподавателя
                  </Box>
                }
              />
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Box>
    </Box>
  );
};
