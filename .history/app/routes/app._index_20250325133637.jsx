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

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
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

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Limit Business Hours for Dawn v15">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section variant="oneHalf">
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
                  </Text>
                </BlockStack>

                {fetcher.data?.product && (
                  <>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productCreate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.product, null, 2)}
                        </code>
                      </pre>
                    </Box>
                    <Text as="h3" variant="headingMd">
                      {" "}
                      productVariantsBulkUpdate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.variant, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
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
                          <li>You will see your new section called <b>"Limit Business Hours"</b> listed there.</li>
                      </ul>
                      </Text>
                      <List>
                        <List.Item>
                        Go to Online Store &gt; Themes &gt; Customise.<
                        </List.Item>
                        <List.Item>
                        In the small left hand side bar, select App Embeds
                        </List.Item>
                        <List.Item>
                        You will see your new section called <b>"Limit Business Hours"</b> listed there.<
                        </List.Item>
                      </List>
                      <InlineStack gap="300">
                        <Button loading={isLoading} onClick={generateProduct}>
                          Generate a product
                        </Button>
                      </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
