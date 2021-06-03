import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import { TopBar } from "./";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
    "margin-bottom": "10px",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
}));



function Root(props) {
  const token = "4a00b96388e782a55c1b956576d375051b6dd8d2";
  const classes = useStyles();
  const [values, setValues] = React.useState({
    showPassword: false,
    openSnackBar: false,
    messageBarType: "info",
    messageBarText: "Enter a location and threshold, then click APPLY"
  });

  const [user, setUser] = React.useState({...props.user});
  const [feedLoaded, setfeedLoaded] = React.useState(false);

  const handleChange = (prop) => (event) => {
    setUser({ ...user, [prop]: event.target.value });
  };

  const handleSnackClose = () => {
    setValues({ ...values, openSnackBar: false });
  };

  const handleApply = async() => {

    await updateUser();
    if (props.userUpdated) {
      props.userUpdated(user);
    }

    await getFeed()
  }

  const getFeed = async () => {
    setfeedLoaded(true);
    setValues({ ...values });
    if (props.userUpdated) {
      props.userUpdated(user);
    }

    if(user.location){
      const data = (await axios.get(`https://api.waqi.info/feed/${user.location}/?token=${token}`)).data;
      setMessage(data);
    }else {
      setMessage();
    }

  }

  const setMessage = (data) => {

    if(!data){
      setValues({
        ...values,
        aqi: undefined,
        messageBarType: "info",
        messageBarText: "Enter a location and threshold, then click APPLY",
      });
      return
    }

    if (data.status === "ok") {
      if (data.data.aqi > user.threshold) {
        setValues({
          ...values,
          aqi: data.data.aqi,
          messageBarType: "warning",
          messageBarText: "Air quality is above your threshold",
        });
      } else {
        setValues({
          ...values,
          aqi: data.data.aqi,
          messageBarType: "success",
          messageBarText: "Air quality is below your threshold",
        });
      }
    } else if (data.status === "error") {
      setValues({
        ...values,
        messageBarType: "error",
        messageBarText:
          data.data === "Unknown station" ? "Unknown Location" : data.data,
      });
    } else {
      setValues({
        ...values,
        messageBarType: "error",
        messageBarText: "An unknow issue has occured",
      });
    }
  }

  const updateUser = async () => {
      try {
        const result = await axios.put(
          `http://localhost:3001/users/${user._id}`,
          user,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
        return result.data;
      } catch (e) {
        return;
      }
  }

  const isFormValid = () => {
    if(user.location && user.threshold){
      return true;
    }

    return false;
  }

  if (!feedLoaded) {
    setTimeout(() => {
        getFeed();
    });
  }

  return (
    <div>
      <TopBar {...props} />

      <h1>Asthma Warning Tool</h1>
      <MuiAlert variant="filled" severity={values.messageBarType}>
        {values.messageBarText}
      </MuiAlert>

      <div>
        <FormControl>
          <TextField
            label="Location"
            id="standard-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            value={user.location}
            onChange={handleChange("location")}
          />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <TextField
            label="Warning Threshold"
            id="standard-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            value={user.threshold}
            onChange={handleChange("threshold")}
          />
        </FormControl>
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px", width: "100%" }}
        onClick={handleApply}
        disabled={!isFormValid()}
      >
        APPLY
      </Button>

      <Snackbar
        open={values.openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <MuiAlert variant="filled" severity="error">
          Sorry, Login Failed!!
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Root;
