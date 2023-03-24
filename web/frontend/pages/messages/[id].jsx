import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { MessageForm } from "../../components";
import { useParams } from "react-router-dom";
import { useAppQuery } from "../../hooks";

export default function MessageEdit() {
  const breadcrumbs = [{ content: "Messages", url: "/" }];


  const { id } = useParams();

  const {
    data: Message,
    isLoading,
    isRefetching,
  } = useAppQuery({
    url: `/api/messages/${id}`,
    reactQueryOptions: {
      refetchOnReconnect: false,
    },
  });

  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit Message"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned title="Message">
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned title="Message" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar
        title="Edit Message"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <MessageForm Message={Message} />
    </Page>
  );
}
