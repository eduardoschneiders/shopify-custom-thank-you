import { useState, useCallback } from "react";
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  ChoiceList,
  Checkbox,
  Select,
  Thumbnail,
  Icon,
  Stack,
  TextStyle,
  Layout,
  EmptyState,
  Image,
  Columns,
  Text
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  ResourcePicker,
  useAppBridge,
  useNavigate,
} from "@shopify/app-bridge-react";
import { ImageMajor, AlertMinor } from "@shopify/polaris-icons";

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useAppQuery } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";

export function MessageForm({ Message: InitialMessage }) {
  const [Message, setMessage] = useState(InitialMessage);

  const navigate = useNavigate();
  const appBridge = useAppBridge();
  const fetch = useAuthenticatedFetch();

  const onSubmit = useCallback(
    (body) => {
      (async () => {
        const MessageId = Message?.id;
        const url = MessageId ? `/api/messages/${MessageId}` : "/api/messages";
        const method = MessageId ? "PATCH" : "POST";
        const response = await fetch(url, {
          method,
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          makeClean();
          const Message = await response.json();

          if (!MessageId) {
            navigate(`/messages/${Message.id}`);
          } else {
            setMessage(Message);
          }
        }
      })();
      return { status: "success" };
    },
    [Message, setMessage]
  );

  const [image_url_s, setImageUrl] = useState(Message?.image_url)

  const onChangeImageUrl = useCallback(
    (value) => {
      setImageUrl(value)
    },
    [],
  )

  const {
    fields: {
      message,
      secondary_message,
      image_url
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      message: useField({
        value: Message?.message || "",
        validates: [notEmptyString("Please add a message")],
      }),
      secondary_message: useField(Message?.secondary_message || ""),
      image_url: useField({
        value: image_url_s,
        validates: [notEmptyString("Please add a message")],
      }),
    },
    onSubmit,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMessage = useCallback(async () => {
    reset();
    setIsDeleting(true);
    const response = await fetch(`/api/messages/${Message.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      navigate(`/`);
    }
  }, [Message]);

  const [isActivating, setIsActivating] = useState(false);
  const activateMessage = useCallback(async () => {
    reset();
    setIsActivating(true);
    const response = await fetch(`/api/messages/${Message.id}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    setIsActivating(false);
    const message_response = await response.json();

    setMessage(message_response)
  }, [Message]);





  return (
    <Stack vertical>
      <Layout>
        <Layout.Section>
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card sectioned title="Message">
                <TextField
                  {...message}
                  label="Message"
                  labelHidden
                  helpText="Create a beautiful message"
                  multiline={4}
                />

                <TextField
                  {...secondary_message}
                  label="Secondary message"
                  labelHidden
                  helpText="Secondary message"
                />

                <TextField
                  {...image_url}
                  label="Image url"
                  labelHidden
                  helpText="Image Url"
                  onChange={onChangeImageUrl}
                />
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title="Image">
            <Image source={image_url_s} fit="contain" width={'100%'} />
            {Message ? (
              <EmptyState imageContained={true} />
            ) : (
              <EmptyState>
                  <p>Your image will appear here</p>
              </EmptyState>
            )}
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Columns gap="4" columns={3}>
            {Message?.id && (
              <Button
                outline
                destructive
                onClick={deleteMessage}
                loading={isDeleting}
              >
                Delete message
              </Button>
            )}

            {Message?.id && !Message.active && (
            <Button
              primary
              onClick={activateMessage}
              loading={isActivating}
              Style="margin-left: 10px;"
            >
              Activate message
            </Button>
          )}

            {Message?.id && Message.active && (
              <Text as="p" color="success">
                This is the current active message

              </Text>
            )}
          </Columns>
        </Layout.Section>
      </Layout>
    </Stack>
  );
}