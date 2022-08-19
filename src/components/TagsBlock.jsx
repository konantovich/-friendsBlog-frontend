import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true, handlePostsByTag }) => {


  return (
    <SideBlock title="Tags (last 5)">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
            <ListItem key={i} onClick={() => handlePostsByTag(name)} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
