import React, { useEffect, useState } from "react";

import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  TextField
} from "@mui/material";

import {
  getAllBannersApi,
  createBannerApi,
  deleteBannerApi
} from "../../services/bannerService";

const Banner = () => {

  const [banners, setBanners] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);

  const fetchData = async () => {

    const data = await getAllBannersApi();

    setBanners(data);

  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {

    const form = new FormData();

    form.append("title", title);
    form.append("image", image);

    await createBannerApi(form);

    setOpen(false);

    fetchData();

  };

  const handleDelete = async (id: string) => {

    await deleteBannerApi(id);

    fetchData();

  };

  return (

    <>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Add Banner
      </Button>

      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

          {banners.map((item) => (

            <TableRow key={item._id}>

              <TableCell>
                <img src={item.image} width={100}/>
              </TableCell>

              <TableCell>
                {item.title}
              </TableCell>

              <TableCell>

                <Button
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

      {/* Dialog */}

      <Dialog open={open} onClose={() => setOpen(false)}>

        <div style={{ padding: 20 }}>

          <TextField
            label="Title"
            fullWidth
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="file"
            onChange={(e:any) =>
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

export default Banner;