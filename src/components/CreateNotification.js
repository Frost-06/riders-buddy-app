import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Api from "../utils/api";
import fetchData from "../utils/fetchData";
import SavingButton from "./SavingButton";
import UserSearch from "./UserSearch";
import { NotificationCard } from "../screens/home/Notifications";
import moment from "moment";
import UserContext from "../context/UserContext";
import DialogContext from "../context/DialogContext";

function CreateNotification(props) {
  const { userContext } = useContext(UserContext);
  const { setDialogContext } = useContext(DialogContext);
  const { open, setOpen } = props.controls;
  const [forEveryone, setForEveryone] = useState(true);
  const [externalUrl, setExternalUrl] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendTo, setSendTo] = useState(null);
  const [errors, setErrors] = useState({});
  const titleRef = useRef();
  const actionRef = useRef();
  const bodyRef = useRef();
  const textFieldProps = useMemo(
    () => ({
      variant: "outlined",
      fullWidth: true,
    }),
    []
  );
  const preview = useCallback(() => {
    setDialogContext({
      visible: true,
      title: "Preview",
      message: (
        <NotificationCard
          notif_meta={JSON.stringify({
            title: titleRef.current?.value || "",
            body: bodyRef.current?.value || "",
          })}
          viewed={1}
          created_at={moment()}
          notif_type="update"
          provider_name={userContext.user_fname + " " + userContext.user_lname}
        />
      ),
    });
  }, [userContext]);
  const reset = useCallback(() => {
    setErrors({});
    titleRef.current.value = "";
    bodyRef.current.value = "";
    setSendTo(null);
    setForEveryone(true);
    setOpen(false);
  }, [setErrors]);
  const submit = useCallback(
    (callback = () => {}) => {
      const form = {
        consumer_user_id: -1,
        notif_type: "update",
      };
      const meta = {
        title: titleRef.current.value,
        body: bodyRef.current.value,
      };
      if (!forEveryone && sendTo !== null) {
        form.consumer_user_id = sendTo.user_id;
      }
      form.viewed = 1;
      form.notif_meta = JSON.stringify(meta);
      form.notif_action = JSON.stringify({
        pathname: actionRef.current.value,
        externalUrl: externalUrl ? true : false,
      });
      const errors = {};
      if (!meta.title) {
        errors["title"] = "Title cannot be empty";
      }
      if (!meta.body) {
        errors["body"] = "Body cannot be empty";
      }
      if (Object.keys(errors).length) {
        setErrors(errors);
      } else {
        fetchData({
          before: () => setSaving(true),
          send: async () =>
            await Api.post("/notifications?token=" + Api.getToken(), {
              body: form,
            }),
          after: (data) => {
            reset();
            setSaving(false);
          },
        });
      }
      callback();
    },
    [externalUrl, forEveryone, sendTo]
  );
  const onSubmit = useCallback(() => {
    setDialogContext({
      visible: true,
      title: "Confirm",
      message: (
        <Typography>
          You are about to send a notification to{" "}
          <b>
            {forEveryone || !sendTo?.user_id
              ? "everyone"
              : sendTo.user_fname + " " + sendTo.user_lname}
          </b>
        </Typography>
      ),
      actions: [
        {
          name: "Continue",
          callback: ({ closeDialog, setLoading }) => {
            submit(closeDialog);
          },
          props: {
            variant: "contained",
            color: "primary",
          },
        },
      ],
    });
  }, [forEveryone, sendTo]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Send Notifications</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={titleRef}
          type="text"
          label="Title"
          placeholder="Title"
          {...textFieldProps}
          helperText={errors["title"]}
          error={!!errors["title"]}
        />
        <br />
        <br />
        <TextField
          inputRef={bodyRef}
          type="text"
          label="Body"
          placeholder="Body"
          multiline={true}
          rows={3}
          helperText={errors["body"]}
          error={!!errors["body"]}
          {...textFieldProps}
        />
        <br />
        <br />
        <TextField
          inputRef={actionRef}
          type="text"
          label="Action"
          placeholder="URL"
          {...textFieldProps}
          fullWidth={false}
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={externalUrl}
              onChange={(e) => setExternalUrl(e.target.checked)}
            />
          }
          label="External URL"
        />
        <br />
        <br />
        <hr />
        <br />
        <Typography>Recipient</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={forEveryone}
              onChange={(e) => setForEveryone(e.target.checked)}
            />
          }
          label="Send to all users"
        />
        {!forEveryone && (
          <React.Fragment>
            <br />
            <br />
            <UserSearch
              onChange={(val) => {
                setSendTo(val);
              }}
            />
          </React.Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={preview}>Preview</Button>
        <SavingButton
          onClick={onSubmit}
          className="themed-input"
          variant="contained"
          color="primary"
          saving={saving}
        >
          Submit
        </SavingButton>
      </DialogActions>
    </Dialog>
  );
}

export default CreateNotification;
