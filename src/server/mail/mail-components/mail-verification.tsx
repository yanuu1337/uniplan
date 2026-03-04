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

export interface VerifyEmailProps {
  customerName: string;
  verifyUrl: string;
  expiresIn: Date;
  contactEmail: string;
}

export default async function VerifyEmail({
  customerName,
  verifyUrl,
  expiresIn,
  contactEmail,
}: VerifyEmailProps) {
  return (
    <Html lang="pl">
      <Head />
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Container className="mx-auto max-w-[600px] p-6">
          <Section className="font-sans text-[#222]">
            <Text className="mb-6 text-2xl font-bold">
              Verify your email address
            </Text>

            <Text className="mb-4">Hello {customerName},</Text>

            <Text className="mb-4">
              Thank you for registering on UniPlan. To activate your account,
              click the button below:
            </Text>

            <Button
              href={verifyUrl}
              className="rounded-md bg-[#2563eb] px-6 py-3 font-medium text-white"
            >
              Verify your email <ArrowRightIcon className="h-4 w-4" />
            </Button>

            <Text className="mt-6 text-sm text-[#666]">
              This link will expire in {dayjs(expiresIn).fromNow()}. If you did
              not register on UniPlan, ignore this message.
            </Text>

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
