import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};


export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  return (
    <Page>
      <TitleBar title="Limit Business Hours for Dawn v15">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                  Automatically turn ordering on and off based on your business hours & disable "Add to Cart" on specific days & times.
                  </Text>
                  <Text variant="bodyMd" as="p">
                  *Dawn v15+ Theme only.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                  *Dawn v15+ Theme only.
                  </Text>
                  <Text as="p" variant="bodyMd">
                  Your customers will know when you are open and be able to make new orders. 
                  Once you are closed, the ability to make new orders is disabled and a message is displayed to your customers. 
                  Avoid having a customer place an order while you are closed and unable to help them. Through our app, you can manage your store hours so that your customers know when they can order from you. You can also disable products at specific times. 
                  Great for businesses like restaurants, bakeries, and grocery stores. 
                  </Text>
                  <Text>
                  <ul>
                    <li>Only receive orders when you are open through our easy scheduling tool.</li>
                    <li>Easily set and update your business hours at any time.</li>
                    <li>Notify customers of your business hours.</li>
                </ul>
                <h3><strong>Getting Started</strong></h3>
                <ul>
                    <li>Go to Online Store &gt; Themes &gt; Customise.</li>
                    <li>In the small left hand side bar, select App Embeds</li>
                    <li>You will see your new section called <b>Limit Business Hours</b> listed there.</li>
                </ul>
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                  Getting Started
                  </Text>
                  <BlockStack gap="200">
     
                      <Text as="span" variant="bodyMd">
                      <ul>
                          <li>Go to Online Store &gt; Themes &gt; Customise.</li>
                          <li>In the small left hand side bar, select App Embeds</li>
                          <li>You will see your new section called <b>Limit Business Hours</b> listed there.</li>
                      </ul>
                      </Text>
     
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an example app to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with GraphiQL
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
