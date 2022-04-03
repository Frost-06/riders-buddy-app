import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AnimateOnTap from "../../components/AnimateOnTap";
import SavingButton from "../../components/SavingButton";
import ScreenHeader from "../../components/ScreenHeader";
import BottomNavContext from "../../context/BottomNavContext";
import UserContext from "../../context/UserContext";
import { slideBottom } from "../../misc/transitions";
import Api from "../../utils/api";
import fetchData from "../../utils/fetchData";
import { goBackOrPush } from "../../utils/goBackOrPush";

function Address(props) {
  const bcontext = useContext(BottomNavContext);
  const { userContext, setUserContext } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const { default_address, address } = useMemo(
    () => userContext || {},
    [userContext]
  );
  const [selected, setSelected] = useState(
    default_address ? default_address.add_id : 0
  );
  useEffect(() => {
    const { setBottomNavContext, bottomNavContext } = bcontext;
    setBottomNavContext({ ...bottomNavContext, visible: true });
  }, []);
  useEffect(() => {
    setSelected(default_address?.add_id || 0);
  }, [default_address]);
  const onSave = useCallback(() => {
    fetchData({
      before: () => setSaving(true),
      send: async () =>
        await Api.post("/add-address/default", {
          body: {
            add_id: selected,
            user_token: Api.getToken(),
          },
        }),
      after: (data) => {
        if (data?.success) {
          address["default_address"] = data.address;
          setUserContext({ ...userContext, ...address });
        }
        setSaving(false);
        goBackOrPush("/");
        if (props.location?.state?.onSave) {
          props.location.state.onSave(data.address);
        }
      },
    });
  }, [saving, selected]);
  const insertNewAddress = (address = null) => {
    if (!address) props.history.push("/new-address");
    else
      props.history.push({
        pathname: "/new-address",
        state: address,
      });
  };
  return (
    <motion.div
      animate="in"
      exit="out"
      initial="initial"
      variants={slideBottom}
    >
      <Container>
        <Box p={3}>
          <ScreenHeader title="Address" />

          <List>
            {Object.keys(default_address || {}).length ? (
              <ListItem className="address-detail default">
                {(() => {
                  const {
                    street,
                    barangay,
                    city,
                    province,
                    zip,
                    house_number,
                    country,
                  } = default_address;
                  return (
                    <Box className="center-all" justifyContent="space-between">
                      <Box>
                        <Box className="center-all">
                          <Icon>home</Icon>
                          <Typography style={{ fontWeight: 800 }}>
                            DEFAULT ADDRESS
                          </Typography>
                        </Box>
                        <Typography>
                          {house_number} {street}, {barangay}
                        </Typography>
                        <Typography>
                          {city}, {zip}
                        </Typography>
                        <Typography>
                          {province}, {country}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => {
                            insertNewAddress(default_address);
                          }}
                        >
                          <Icon>create</Icon>
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })()}
              </ListItem>
            ) : (
              <Typography variant="h5" color="textSecondary">
                Select a default address
              </Typography>
            )}
            <br />
            {address?.length
              ? address
                  .filter((q) => {
                    if (default_address?.add_id) {
                      return q.add_id !== default_address.add_id;
                    } else {
                      return true;
                    }
                  })
                  .map((add, index) => {
                    const {
                      street,
                      barangay,
                      city,
                      province,
                      zip,
                      house_number,
                      country,
                    } = add;
                    return (
                      <ListItem
                        selected={add.add_id === selected}
                        key={index}
                        className="address-detail"
                        onClick={() => setSelected(add.add_id)}
                        divider
                      >
                        <Box
                          className="center-all"
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography>
                              {house_number} {street}, {barangay}
                            </Typography>
                            <Typography>
                              {city}, {zip}
                            </Typography>
                            <Typography>
                              {province}, {country}
                            </Typography>
                          </Box>
                          {selected === add.add_id && (
                            <Box>
                              <IconButton
                                onClick={() => {
                                  insertNewAddress(add);
                                }}
                              >
                                <Icon>create</Icon>
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </ListItem>
                    );
                  })
              : null}
          </List>
          <AnimateOnTap>
            <Button
              className="themed-button inverted"
              variant="contained"
              onClick={() => insertNewAddress()}
            >
              <Icon>add</Icon>
            </Button>
          </AnimateOnTap>
          <br />
          <SavingButton
            saving={saving}
            className="themed-button "
            variant="contained"
            onClick={() => onSave()}
          >
            Save
          </SavingButton>
        </Box>
      </Container>
    </motion.div>
  );
}

export default Address;
