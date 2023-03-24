import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { MessageForm } from "../../components";

export default function ManageCode() {
  const breadcrumbs = [{ content: "Messages", url: "/" }];

  return (
    <Page>
      <TitleBar
        title="Create new Message"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <MessageForm />
    </Page>
  );
}
