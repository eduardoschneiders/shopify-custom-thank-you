import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  Icon,
  IndexTable,
  Stack,
  TextStyle,
  Thumbnail,
  UnstyledLink,
} from "@shopify/polaris";
import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

import { useMedia } from "@shopify/react-hooks";

import dayjs from "dayjs";


function SmallScreenCard({
  id,
  message,
  createdAt,
  navigate,
}) {
  return (
    <UnstyledLink onClick={() => navigate(`/messages/${id}`)}>
      <div
        style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #E1E3E5" }}
      >
        <Stack>
          <Stack.Item fill>
            <Stack vertical={true}>
              <Stack.Item>
                <p>
                  <TextStyle variation="strong">
                    {truncate(message, 35)}
                  </TextStyle>
                </p>
                <p>{dayjs(createdAt).format("MMMM D, YYYY")}</p>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    </UnstyledLink>
  );
}

export function MessageIndex({ Messages, loading }) {
  const navigate = useNavigate();

  const isSmallScreen = useMedia("(max-width: 640px)");

  const smallScreenMarkup = Messages.map((Message) => (
    <SmallScreenCard key={Message.id} navigate={navigate} {...Message} />
  ));

  const resourceName = {
    singular: "Message",
    plural: "Messages",
  };

  const rowMarkup = Messages.map(
    ({ id, message, createdAt }, index) => {
      return (
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
          onClick={() => {
            navigate(`/messages/${id}`);
          }}
        >
          <IndexTable.Cell>
            <UnstyledLink data-primary-link url={`/messages/${id}`}>
              {truncate(message, 25)}
            </UnstyledLink>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {dayjs(createdAt).format("MMMM D, YYYY")}
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    }
  );

  return (
    <Card>
      {isSmallScreen ? (
        smallScreenMarkup
      ) : (
        <IndexTable
          resourceName={resourceName}
          itemCount={Messages.length}
          headings={[
            { title: "Message" },
            { title: "Date created" }
          ]}
          selectable={false}
          loading={loading}
        >
          {rowMarkup}
        </IndexTable>
      )}
    </Card>
  );
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
