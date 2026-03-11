import {
  Html,
  Head,
  Preview,
  Section,
  Text,
  Container,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowRightIcon } from "lucide-react";

dayjs.extend(relativeTime);

export interface CalendarInviteProps {
  inviteeName: string;
  inviterName: string;
  groupName: string;
  inviteLink: string;
  expiresIn?: Date;
  contactEmail: string;
}

export default async function CalendarInvite({
  inviteeName,
  inviterName,
  groupName,
  inviteLink,
  expiresIn,
  contactEmail,
}: CalendarInviteProps) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>You are invited to a calendar group</Preview>
      <Tailwind>
        <Container className="mx-auto max-w-[600px] p-6">
          <Section className="font-sans text-[#222]">
            <Text className="mb-6 text-2xl font-bold">
              You are invited to a calendar group
            </Text>

            <Text className="mb-4">Hello {inviteeName},</Text>

            <Text className="mb-4">
              {inviterName} has invited you to join the calendar group{" "}
              <strong>{groupName}</strong>. To accept the invitation, click the
              button below:
            </Text>

            <Button
              href={inviteLink}
              className="rounded-md bg-[#2563eb] px-6 py-3 font-medium text-white"
            >
              Accept invitation <ArrowRightIcon className="h-4 w-4" />
            </Button>

            {expiresIn && (
              <Text className="mt-6 text-sm text-[#666]">
                This link will expire in {dayjs(expiresIn).fromNow()}. If you
                did not expect this invitation, ignore this message. No changes
                will be made to your account.
              </Text>
            )}

            <Hr className="my-6 border-[#e5e7eb]" />

            <Text className="text-sm text-[#666]">
              UniPlan • Message sent automatically
            </Text>
            <Text className="text-sm text-[#666]">Contact: {contactEmail}</Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
