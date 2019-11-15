import React, { useState } from "react";
import { axiosWithAuth } from "./axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState(initialColor);

  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`/api/colors`, colorToAdd)
      .then(res => {
        updateColors([...colors, colorToAdd]);
        setColorToAdd(initialColor);
      })
      .catch(err => console.log(err));
  };

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => updateColors(colors.map(color => {
        return color.id === colorToEdit.id ? colorToEdit : color;
      })))
      .catch(err => console.log(err));
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
  };

  const deleteColor = (color, e) => {
    e.stopPropagation();
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        updateColors(colors.filter(item => item.id !== color.id));
        return color.id === colorToEdit.id ? setEditing(false) : null;
      })
      .catch(err => console.log(err));
    // make a delete request to delete this color
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e =>
                    deleteColor(color, e)
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <form onSubmit={addColor}>
        <p>Add a Color</p>
        <label>
          color name:
          <input
            onChange={e => setColorToAdd({...colorToAdd, color: e.target.value })}
            value={colorToAdd.color}
            />
        </label>
        <label>hex code:
          <input 
            onChange={e => setColorToAdd({...colorToAdd, code: {hex: e.target.value}})}
            value={colorToAdd.code.hex}
          />
        </label>
        <div className="button-row">
          <button type="submit">Add</button>
        </div>
      </form>
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      
    </div>
  );
};
// make sure to look at how you had to add the form ABOVE the div w the class name spacer, otherwise it would not appear where you wanted it
export default ColorList;
