import React, { useEffect, useState } from "react";

import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Button,
  Dialog,
  TextField
} from "@mui/material";

import {
  getAllCategoriesApi,
  createCategoryApi,
  deleteCategoryApi
} from "../../services/categoryService";

const Category = () => {

  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState<any>(null);

  const fetchData = async () => {

    const data = await getAllCategoriesApi();

    setCategories(data);

  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {

    const form = new FormData();

    form.append("name", name);
    form.append("logo_image", image);

    await createCategoryApi(form);

    setOpen(false);

    fetchData();

  };

  const handleDelete = async (id:string) => {

    await deleteCategoryApi(id);

    fetchData();

  };

  return (

    <>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Add Category
      </Button>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {categories.map((item) => (

            <TableRow key={item._id}>

              <TableCell>
                <img
                  src={item.logo_image}
                  width={50}
                />
              </TableCell>

              <TableCell>
                {item.name}
              </TableCell>

              <TableCell>

                <Button
                  color="error"
                  onClick={() =>
                    handleDelete(item._id)
                  }
                >
                  Delete
                </Button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

      <Dialog open={open}>

        <div style={{ padding: 20 }}>

          <TextField
            label="Name"
            fullWidth
            onChange={(e)=>
              setName(e.target.value)
            }
          />

          <input
            type="file"
            onChange={(e:any)=>
              setImage(e.target.files[0])
            }
          />

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Save
          </Button>

        </div>

      </Dialog>

    </>

  );
};

export default Category;