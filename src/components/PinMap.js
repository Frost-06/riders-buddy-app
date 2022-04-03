import { Box, Button, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import "mapbox-gl/dist/mapbox-gl.css";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import PlaceSearch, { searchPlace } from "./PlaceSearch";
import { slideLeft } from "../misc/transitions";
import DialogContext from "../context/DialogContext";

const maxBounds = {
  minLong: 123.28372256301138,
  minLat: 9.463845136639286, // Southwest coordinates
  maxLong: 124.0554256157062,
  maxLat: 11.33113362387221, // Northeast coordinates
};
export default function PinMap(props) {
  const mapRef = useRef();
  const { setDialogContext } = useContext(DialogContext);
  const [isPanning, setIsPanning] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [pinLoc, setPinLoc] = useState({
    latitude: 10.3766,
    longitude: 123.9573,
  });
  const [settings, setsettings] = useState({
    // scrollZoom: false,
    // touchZoom: false,
    // doubleClickZoom: false,
  });
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 10.361336086091555,
    longitude: 123.98039321697425,
    zoom: 15,
    minZoom: 15,
    maxZoom: 18,
  });
  const [selected, setSelected] = useState(null);
  const onChange = useCallback((feature) => {
    const { geometry } = feature;
    const latitude = geometry.coordinates[1];
    const longitude = geometry.coordinates[0];
    setViewport({ ...viewport, latitude, longitude });
    setPinLoc({ latitude, longitude });
    setSelected(feature);
  }, []);
  useEffect(() => {
    setDialogContext({
      visible: true,
      title: <span>Please select your location</span>,
      message: (
        <Box>
          <Typography>
            You can pin <span className="icon-location-alt"></span> your
            location manually, use the search box, or search via GPS.
          </Typography>
        </Box>
      ),
      actions: [
        {
          name: "GOT IT",
          callback: ({ closeDialog, setLoading }) => {
            closeDialog();
          },
          props: {
            variant: "contained",
            color: "primary",
          },
        },
      ],
    });
  }, []);
  useEffect(() => {
    if (props.address) {
      onChange(props.address);
      setPlaceName(props.address.place_name);
    }
  }, [props.address]);
  return (
    <motion.div
      variant={slideLeft}
      initial="initial"
      animate="in"
      exit="out"
      style={{ width: "100vw", height: "100vh" }}
    >
      <PlaceSearch
        onChange={onChange}
        onClear={() => {
          setSelected(null);
        }}
        value={placeName}
      />
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        {...settings}
        onViewportChange={(viewport) => {
          const { latitude, longitude } = viewport;
          setPinLoc({ latitude, longitude });
          setViewport(viewport);
        }}
        mapStyle="mapbox://styles/azkalonz/ckhpxvrmj072r19pemg86ytbk"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewStateChange={(state) => {
          if (selected) setSelected(null);
          if (state?.interactionState?.isPanning !== undefined)
            setIsPanning(state.interactionState.isPanning);
        }}
        onTouchEnd={(event) => {
          if (mapRef.current) {
            const { lng, lat } = mapRef.current.getMap().getCenter();
            const longitude = lng;
            const latitude = lat;
            searchPlace(
              `${longitude},${latitude}`,
              (res) => {
                if (res.data.features && res.data.features[0]) {
                  setSelected(res.data.features[0]);
                  setPlaceName(res.data.features[0].place_name);
                } else {
                  setPlaceName(null);
                  setSelected(null);
                }
              },
              1
            );
          }
          setIsPanning(false);
          setSelected(null);
        }}
      >
        <GeolocateControl
          style={{
            transition: "bottom 0.4s ease-out",
            position: "absolute",
            bottom: selected ? 150 : 60,
            left: 0,
            margin: 10,
            transform: "scale(2)",
            transformOrigin: "bottom left",
          }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <Marker {...pinLoc}>
          <div className={["center-pin", isPanning ? "panning" : ""].join(" ")}>
            <span className="icon-location"></span>
          </div>
        </Marker>
      </ReactMapGL>
      {selected && (
        <Box className="save-place" p={3} paddingBottom={0} paddingTop={0}>
          <Button
            className="themed-button"
            variant="outlined"
            onClick={() => {
              if (props.onChange) props.onChange(selected);
            }}
          >
            Continue
          </Button>
        </Box>
      )}
    </motion.div>
  );
}
