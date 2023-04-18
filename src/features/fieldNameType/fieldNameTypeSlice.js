import { createSlice } from '@reduxjs/toolkit';

import findRowById from '../../helpers/findByRowId';
// Trying to create data as given in the mock video but in tree format - items se recursion ho raha hai
const initialState = {
  id: 0,
  items: [
    {
      id: 1,
      body: 'person',
      dataType: 'Object',
      items: [
        {
          id: 11,
          body: 'name',
          dataType: 'Object',
          items: [
            {
              id: 111,
              body: 'firstName',
              dataType: 'String',
            },
            {
              id: 112,
              body: 'lastName',
              dataType: 'String',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      body: 'order',
      dataType: 'String',
    },
    {
      id: 3,
      body: 'class',
      dataType: 'Boolean',
    },
  ],
};

const fieldNameTypeSlice = createSlice({
  name: 'fieldNameType',
  initialState,
  reducers: {
    // Insert new row -- Borking correctly
    handleInsertRow: (state, action) => {
      const { items } = state;
      const { id, body, dataType, parentId } = action.payload;
      const newRow = {
        id,
        body,
        dataType,
        items: [],
      };

      // // Recursive function to find Row by id - Returns the row if found
      // const findRowById = (parentId, items) => {
      //   for (let i = 0; i < items.length; i++) {
      //     console.log(
      //       '🚀 ~ file: fieldNameTypeSlice.js:75 ~ items[i]:',
      //       items[i].id,
      //       parentId
      //     );
      //     if (items[i].id === parentId) {
      //       return items[i];
      //     }
      //     if (items[i].items) {
      //       const result = findRowById(parentId, items[i].items);
      //       if (result) {
      //         return result;
      //       }
      //     }
      //   }
      //   return null;
      // };

      // Check if parent row exists
      const parentRow = findRowById(parentId, items);

      // If parent row exists, add new row to its items otherwise add new row to items
      if (parentRow) {
        parentRow.items = parentRow.items || [];
        parentRow.items.push(newRow);
      } else {
        items.push(newRow);
      }

      console.log('Handle Insert Row', state, action.payload);
    },

    // Edit row -- Under development
    handleEditRow: (state, action) => {
      const { items } = state;
      const { id, body, dataType } = action.payload;

      // Recursive function to find Row by id - Returns row - always found in this case
      const findRowById = (id, items) => {
        for (let i = 0; i < items.length; i++) {
          console.log(
            '🚀 ~ file: fieldNameTypeSlice.js:75 ~ items[i]:',
            items[i].id,
            id
          );
          if (items[i].id === id) {
            if (dataType === 'Object') {
              return (items[i] = { ...items[i], body, dataType });
            } else {
              return (items[i] = { ...items[i], body, dataType, items: [] });
            }
          }
          if (items[i].items) {
            const result = findRowById(id, items[i].items);
            if (result) {
              return result;
            }
          }
        }
        return null;
      };

      // Check if parent row exists
      findRowById(id, items);

      console.log('Handle Edit Row', state, action.payload);
    },

    // Delete row -- Not Borking correctly
    handleDeleteRow: (state, action) => {
      const { items } = state;
      const { id } = action.payload;

      const deleteRowById = (id, items) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === id) {
            console.log('Found Row', i);
            items.splice(i, 1); // Delete row
            return true; // Return true when row is found and deleted
          }
          if (items[i].items) {
            // Recursively call deleteRowById for nested items
            if (deleteRowById(id, items[i].items)) {
              return true; // Return true if row is found and deleted in nested items
            }
          }
        }
        return false; // Return false if row is not found
      };

      deleteRowById(id, items);

      console.log('Handle Delete Row', state, 'Action.payload', action.payload);
    },
  },
});

export const { handleInsertRow, handleEditRow, handleDeleteRow } =
  fieldNameTypeSlice.actions;

export default fieldNameTypeSlice.reducer;
