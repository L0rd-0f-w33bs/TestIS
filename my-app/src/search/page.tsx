import { Heart, MapPinned, MessageSquareQuote } from "lucide-react";
import React from "react";
import { Button, Divider } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../database/supabase";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function Search() {
  const [hotel, setHotel] = React.useState<{ address: string; name: string }[]>(
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const hotelParam = searchParams.get("hotel");
  const tagsParam = searchParams.get("tags")?.split("_").slice(0, -1);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log(tagsParam);
      try {
        if (hotelParam!.length === 0) {
          const { data, error } = await supabase
            .from("data")
            .select()
            .in("label", tagsParam as readonly string[]);

          const realData: { address: string; name: string }[] = [];
          data!.forEach((item) => {
            if (realData.filter((i) => i.name === item.name).length === 0) {
              realData.push({
                address: item.address,
                name: item.name,
              });
            }
          });
          setHotel(realData);
        } else {
          if (tagsParam?.length === 0) {
            const { data } = await supabase
              .from("data")
              .select()
              .eq("name", hotelParam);

            // setHotel(data[0]);
            if (data!.length > 0) setHotel([data![0]]);
            else setHotel([]);
            console.log(data);
          } else {
            const { data, error } = await supabase
              .from("data")
              .select()
              .eq("name", hotelParam)
              .in("label", tagsParam as readonly string[]);

            const realData: { address: string; name: string }[] = [];
            data!.forEach((item) => {
              if (realData.filter((i) => i.name === item.name).length === 0) {
                realData.push({
                  address: item.address,
                  name: item.name,
                });
              }
            });
            setHotel(realData);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-8 px-14 flex flex-col">
      <p className="font-semibold text-2xl mb-4">
        Showing hotel: '<span className="text-secondary">{hotelParam}</span>'
      </p>
      <p className="font-semibold text-xl mb-10">
        with tags:{" "}
        {tagsParam?.map((item, index) => {
          return (
            <>
              '<span className="text-secondary">{item}</span>'
              {index + 1 !== tagsParam.length && ", "}
            </>
          );
        })}
      </p>
      <div className="flex flex-col">
        {hotel.map((item, index) => {
          return <HotelItem item={item} key={index} />;
        })}
      </div>
    </div>
  );
}

function HotelItem({
  item,
}: {
  item: {
    address: string;
    name: string;
  };
}) {
  const [heart, setHeart] = React.useState<boolean>(false);
  const [num, setNum] = React.useState<number>(
    Math.floor(Math.random() * 900) + 100
  );
  return (
    <div className="flex w-full gap-8 mb-12 border p-6 rounded-2xl">
      <img
        src="https://s3-alpha-sig.figma.com/img/dabe/b29b/d81a4c540b6bcc0b5baebbef9fad8e99?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=n6aX2EO3SxVoe~c9e96MTJWRQ4~o-KYk8J-gHCghbwj33Uk~Ke0x1A38S5Xu29VUOc0dNjYlIdnmHHKU-lOL-~7ECPO7Ox173HCR7tGLOAc0zFdWt8Apgs9GJpZoBioxg8FtahyvkSsiuZDFbNXLq7X13w1fAa5bwYbNPILUL-CuY3Me77EbePX6IXX47n5-sGWnICH3cRT3MSYLNh6tToXeVK5duZT-9AzXEY7zuLqD5JFhFvQLk7IVdU4ci4AvZojl8kADHUrYdi6jyaQRwBlcf4jNRETvWN6pKDcIsxTtPWjNtEekQeKDG6HbtAFw6PH5BGhSenXrdDvCZAK27g__"
        alt="hotel"
        className="w-[280px] h-[280px] object-cover rounded-lg"
      />

      <div className="flex flex-col flex-1">
        <div className="flex justify-between mb-6 items-center">
          <p className="font-bold text-3xl">{item.name}</p>
          <TransitionsModal item={item} />
        </div>
        <p className="flex items-center gap-2 text-lg mb-6">
          <MapPinned className="w-4 h-4" /> {item.address}
        </p>
        <p className="text-primary text-5xl font-medium">{num},000đ</p>
        <Divider sx={{ marginY: "20px", marginTop: "auto" }} />
        <div className="flex gap-6">
          <Button
            variant="outlined"
            sx={{
              width: 56,
              height: 56,
            }}
            onClick={() => setHeart(!heart)}
          >
            <Heart
              className="w-5 h-5"
              fill={heart ? "red" : "white"}
              stroke="black"
            />
          </Button>
          <Button variant="contained" className="flex-1">
            <span className="text-white font-semibold text-lg capitalize">
              View place
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TransitionsModal({
  item,
}: {
  item: {
    address: string;
    name: string;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [text, setText] = React.useState<string>("");
  const [radio, setRadio] = React.useState<string>("pos");

  return (
    <div>
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={handleOpen}
      >
        <p className="font-semibold">Review</p>
        <MessageSquareQuote className="w-4 h-4" />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h5" component="h2">
              Write your review
            </Typography>
            <TextField
              sx={{ width: "100%", marginTop: 4, marginBottom: 2.5 }}
              id="outlined-multiline-static"
              label="Your review"
              multiline
              rows={4}
              defaultValue="Default Value"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <RowRadioButtonsGroup setRadio={setRadio} />
            <Button
              variant="contained"
              sx={{ marginTop: 3, marginLeft: "auto", width: 1 }}
              onClick={() => {
                const url1 = "http://localhost:5000/predict";
                const url2 = "http://localhost:5000/tag";

                const data1 = {
                  review: text,
                };

                const data2 = {
                  review: text,
                };

                // Create an array of fetch promises
                const requests = [
                  fetch(url1, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data1),
                  }),
                  fetch(url2, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data2),
                  }),
                ];

                // Use Promise.all to wait for both requests to complete
                Promise.all(requests)
                  .then((responses) => {
                    // Check each response
                    responses.forEach((response) => {
                      if (!response.ok) {
                        throw new Error(
                          "Network response was not ok for one of the requests"
                        );
                      }
                    });
                    // Parse each response as JSON
                    return Promise.all(
                      responses.map((response) => response.json())
                    );
                  })
                  .then(async (data) => {
                    const { error } = await supabase.from("review").insert({
                      review: text,
                      positive: radio === "pos",
                      tag: data[1].labels,
                      predict_positive: data[0].sentiment === "pos",
                    });

                    data[1].labels.forEach(async (i: string) => {
                      console.log(i)
                      const { error } = await supabase.from("data").insert({
                        label: i,
                        name: item.name,
                        address: item.address,
                      });
                    });

                    setOpen(false);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
            >
              <span className="normal-case text-white">Submit</span>
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function RowRadioButtonsGroup({
  setRadio,
}: {
  setRadio: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">
        Review genre
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={(e, value) => {
          setRadio(value);
        }}
        defaultValue={"pos"}
      >
        <FormControlLabel value="pos" control={<Radio />} label="Positive" />
        <FormControlLabel value="neg" control={<Radio />} label="Negative" />
      </RadioGroup>
    </FormControl>
  );
}
