/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */
import React from 'react';

import {
  extend,
  render,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Layout,
  TextBlock,
  TextContainer,
  View,
  Text,
} from "@shopify/post-purchase-ui-extensions-react";


function createUrl(endpoint) {
  const embeddedAppHost = "https://38f4-2804-4b0-1198-a900-8994-8510-805b-8302.ngrok.io";
  return `${embeddedAppHost}/${endpoint}`;
}

async function getMessage() {
  const url = createUrl("api/post-purchase/get-message");
  const res = await fetch(url);
  const message = await res.json();

  return message;
}

extend("Checkout::PostPurchase::ShouldRender", async ({ storage }) => {
   const message = await getMessage();
   await storage.update({ message: message });

   return { render: true };
});

render("Checkout::PostPurchase::Render", App);

export function App({ extensionPoint, storage }) {
  const Message = storage.initialData.message;

  return (
    <BlockStack spacing="loose">
      <Layout
          maxInlineSize={0.95}
          media={[
          { viewportSize: "small", sizes: [1, 30, 1] },
          { viewportSize: "medium", sizes: [300, 30, 0.5] },
          { viewportSize: "large", sizes: [400, 30, 0.33] },
          ]}
      >
        <View>
          <Image source="https://cdn.shopify.com/static/images/examples/img-placeholder-1120x1120.png" />
        </View>
        <View />
        <BlockStack spacing="xloose">
          <TextContainer>
            <Heading>{Message.message}</Heading>
          </TextContainer>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}