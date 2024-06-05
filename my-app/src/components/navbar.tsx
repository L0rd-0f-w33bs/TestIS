import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { Heart, MapPinned, MessageSquareQuote, User } from "lucide-react";
import { Button, Divider } from "@mui/material";
import { useSearchParams } from "react-router-dom";
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
import Avatar from "@mui/material/Avatar";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [login, setLogin] = React.useState<boolean>(false);

  return (
    <div className="relative">
      <div
        className={twMerge(
          "absolute w-full flex items-center gap-6 px-14 py-8 z-10",
          pathname !== "/" && "bg-primary"
        )}
      >
        <p
          className=" text-4xl text-white font-semibold select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          Escape{" "}
          <span className="text-primary bg-white rounded-md px-4 py-1">
            Expert
          </span>
        </p>

        {!login && (
          <>
            <TransitionsModal setLogin={setLogin} />

            <Button
              variant={pathname === "/" ? "contained" : "outlined"}
              sx={
                pathname === "/"
                  ? {}
                  : {
                      backgroundColor: "white",
                      ":hover": {
                        backgroundColor: "white",
                      },
                    }
              }
            >
              <p
                className={twMerge(
                  "text-xl my-1 capitalize font-medium mx-3",
                  pathname === "/" && "text-white"
                )}
              >
                Sign up
              </p>
            </Button>
          </>
        )}
        {login && (
          <div className="flex ml-auto">
            <Avatar sx={{ width: 44, height: 44, backgroundColor: "white" }}>
              <User stroke="#81D8D0" strokeWidth={2.5} />
            </Avatar>
          </div>
        )}
      </div>
      <div className={twMerge(pathname !== "/" && "pt-28")}>
        <Outlet />
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
  setLogin,
}: {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [role, setRole] = React.useState<string>("user");

  return (
    <div className="ml-auto">
      <Button
        onClick={() => handleOpen()}
        variant={pathname === "/" ? "text" : "contained"}
      >
        <p className="text-white text-xl my-1 capitalize font-medium mx-3">
          Login
        </p>
      </Button>
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
            <Typography
              id="transition-modal-title"
              variant="h5"
              component="h2"
              sx={{ marginBottom: 2.5 }}
            >
              Please choose your login role
            </Typography>

            <RowRadioButtonsGroup setRole={setRole} />
            <Button
              variant="contained"
              sx={{ marginTop: 3, marginLeft: "auto", width: 1 }}
              onClick={() => {
                if (role === "user") {
                  setOpen(false);
                  navigate("/");
                } else navigate("/ds");
                setLogin(true);
              }}
            >
              <span className="normal-case text-white">Login</span>
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function RowRadioButtonsGroup({
  setRole,
}: {
  setRole: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Login role</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={(e, value) => {
          setRole(value);
        }}
        defaultValue="user"
      >
        <FormControlLabel value="user" control={<Radio />} label="User" />
        <FormControlLabel
          value="ds"
          control={<Radio />}
          label="Data Scientist"
        />
      </RadioGroup>
    </FormControl>
  );
}
