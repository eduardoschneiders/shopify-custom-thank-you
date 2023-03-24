import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { MessageForm } from "../../components";

export default function MessageEdit() {
  const breadcrumbs = [{ content: "Messages", url: "/" }];

  /*
     These are mock values.
     Set isLoading to false to preview the page without loading markup.
  */
  const isLoading = false;
  const isRefetching = false;
  const Message = {
    createdAt: "2022-06-13",
    destination: "checkout",
    message: "My first Message",
    product: {}
  };

  /* Loading action and markup that uses App Bridge and Polaris components */
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
