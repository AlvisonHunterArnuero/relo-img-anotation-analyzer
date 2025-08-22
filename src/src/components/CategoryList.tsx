import React, { FC } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import { CategoryListProps } from '@/types/annotation';

const CategoryList: FC<CategoryListProps> = ({
  categories = [],
  selectedId,
  handleCategoryChange,
  label = 'Categories',
  useAsFormField = true,
}) => {
  const Wrapper: React.ElementType = useAsFormField
    ? FormControl
    : Box;

  return (
    <Wrapper
      fullWidth={useAsFormField ? true : undefined}
      className="flex-grow max-h-[80vh] max-w-full"
    >
      {useAsFormField ? (
        <FormLabel id="category-label" className="mb-2">
          {label}
        </FormLabel>
      ) : null}

      {categories.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          className="p-3"
        >
          No categories available
        </Typography>
      ) : (
        <List
          role="listbox"
          aria-labelledby={
            useAsFormField ? 'category-label' : undefined
          }
          className="overflow-y-auto border rounded-md max-h-[52vh]"
          dense
          subheader={
            !useAsFormField ? (
              <ListSubheader component="div">{label}</ListSubheader>
            ) : undefined
          }
        >
          {categories.map(({ id, name }) => (
            <ListItem
              key={String(id)}
              disablePadding
              role="option"
              aria-selected={selectedId === id}
            >
              <ListItemButton
                selected={selectedId === id}
                onClick={() => handleCategoryChange(id)}
              >
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Wrapper>
  );
};

export default CategoryList;
