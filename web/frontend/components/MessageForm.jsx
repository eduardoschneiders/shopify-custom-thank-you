import { useState, useCallback } from "react";
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  ChoiceList,
  Select,
  Thumbnail,
  Icon,
  Stack,
  TextStyle,
  Layout,
  EmptyState,
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


  const {
    fields: {
      message,
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
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title="Message">
            {Message ? (
              <EmptyState imageContained={true} />
            ) : (
              <EmptyState>
                <p>Your message will appear here after you save.</p>
              </EmptyState>
            )}
          </Card>
        </Layout.Section>
        <Layout.Section>
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
        </Layout.Section>
      </Layout>
    </Stack>
  );
}