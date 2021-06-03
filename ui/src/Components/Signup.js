import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
    'margin-bottom': '10px'
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  }
}));

function Signup(props) {
  const history = useHistory();
  const classes = useStyles();
  const [values, setValues] = React.useState({
    showPassword: false,
    openSnackBar: false,
  });

  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password: "",
    token: "",
  });

  const createUser = async () => {
    try{
      const result = await axios.post("http://localhost:3001/users", user);
      return result.data;
    }catch(e){
      return
    }
  };

  const getToken = async () => {
    const result = await axios.post("http://localhost:3001/tokens", user);
    return result.data;
  };

  const handleChange = (prop) => (event) => {
    setUser({ ...user, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isFormValid = () => {
    if (user.name && user.email && user.password && isValidEmail()) {
      return true;
    }

    return false;
  };

  const isValidEmail = () => {
    if (
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        user.email
      )
    ) {
      return true;
    }

    return false;
  };

  const handleSignup = async () => {

    const newUser = await createUser();

    if(newUser){
  
      if (props.userUpdated) {
        const token = await getToken();
        props.userUpdated({ ...newUser, token: token });
      }

      history.push("/");
    }else{
      setValues({ ...values, openSnackBar: true });
    }
  };

  const handleSnackClose = () => {
    setValues({ ...values, openSnackBar: false });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <FormControl>
          <TextField
            label="Name"
            id="standard-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            value={user.name}
            onChange={handleChange("name")}
          />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <TextField
            label="Email"
            id="standard-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            value={user.email}
            onChange={handleChange("email")}
          />
        </FormControl>
      </div>
      <div>
        <FormControl className={clsx(classes.margin, classes.textField)}>
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={user.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px", width: "100%" }}
        onClick={handleSignup}
        disabled={!isFormValid()}
      >
        SIGN UP
      </Button>

      <Button
        variant="contained"
        color="secondary"
        href="login"
        style={{ marginTop: "20px", width: "100%" }}
      >
        LOG IN
      </Button>

      <Snackbar
        open={values.openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <MuiAlert variant="filled" severity="error">
          Sorry, Signup Failed!!
          <br /> The email endered is probably already in use
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Signup;
