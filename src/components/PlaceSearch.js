import {
  Backdrop,
  Box,
  Button,
  ButtonBase,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import Axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserContext from "../context/UserContext";
import Address from "./Address";

export async function searchPlace(value, callback, limit = 10) {
  let token = process.env.REACT_APP_MAPBOX_TOKEN;
  let res = await Axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?autocomplete=true&access_token=${token}&limit=${limit}&country=PH&region=Cebu`
  );
  callback(res);
}

function PlaceSearch(props) {
  const { userContext } = useContext(UserContext);
  const [result, setResult] = useState(null);
  const [val, setVal] = useState();
  const search = useCallback(
    (value) => {
      if (value.length) {
        setVal(value);
        (async () => {
          await searchPlace(value, (res) => {
            if (res.data.features.length) setResult(res.data.features);
            else setResult(null);
          });
        })();
      } else {
        clearSearch();
      }
    },
    [result]
  );
  const clearSearch = useCallback(() => {
    setVal();
    setResult(null);
    if (props.onClear) props.onClear();
  }, [setVal, setResult]);
  useEffect(() => {
    if (props.value) {
      setVal(props.value);
    }
  }, [props.value]);
  useEffect(() => {
    if (userContext?.default_address) {
      const { barangay, city, street } = userContext?.default_address;
      search(`${street ? street + ", " : ""}${barangay}, ${city}`);
    }
  }, []);
  return (
    <React.Fragment>
      <Box className="place-search">
        <Box>
          <Address />
        </Box>
        <Box position="relative" width="100%">
          <TextField
            spellCheck={false}
            className="themed-input"
            variant="outlined"
            placeholder="Search Place"
            onChange={(e) => search(e.target.value)}
            value={val ? val : ""}
            fullWidth
          />
          {val && (
            <Button onClick={clearSearch} className="clear">
              Clear
            </Button>
          )}
        </Box>

        {result?.length ? (
          <Box className="result">
            <List>
              {result.map((feature, index) => (
                <ButtonBase
                  component={ListItem}
                  key={index}
                  onClick={() => {
                    setResult(null);
                    props.onChange(feature);
                    setVal(feature.place_name);
                  }}
                >
                  <Typography>{feature.place_name}</Typography>
                </ButtonBase>
              ))}
            </List>
          </Box>
        ) : null}
      </Box>
      <Backdrop
        style={{ background: "rgba(0,0,0,0.1)", zIndex: 99 }}
        open={result !== null}
        onClick={() => {
          setResult(null);
        }}
      />
    </React.Fragment>
  );
}

export default PlaceSearch;
