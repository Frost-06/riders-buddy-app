import React, { useCallback, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../utils/api";

export default function UserSearch(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const fetch = useCallback((value) => {
    (async () => {
      const response = await Api.get(
        "/users/" + value + "?token=" + Api.getToken()
      );
      setOptions(response);
    })();
  }, []);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.user_id === value.user_id}
      getOptionLabel={(option) => {
        return option.user_fname + " " + option.user_lname;
      }}
      options={options}
      loading={loading}
      onChange={(e, val) => {
        props.onChange(val);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="User"
          variant="outlined"
          onChange={(e) => {
            fetch(e.target.value);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
