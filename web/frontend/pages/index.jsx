import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
} from "@shopify/polaris";
import { MessageIndex } from "../components";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  const navigate = useNavigate();

  const {
    data: Messages,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: "/api/messages",
  });

  const messagesMarkup = Messages?.length ? (
    <MessageIndex Messages={Messages} loading={isRefetching} />
  ) : null;

  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const emptyStateMarkup =
    !isLoading && !Messages?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Create a custom message"
          action={{
            content: "Create a new message",
            onAction: () => navigate("/messages/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Create a beautiful message, so customers will se it on the checkout page
          </p>
        </EmptyState>
      </Card>
    ) : null;

  return (
    <Page fullWidth={!!messagesMarkup}>
      <TitleBar
        title="Messages"
        primaryAction={{
          content: "Create Message",
          onAction: () => navigate("/messages/new"),
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {messagesMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
