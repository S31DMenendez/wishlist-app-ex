import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Divider,
  useBreakpoints,
  Button

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {useState} from "react";
import {json} from "@remix-run/node";
import { useLoaderData,Form } from "@remix-run/react";

import db from "../db.server";

export async function loader() {
  // get data from database
  /*let settings={
    name:"My app updated",
    description:"My app description"
  }

  return json(settings);*/

  let settings=await db.settings.findFirst();

    return json(settings);
  

}

export async function action({request}) {
  // updates persistentpor cie data
  let settings = await request.formData();
  settings=Object.fromEntries(settings);

  await db.settings.upsert({
    where:{
      id:' 1'
    },
    update:{
      name:settings.name,
      description: settings.description
    },
    create:{
      id: '1',
      name:settings.name,
      description: settings.description
    }
  });

  return json(settings);
  
  
}

export default function SettingsPage() {
  const { smUp } = useBreakpoints(); 
  const settings=useLoaderData();

  const [formState, setFormState]=useState(settings);
 
  return (
    <Page>
      <TitleBar title="Settings page" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
            <BlockStack gap="400">
              <TextField label="App name" value={formState?.name} name="name" onChange={(value)=>setFormState({...formState,name:value})} />
              <TextField label="App description" name="description" value={formState?.description} onChange={(value)=>setFormState({...formState, description:value})}/>
              <Button submit={true}>Save</Button>
            </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
        
      </BlockStack>

    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}